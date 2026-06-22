import { useEffect, useState, useRef } from "react"
import Home from "./Pages/Home"
import Carousel from "./Pages/Gallery"
import FullWidthTabs from "./Pages/Tabs"
import Footer from "./Pages/Footer"
import AOS from "aos"
import "aos/dist/aos.css"
import { db } from "./firebase"
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore"
import { specials, getSeasonalIcon, getGreetingByTime } from "./utils/seasonal"

function TextAnonimWidget() {
	const asset = (p) => {
		const base = import.meta.env.BASE_URL || "/"
		const clean = encodeURIComponent(String(p || "").replace(/^\//, ""))
		return `${base}${clean}`
	}
	const [messages, setMessages] = useState(() => {
		try {
			const raw = localStorage.getItem("anon_msgs")
			return raw ? JSON.parse(raw) : []
		} catch {
			return []
		}
	})
	const [text, setText] = useState("")
	const boxRef = useRef(null)
	useEffect(() => {
		if (db) {
			const q = query(collection(db, "anon_msgs_public"), orderBy("createdAt", "asc"))
			const unsub = onSnapshot(q, (snap) => {
				const list = snap.docs.map((d) => d.data()?.text).filter(Boolean)
				setMessages(list)
				setTimeout(() => {
					const el = boxRef.current
					if (el) el.scrollTop = el.scrollHeight
				}, 0)
			})
			return () => unsub()
		} else {
			try {
				const raw = localStorage.getItem("anon_msgs")
				const list = raw ? JSON.parse(raw) : []
				setMessages(Array.isArray(list) ? list.map(m => m?.text || m).filter(Boolean) : [])
			} catch { /* ignore */ }
		}
	}, [])
	useEffect(() => {
		if (!db) {
			try {
				const capped = Array.isArray(messages) ? messages.slice(-200) : []
				localStorage.setItem("anon_msgs", JSON.stringify(capped.map(t => ({ text: t }))))
			} catch (e) { void e }
		}
	}, [messages])
	const send = () => {
		const v = (text || "").trim()
		if (!v) return
		if (db) {
			addDoc(collection(db, "anon_msgs_public"), { text: v, createdAt: serverTimestamp() }).catch(() => {})
		} else {
			setMessages((prev) => [...prev, v])
		}
		setText("")
		setTimeout(() => {
			const el = boxRef.current
			if (el) el.scrollTop = el.scrollHeight
		}, 0)
	}
	return (
		<div className="md:col-span-3" id="TextAnonimWidget">
			<div className="mx-auto" style={{ maxWidth: "min(100%, 720px)" }}>
				<div
					className="rounded-2xl border border-white/15 bg-white/10 text-white overflow-hidden"
					style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}
				>
					<div className="px-5 py-3 text-center text-[1.05rem] font-semibold flex items-center justify-center gap-2 border-b border-white/10">
						<img src={asset("profil.svg")} alt="" style={{ width: 20, height: 20 }} />
						<span>Text Anonim</span>
					</div>
					<div
						ref={boxRef}
						className="px-4 py-3"
						style={{ height: "clamp(260px, 38vh, 380px)", overflowY: "auto" }}
					>
						{messages.map((m, i) => {
							const t = typeof m === "string" ? m : m?.text
							return (
								<div key={i} className="mb-3 flex items-start gap-3">
									<img src={asset("profil.svg")} alt="" style={{ width: 24, height: 24, borderRadius: 9999 }} />
									<div
										className="px-3 py-2 rounded-lg"
										style={{ background: "rgba(255,255,255,0.08)", flex: 1, wordBreak: "break-word" }}
									>
										{t}
									</div>
								</div>
							)
						})}
					</div>
					<div className="flex border-t border-white/10 px-4 py-4 gap-2 md:gap-3">
						<input
							type="text"
							value={text}
							onChange={(e) => setText(e.target.value)}
							onKeyDown={(e) => { if (e.key === "Enter") send() }}
							className="flex-1 min-w-0 bg-white/10 text-white px-3 py-2 outline-none rounded-lg"
							placeholder="Ketik pesan..."
						/>
						<button
							type="button"
							onClick={send}
							className="px-4 md:px-5 py-2 bg-blue-600 rounded-lg flex-shrink-0 whitespace-nowrap text-sm md:text-base"
							style={{ boxShadow: "0 6px 20px rgba(37,99,235,0.4)" }}
						>
							Kirim
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

function App() {
	const [now, setNow] = useState(new Date())
	const [prayer, setPrayer] = useState(null)
	const [showAbout, setShowAbout] = useState(false)
	const [showTopNotif, setShowTopNotif] = useState(false)
	const [dragX, setDragX] = useState(0)
	const [dragging, setDragging] = useState(false)
	const [startX, setStartX] = useState(0)
	const d = new Date()
	const params = new URLSearchParams(window.location.search)
	const override = params.get("special")
	const key = `${d.getMonth() + 1}-${d.getDate()}`
	const seasonalKey = override || key
	const seasonalTop = specials[seasonalKey] || getGreetingByTime(d)
	
	useEffect(() => {
		AOS.init()
		AOS.refresh()
		if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual"
		if (location.hash) history.replaceState(null, "", location.pathname + location.search)
	}, [])
	useEffect(() => {
		setShowTopNotif(true)
		const t = setTimeout(() => setShowTopNotif(false), 7000)
		return () => clearTimeout(t)
	}, [])

	

	useEffect(() => {
		const t = setInterval(() => setNow(new Date()), 1000)
		return () => clearInterval(t)
	}, [])

	useEffect(() => {
		let dailyTimeout = null
		let dailyInterval = null
		const fetchPrayer = async () => {
			try {
				const res = await fetch("https://api.aladhan.com/v1/timingsByCity?city=Jombang&country=Indonesia&method=20")
				const data = await res.json()
				setPrayer(data.data?.timings || null)
			} catch {
				setPrayer(null)
			}
		}
		const scheduleNextMidnight = () => {
			const now = new Date()
			const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 5, 0)
			const ms = next.getTime() - now.getTime()
			dailyTimeout = setTimeout(async () => {
				await fetchPrayer()
				dailyInterval = setInterval(fetchPrayer, 86400000)
			}, ms)
		}
		fetchPrayer()
		scheduleNextMidnight()
		return () => {
			if (dailyTimeout) clearTimeout(dailyTimeout)
			if (dailyInterval) clearInterval(dailyInterval)
		}
	}, [])
	return (
		<>
			{showTopNotif && (
				<div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] w-[90%] md:w-[640px]">
					<div
						className={`top-notif ${seasonalKey === "2-14" ? "valentine" : ""} flex items-center justify-between`}
						style={{ transform: `translateX(${dragX}px)` }}
						onPointerDown={(e) => { setDragging(true); setStartX(e.clientX) }}
						onPointerMove={(e) => { if (!dragging) return; setDragX(e.clientX - startX) }}
						onPointerUp={() => { if (Math.abs(dragX) > 60) setShowTopNotif(false); setDragging(false); setDragX(0) }}
						onPointerCancel={() => { setDragging(false); setDragX(0) }}>
						<div className="flex items-center gap-2">
							<div className="w-5 h-5">{getSeasonalIcon(seasonalKey)}</div>
							<div className="font-semibold">{seasonalTop.title}</div>
							<div className="opacity-80 text-sm mt-0.5">{seasonalTop.subtitle}</div>
						</div>
						<button
							className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20"
							onClick={() => setShowTopNotif(false)}>
							✕
						</button>
					</div>
				</div>
			)}
			{showAbout && (
				<div
					className="fixed inset-0 z-[9998] flex items-center justify-center"
					style={{ background: "rgba(0,0,0,0.5)" }}
					onClick={() => setShowAbout(false)}
				>
					<div className="modal-container" onClick={(e) => e.stopPropagation()}>
						<div className="text-center text-white text-xl font-bold mb-2">Tentang Kelas</div>
						<div className="text-white opacity-90 text-sm leading-relaxed">
							Kelas smatech.in_k adalah ruang belajar teknologi informasi dengan semangat kebersamaan.
							Kita bertemu untuk saling support, fokus pada proses, dan konsisten memperbaiki diri.
							Setiap langkah kecil bernilai. Jaga adab, disiplin, dan terus saling menguatkan.
						</div>
						<div className="mt-4 text-center">
							<button
								className="px-4 py-2 rounded-2xl bg-white/15 text-white hover:bg-white/25 transition"
								onClick={() => setShowAbout(false)}
							>
								Tutup
							</button>
						</div>
					</div>
				</div>
			)}
			<Home />

			<Carousel />
			<FullWidthTabs />

			<div id="Mesh1"></div>

			<div id="Informasi" className="px-[10%] text-white mt-16">
				<div className="text-2xl font-bold mb-4">Informasi</div>
				<div className="opacity-80 mb-6">
					Pengumuman kegiatan kelas dan update penting akan ditampilkan di sini.
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-8">
					<div
						className="block w-full text-left p-5 rounded-2xl info-card view-only hover-link"
					>
						<div className="flex items-center gap-3 mb-2">
							<span className="text-xl">⏰</span>
							<div className="text-lg font-semibold">Jam & Kalender</div>
						</div>
						<div className="mt-2 text-2xl font-bold">
							{now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
						</div>
						<div className="opacity-80 text-sm mt-1">
							{now.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
						</div>
					</div>
					<button
						type="button"
						className="block w-full text-left p-5 rounded-2xl info-card hover-link"
						onClick={() => setShowAbout(true)}
					>
						<div className="flex items-center gap-3 mb-2">
							<span className="text-xl">📘</span>
							<div className="text-lg font-semibold">Tentang Kelas</div>
						</div>
						<div className="opacity-80 text-sm">smatech.in_k — Smart Technology Informatics Karyawan (UNHASY).</div>
					</button>
					<a href="https://unhasy.ac.id" target="_blank" rel="noopener noreferrer" className="block p-5 rounded-2xl info-card hover-link">
						<div className="flex items-center gap-3 mb-2">
							<span className="text-xl">🏫</span>
							<div className="text-lg font-semibold">Universitas</div>
						</div>
						<div className="opacity-80 text-sm">Universitas Hasyim Asy&apos;ari, Tebuireng Jombang.</div>
					</a>
					
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-8">
					<a href="#Informasi" className="block p-5 rounded-2xl info-card hover-link">
						<div className="flex items-center gap-3 mb-2">
							<span className="text-xl">🕌</span>
							<div className="text-lg font-semibold">Jadwal Adzan Jombang</div>
						</div>
						<div className="opacity-80 text-sm">
							{prayer ? (
								<div className="grid grid-cols-2 gap-2 mt-2">
									<div>Imsak</div><div className="text-right font-semibold">{prayer.Imsak}</div>
									<div>Subuh</div><div className="text-right font-semibold">{prayer.Fajr}</div>
									<div>Dzuhur</div><div className="text-right font-semibold">{prayer.Dhuhr}</div>
									<div>Ashar</div><div className="text-right font-semibold">{prayer.Asr}</div>
									<div>Maghrib</div><div className="text-right font-semibold">{prayer.Maghrib}</div>
									<div>Isya</div><div className="text-right font-semibold">{prayer.Isha}</div>
								</div>
							) : (
								<div>Gagal memuat jadwal. Pastikan koneksi aktif.</div>
							)}
						</div>
						<div className="opacity-70 text-xs mt-2">Domisili: Kabupaten Jombang, Jawa Timur</div>
					</a>
					<button
						type="button"
						className="block w-full text-left p-5 rounded-2xl info-card hover-link"
						onClick={() => {
							const el = document.getElementById("Tabs")
							if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
							window.dispatchEvent(new CustomEvent("tabs:set", { detail: 1 }))
						}}
					>
						<div className="flex items-center gap-3 mb-2">
							<span className="text-xl">📅</span>
							<div className="text-lg font-semibold">Agenda Terdekat</div>
						</div>
						<div className="opacity-80 text-sm">Pertemuan kelas pekan ini, cek jadwal kelas.</div>
					</button>
					<a href="#Kebersamaan" className="block p-5 rounded-2xl info-card hover-link">
						<div className="flex items-center gap-3 mb-2">
							<span className="text-xl">📣</span>
							<div className="text-lg font-semibold">Pengumuman</div>
						</div>
						<div className="opacity-80 text-sm">Silakan update data siswa via tautan berikut.</div>
					</a>
					<a href="https://s.id/FTIUNHASY" target="_blank" rel="noopener noreferrer" className="block p-5 rounded-2xl info-card hover-link">
						<div className="flex items-center gap-3 mb-2">
							<span className="text-xl">🔗</span>
							<div className="text-lg font-semibold">Prodi FTI</div>
						</div>
						<div className="opacity-80 text-sm">Pusat layanan online mahasiswa FTI UNHASY.</div>
					</a>
					<button
						type="button"
						className="block w-full text-left p-5 rounded-2xl info-card hover-link"
						onClick={() => {
							const el = document.getElementById("TextAnonimWidget")
							if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
							const inp = el ? el.querySelector('input[type="text"]') : null
							if (inp) inp.focus()
						}}
					>
						<div className="flex items-center gap-3 mb-2">
							<span className="text-xl">💬</span>
							<div className="text-lg font-semibold">Text Anonim</div>
						</div>
						<div className="opacity-80 text-sm">Buka dan kirim pesan anonim kelas.</div>
					</button>
					<TextAnonimWidget />
				</div>
				
			</div>


			
			

			<Footer />
		</>
	)
}
export default App
