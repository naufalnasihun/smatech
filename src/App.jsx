import { useEffect, useState, useRef } from "react"
import Home from "./Pages/Home"
import Carousel from "./Pages/Gallery"
import FullWidthTabs from "./Pages/Tabs"
import Footer from "./Pages/Footer"
import AOS from "aos"
import "aos/dist/aos.css"

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
		try {
			const capped = Array.isArray(messages) ? messages.slice(-200) : []
			localStorage.setItem("anon_msgs", JSON.stringify(capped))
		} catch (e) { void e }
	}, [messages])
	const send = () => {
		const v = (text || "").trim()
		if (!v) return
		setMessages((prev) => [...prev, { text: v, ts: Date.now() }])
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
	const specials = {
		"1-1": { title: "Tahun Baru Masehi", subtitle: "Semoga tahun penuh berkah dan prestasi." },
		"1-10": { title: "Hari Gerakan Satu Juta Pohon", subtitle: "Mari hijaukan bumi." },
		"1-25": { title: "Hari Gizi Nasional", subtitle: "Jaga pola makan seimbang." },
		"2-4": { title: "Hari Kanker Sedunia", subtitle: "Tingkatkan kepedulian dan dukungan." },
		"2-9": { title: "Hari Pers Nasional", subtitle: "Apresiasi jurnalisme berkualitas." },
		"2-14": { title: "Selamat Hari Kasih Sayang", subtitle: "Sebarkan cinta dan kebaikan." },
		"eid": { title: "Selamat Idul Fitri", subtitle: "smatech.in_k mengucapkan Mohon Maaf Lahir dan Batin." },
		"2-20": { title: "Hari Keadilan Sosial Sedunia", subtitle: "Bergerak untuk keadilan." },
		"3-8": { title: "Hari Perempuan Internasional", subtitle: "Setara, kuat, inspiratif." },
		"3-21": { title: "Hari Hutan Sedunia", subtitle: "Lestarikan hutan untuk masa depan." },
		"3-22": { title: "Hari Air Sedunia", subtitle: "Hemat dan jaga kualitas air." },
		"3-27": { title: "Hari Teater Sedunia", subtitle: "Apresiasi seni pertunjukan." },
		"4-2": { title: "Hari Peduli Autisme Sedunia", subtitle: "Dukung inklusivitas." },
		"4-21": { title: "Hari Kartini", subtitle: "Habis gelap terbitlah terang." },
		"4-22": { title: "Hari Bumi", subtitle: "Aksi kecil untuk bumi besar." },
		"4-23": { title: "Hari Buku Sedunia", subtitle: "Membaca membuka dunia." },
		"5-1": { title: "Hari Buruh Internasional", subtitle: "Kerja keras, karya terbaik." },
		"5-2": { title: "Hari Pendidikan Nasional", subtitle: "Belajar sepanjang hayat." },
		"5-20": { title: "Hari Kebangkitan Nasional", subtitle: "Bangkit dan bersatu." },
		"6-1": { title: "Hari Lahir Pancasila", subtitle: "Bhinneka Tunggal Ika." },
		"6-5": { title: "Hari Lingkungan Hidup Sedunia", subtitle: "Jaga alam, jaga hidup." },
		"6-21": { title: "Hari Musik Sedunia", subtitle: "Musik menyatukan kita." },
		"7-23": { title: "Hari Anak Nasional", subtitle: "Lindungi dan bahagiakan anak." },
		"7-29": { title: "Hari Harimau Internasional", subtitle: "Lestarikan satwa liar." },
		"8-17": { title: "Hari Kemerdekaan RI", subtitle: "Dirgahayu Indonesia!" },
		"8-19": { title: "Hari Fotografi Sedunia", subtitle: "Abadikan momen berharga." },
		"9-9": { title: "Hari Olahraga Nasional", subtitle: "Sehat, bugar, berprestasi." },
		"9-21": { title: "Hari Perdamaian Internasional", subtitle: "Sebarkan damai." },
		"9-27": { title: "Hari Pariwisata Dunia", subtitle: "Jelajah dan lestarikan budaya." },
		"10-1": { title: "Hari Kesaktian Pancasila", subtitle: "Kenang dan teladani." },
		"10-5": { title: "Hari Guru Sedunia", subtitle: "Terima kasih para guru." },
		"10-28": { title: "Hari Sumpah Pemuda", subtitle: "Bersatu untuk Indonesia." },
		"11-10": { title: "Hari Pahlawan", subtitle: "Teladani semangat pahlawan." },
		"11-12": { title: "Hari Kesehatan Nasional", subtitle: "Sehat untuk Indonesia." },
		"11-25": { title: "Hari Guru Nasional", subtitle: "Mengajar, menginspirasi." },
		"12-1": { title: "Hari AIDS Sedunia", subtitle: "Peduli dan cegah stigma." },
		"12-10": { title: "Hari HAM Sedunia", subtitle: "Hormati hak asasi semua." },
		"12-22": { title: "Hari Ibu", subtitle: "Terima kasih kasih sayang ibu." }
	}
	const params = new URLSearchParams(window.location.search)
	const override = params.get("special")
	const key = `${d.getMonth() + 1}-${d.getDate()}`
	const year = d.getFullYear()
	const ramadhanEndByYear = {
		2026: "3-21",
		2025: "3-30",
	}
	const inEidWindow = (() => {
		const e = ramadhanEndByYear[year]
		if (!e) return false
		const [em, ed] = e.split("-").map(Number)
		const endDate = new Date(year, em - 1, ed)
		const eidStart = new Date(endDate)
		eidStart.setDate(endDate.getDate() + 1)
		const eidEnd = new Date(endDate)
		eidEnd.setDate(endDate.getDate() + 2)
		const today = new Date(d.getFullYear(), d.getMonth(), d.getDate())
		return today >= new Date(eidStart.getFullYear(), eidStart.getMonth(), eidStart.getDate())
			&& today <= new Date(eidEnd.getFullYear(), eidEnd.getMonth(), eidEnd.getDate())
	})()
	const seasonalKey = override || (inEidWindow ? "eid" : key)
	const seasonalTop = specials[seasonalKey] || {
		title: "Selamat menjalankan ibadah puasa",
		subtitle: "Semoga ibadah kita diterima, tetap semangat belajar.",
	}
	const getSeasonalIcon = (k) => {
		if (k === "2-14") {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="#ff4d6d">
					<path d="M12 21s-8-5.6-8-10a5 5 0 0110 0 5 5 0 0110 0c0 4.4-8 10-8 10z" />
				</svg>
			)
		}
		if (k === "8-17") {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24">
					<rect x="2" y="6" width="20" height="6" fill="#e53935" />
					<rect x="2" y="12" width="20" height="6" fill="#ffffff" />
					<rect x="2" y="6" width="2" height="12" fill="#b71c1c" />
				</svg>
			)
		}
		if (k === "4-22") {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="#4caf50">
					<path d="M12 3c-4.8 5 0 12 0 12s4.8-7 0-12z" />
					<path d="M12 15c-3 0-6 2-6 4h12c0-2-3-4-6-4z" fill="#81c784" />
				</svg>
			)
		}
		if (k === "eid" || k === "ramadhan") {
			return (
				<svg width="20" height="20" viewBox="0 0 24 24" fill="#2e7d32">
					<path d="M14 2a8 8 0 100 20 6 6 0 110-20z" />
				</svg>
			)
		}
		return (
			<svg width="20" height="20" viewBox="0 0 24 24" fill="#ffd54f">
				<circle cx="12" cy="12" r="4" />
				<g stroke="#ffd54f" strokeWidth="2">
					<line x1="12" y1="2" x2="12" y2="6" />
					<line x1="12" y1="18" x2="12" y2="22" />
					<line x1="2" y1="12" x2="6" y2="12" />
					<line x1="18" y1="12" x2="22" y2="12" />
				</g>
			</svg>
		)
	}
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
						<div className="opacity-80 text-sm">Pertemuan kelas pekan ini, cek jadwal Ramadhan.</div>
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
