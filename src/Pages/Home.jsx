import Navbar from "../components/Navbar"
import Slider from "react-slick"
import { useEffect, useRef, useMemo, useState } from "react"

const Home = () => {
	const d = new Date()
	const specials = {
		"1-1": { title: "Tahun Baru Masehi", subtitle: "Semoga tahun penuh berkah dan prestasi.", image: "/kebersamaan.jpg" },
		"1-10": { title: "Hari Gerakan Satu Juta Pohon", subtitle: "Mari hijaukan bumi.", image: "/kebersamaan.jpg" },
		"1-25": { title: "Hari Gizi Nasional", subtitle: "Jaga pola makan seimbang.", image: "/kebersamaan.jpg" },
		"2-4": { title: "Hari Kanker Sedunia", subtitle: "Tingkatkan kepedulian dan dukungan.", image: "/kebersamaan.jpg" },
		"2-9": { title: "Hari Pers Nasional", subtitle: "Apresiasi jurnalisme berkualitas.", image: "/kebersamaan.jpg" },
		"2-14": { title: "Happy Valentine Class!", subtitle: "Tetap saling dukung dan sayang teman.", image: "/kebersamaan.jpg" },
		"eid": { title: "Selamat Idul Fitri", subtitle: "smatech.in_k mengucapkan Mohon Maaf Lahir dan Batin.", image: "/kebersamaan.jpg" },
		"2-20": { title: "Hari Keadilan Sosial Sedunia", subtitle: "Bergerak untuk keadilan.", image: "/kebersamaan.jpg" },
		"3-8": { title: "Hari Perempuan Internasional", subtitle: "Setara, kuat, inspiratif.", image: "/kebersamaan.jpg" },
		"3-21": { title: "Hari Hutan Sedunia", subtitle: "Lestarikan hutan untuk masa depan.", image: "/kebersamaan.jpg" },
		"3-22": { title: "Hari Air Sedunia", subtitle: "Hemat dan jaga kualitas air.", image: "/kebersamaan.jpg" },
		"3-27": { title: "Hari Teater Sedunia", subtitle: "Apresiasi seni pertunjukan.", image: "/kebersamaan.jpg" },
		"4-2": { title: "Hari Peduli Autisme Sedunia", subtitle: "Dukung inklusivitas.", image: "/kebersamaan.jpg" },
		"4-21": { title: "Hari Kartini", subtitle: "Habis gelap terbitlah terang.", image: "/kebersamaan.jpg" },
		"4-22": { title: "Hari Bumi", subtitle: "Aksi kecil untuk bumi besar.", image: "/kebersamaan.jpg" },
		"4-23": { title: "Hari Buku Sedunia", subtitle: "Membaca membuka dunia.", image: "/kebersamaan.jpg" },
		"5-1": { title: "Hari Buruh Internasional", subtitle: "Kerja keras, karya terbaik.", image: "/kebersamaan.jpg" },
		"5-2": { title: "Hari Pendidikan Nasional", subtitle: "Belajar sepanjang hayat.", image: "/kebersamaan.jpg" },
		"5-20": { title: "Hari Kebangkitan Nasional", subtitle: "Bangkit dan bersatu.", image: "/kebersamaan.jpg" },
		"6-1": { title: "Hari Lahir Pancasila", subtitle: "Bhinneka Tunggal Ika.", image: "/kebersamaan.jpg" },
		"6-5": { title: "Hari Lingkungan Hidup Sedunia", subtitle: "Jaga alam, jaga hidup.", image: "/kebersamaan.jpg" },
		"6-21": { title: "Hari Musik Sedunia", subtitle: "Musik menyatukan kita.", image: "/kebersamaan.jpg" },
		"7-23": { title: "Hari Anak Nasional", subtitle: "Lindungi dan bahagiakan anak.", image: "/kebersamaan.jpg" },
		"7-29": { title: "Hari Harimau Internasional", subtitle: "Lestarikan satwa liar.", image: "/kebersamaan.jpg" },
		"8-17": { title: "Hari Kemerdekaan RI", subtitle: "Dirgahayu Indonesia!", image: "/kebersamaan.jpg" },
		"8-19": { title: "Hari Fotografi Sedunia", subtitle: "Abadikan momen berharga.", image: "/kebersamaan.jpg" },
		"9-9": { title: "Hari Olahraga Nasional", subtitle: "Sehat, bugar, berprestasi.", image: "/kebersamaan.jpg" },
		"9-21": { title: "Hari Perdamaian Internasional", subtitle: "Sebarkan damai.", image: "/kebersamaan.jpg" },
		"9-27": { title: "Hari Pariwisata Dunia", subtitle: "Jelajah dan lestarikan budaya.", image: "/kebersamaan.jpg" },
		"10-1": { title: "Hari Kesaktian Pancasila", subtitle: "Kenang dan teladani.", image: "/kebersamaan.jpg" },
		"10-5": { title: "Hari Guru Sedunia", subtitle: "Terima kasih para guru.", image: "/kebersamaan.jpg" },
		"10-28": { title: "Hari Sumpah Pemuda", subtitle: "Bersatu untuk Indonesia.", image: "/kebersamaan.jpg" },
		"11-10": { title: "Hari Pahlawan", subtitle: "Teladani semangat pahlawan.", image: "/kebersamaan.jpg" },
		"11-12": { title: "Hari Kesehatan Nasional", subtitle: "Sehat untuk Indonesia.", image: "/kebersamaan.jpg" },
		"11-25": { title: "Hari Guru Nasional", subtitle: "Mengajar, menginspirasi.", image: "/kebersamaan.jpg" },
		"12-1": { title: "Hari AIDS Sedunia", subtitle: "Peduli dan cegah stigma.", image: "/kebersamaan.jpg" },
		"12-10": { title: "Hari HAM Sedunia", subtitle: "Hormati hak asasi semua.", image: "/kebersamaan.jpg" },
		"12-22": { title: "Hari Ibu", subtitle: "Terima kasih kasih sayang ibu.", image: "/kebersamaan.jpg" }
	}
	const params = new URLSearchParams(window.location.search)
	const override = params.get("special")
	const key = `${d.getMonth() + 1}-${d.getDate()}`
	const asset = (p) => {
		const base = import.meta.env.BASE_URL || "/"
		const clean = encodeURIComponent(String(p || "").replace(/^\//, ""))
		return `${base}${clean}`
	}
	const seasonal = specials[override || key] || {
		title: "Selamat menjalankan ibadah puasa",
		subtitle: "Semoga ibadah kita diterima, tetap semangat belajar.",
		image: asset("kebersamaan.jpg"),
	}
	const year = d.getFullYear()
	const ramadhanSchedule = {
		2026: { start: "2-20", end: "3-21" },
		2025: { start: "3-1", end: "3-30" },
	}
	const inSchedule = (() => {
		const s = ramadhanSchedule[year]
		if (!s) return false
		const [sm, sd] = s.start.split("-").map(Number)
		const [em, ed] = s.end.split("-").map(Number)
		const cm = d.getMonth() + 1
		const cd = d.getDate()
		const afterStart = (cm > sm) || (cm === sm && cd >= sd)
		const beforeEnd = (cm < em) || (cm === em && cd <= ed)
		return afterStart && beforeEnd
	})()
	const showRamadhanBase = params.get("ramadhan") === "1" || inSchedule
	const inEidWindow = (() => {
		const s = ramadhanSchedule[year]
		if (!s) return false
		const [em, ed] = s.end.split("-").map(Number)
		const endDate = new Date(year, em - 1, ed)
		const eidStart = new Date(endDate)
		eidStart.setDate(endDate.getDate() + 1)
		const eidEnd = new Date(endDate)
		eidEnd.setDate(endDate.getDate() + 2)
		const today = new Date(d.getFullYear(), d.getMonth(), d.getDate())
		return today >= new Date(eidStart.getFullYear(), eidStart.getMonth(), eidStart.getDate())
			&& today <= new Date(eidEnd.getFullYear(), eidEnd.getMonth(), eidEnd.getDate())
	})()
	const showEid = (override === "eid") || inEidWindow
	const showRamadhan = showRamadhanBase && !showEid
	const ramadhanMsg = {
		title: "Selamat menjalankan ibadah puasa",
		subtitle: "Semoga ibadah kita diterima, tetap semangat belajar.",
	}
	const eidMsg = {
		title: "Selamat Idul Fitri",
		subtitle: "smatech.in_k mengucapkan Mohon Maaf Lahir dan Batin.",
	}
	const audioRef = useRef(null)
	const tracks = useMemo(() => ([
		{ url: "/ABBA-The Winner Takes it All (slowed tiktok version) little sad - Fragile Feelings.mp3", title: "The Winner Takes It All (slowed)", artist: "ABBA" },
		{ url: "/Barasuara - Terbuang Dalam Waktu (Official Video) - Barasuara.mp3", title: "Terbuang Dalam Waktu", artist: "Barasuara" },
		{ url: "/Hindia - everything u are - Hindia.mp3", title: "everything u are", artist: "Hindia" },
	]), [])
	const safeUrl = (url) => {
		const base = import.meta.env.BASE_URL || "/"
		const clean = encodeURIComponent((url || "").replace(/^\//, ""))
		return `${base}${clean}`
	}
	const playlists = useMemo(() => ([{ name: "Default", tracks }]), [tracks])
	const [plyIdx] = useState(0)
	const [trkIdx, setTrkIdx] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
	const [volume] = useState(() => {
		const v = localStorage.getItem("music_volume")
		return v ? Math.max(0, Math.min(1, parseFloat(v))) : 0.8
	})
	const [shuffle] = useState(() => localStorage.getItem("music_shuffle") === "1")
	const [repeat] = useState(() => localStorage.getItem("music_repeat") === "1")
	const [duration, setDuration] = useState(0)
	const [currentTime, setCurrentTime] = useState(0)
	const [notif, setNotif] = useState("")
	const currentTrack = playlists[plyIdx]?.tracks?.[trkIdx]
	const fmt = (s) => {
		if (!isFinite(s)) s = 0
		const m = Math.floor(s / 60)
		const r = Math.floor(s % 60)
		return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`
	}
	useEffect(() => {
		localStorage.setItem("music_playlists", JSON.stringify(playlists))
	}, [playlists])
	useEffect(() => {
		const a = audioRef.current
		if (!a) return
		a.volume = volume
		localStorage.setItem("music_volume", String(volume))
	}, [volume])
	useEffect(() => {
		localStorage.setItem("music_shuffle", shuffle ? "1" : "0")
	}, [shuffle])
	useEffect(() => {
		localStorage.setItem("music_repeat", repeat ? "1" : "0")
	}, [repeat])
	useEffect(() => {
		const a = audioRef.current
		if (!a) return
		a.pause()
		a.currentTime = 0
		setCurrentTime(0)
		if (isPlaying) {
			const p = a.play()
			if (p && typeof p.catch === "function") p.catch(() => {})
		}
	}, [plyIdx, trkIdx, isPlaying])
	const play = () => {
		const a = audioRef.current
		if (!a) return
		const p = a.play()
		if (p && typeof p.catch === "function") p.catch(() => {})
		setIsPlaying(true)
	}
	
	const next = () => {
		const pl = playlists[plyIdx]
		if (!pl || pl.tracks.length === 0) return
		let i = shuffle ? Math.floor(Math.random() * pl.tracks.length) : trkIdx + 1
		if (i >= pl.tracks.length) {
			setNotif("Playlist selesai")
			setTimeout(() => setNotif(""), 4000)
			setTrkIdx(0)
			setIsPlaying(false)
			return
		}
		setTrkIdx(i)
		setNotif(`Lagu berikutnya: ${pl.tracks[i].title}`)
		setTimeout(() => setNotif(""), 3000)
		setTimeout(() => play(), 0)
	}
	const prev = () => {
		const pl = playlists[plyIdx]
		if (!pl || pl.tracks.length === 0) return
		let i = trkIdx - 1
		if (i < 0) i = 0
		setTrkIdx(i)
		setTimeout(() => {
			if (isPlaying) play()
		}, 0)
	}
	const pause = () => {
		const a = audioRef.current
		if (!a) return
		a.pause()
		setIsPlaying(false)
	}
	
	
	
	
	
	
	
	const getSeasonalIcon = (k) => {
		if (k === "2-14") {
			return (
				<svg width="22" height="22" viewBox="0 0 24 24" fill="#ff4d6d">
					<path d="M12 21s-8-5.6-8-10a5 5 0 0110 0 5 5 0 0110 0c0 4.4-8 10-8 10z" />
				</svg>
			)
		}
		if (k === "8-17") {
			return (
				<svg width="22" height="22" viewBox="0 0 24 24">
					<rect x="2" y="6" width="20" height="6" fill="#e53935" />
					<rect x="2" y="12" width="20" height="6" fill="#ffffff" />
					<rect x="2" y="6" width="2" height="12" fill="#b71c1c" />
				</svg>
			)
		}
		if (k === "4-22") {
			return (
				<svg width="22" height="22" viewBox="0 0 24 24" fill="#4caf50">
					<path d="M12 3c-4.8 5 0 12 0 12s4.8-7 0-12z" />
					<path d="M12 15c-3 0-6 2-6 4h12c0-2-3-4-6-4z" fill="#81c784" />
				</svg>
			)
		}
		if (k === "eid" || k === "ramadhan") {
			return (
				<svg width="22" height="22" viewBox="0 0 24 24" fill="#2e7d32">
					<path d="M14 2a8 8 0 100 20 6 6 0 110-20z" />
				</svg>
			)
		}
		return (
			<svg width="22" height="22" viewBox="0 0 24 24" fill="#ffd54f">
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
	return (
		<div className="text-white px-[6%] md:px-[8%] lg:px-[10%]" id="Home">
			<Navbar />

			<div className="min-h-[80vh] flex flex-col items-center justify-center text-center py-16">
				<div
					className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-lg text-xs md:text-sm hover:bg-white/15 transition"
				>
					<span className="opacity-80">Welcome to</span>
					<span className="font-semibold">smatech.in_k</span>
				</div>
				<h1 className="mt-4 text-3xl md:text-5xl lg:text-6xl font-extrabold glow-soft">
					Smart Technology Information Karyawan
				</h1>
				<div className="opacity-80 mt-2 text-sm md:text-base">
					UNIVERSITAS HASYIM ASY&apos;ARI — UNHASY Tebuireng Jombang.
				</div>

				<div className="mt-6">
					<div className="hero-logo">
						<img
							src={asset("logoo.jpg")}
							alt="Logo"
							onError={(e) => { e.currentTarget.style.display = 'none' }}
						/>
					</div>
				</div>

				<div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-8">
					<a href="#Informasi" className="cta-btn">Lihat Informasi</a>
					<a href="#Gallery" className="cta-btn">Buka Gallery</a>
					<a href="#MusicPlayer" className="cta-btn">Fitur Lagu</a>
					<a href="#TextAnonimWidget" className="cta-btn">Buka Text Anonim</a>
				</div>
				<div className="mt-6 w-full max-w-2xl px-3 md:px-0" id="MusicPlayer">
					<div className="music-card p-4">
						<div className="text-center">
							<div className="text-sm opacity-80">{playlists[plyIdx]?.name || "Playlist"}</div>
							<div className="text-lg font-semibold" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentTrack?.title || "Tidak ada lagu"}</div>
							<div className="text-sm opacity-80" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentTrack?.artist || ""}</div>
							<div className="mt-1 text-sm opacity-80">{fmt(currentTime)} / {fmt(duration)}</div>
						</div>
						<div className="music-controls mt-3">
							<button type="button" className="control-btn" onClick={prev}>⏮</button>
							<button
								type="button"
								className="control-btn primary"
								onClick={() => { isPlaying ? pause() : play() }}
							>
								{isPlaying ? "⏸" : "▶"}
							</button>
							<button type="button" className="control-btn" onClick={next}>⏭</button>
						</div>
						{notif && (
							<div className="mt-3 px-3 py-2 rounded-xl bg-white/15 border border-white/20 text-sm">
								{notif}
							</div>
						)}
					</div>
				</div>
				<audio
					ref={audioRef}
					preload="metadata"
					onError={() => {}}
					onLoadedMetadata={() => {
						const a = audioRef.current
						if (!a) return
						setDuration(a.duration || 0)
					}}
					onTimeUpdate={() => {
						const a = audioRef.current
						if (!a) return
						setCurrentTime(a.currentTime || 0)
					}}
					onEnded={() => {
						if (repeat) {
							const a = audioRef.current
							if (a) {
								a.currentTime = 0
								const p = a.play()
								if (p && typeof p.catch === "function") p.catch(() => {})
							}
							return
						}
						next()
					}}
					src={currentTrack?.url ? safeUrl(currentTrack.url) : undefined}
					style={{ display: "none" }}
				/>
				
				

				<div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 mt-6 w-full max-w-3xl lg:max-w-4xl">
					<div className="info-card px-4 py-3 md:px-5 md:py-4 flex flex-col items-center min-h-[76px] md:min-h-[88px]">
						<div className="opacity-80 text-xs md:text-sm">Total Siswa</div>
						<div className="text-2xl md:text-3xl font-bold mt-1">13</div>
					</div>
					<div className="info-card px-4 py-3 md:px-5 md:py-4 flex flex-col items-center min-h-[76px] md:min-h-[88px]">
						<div className="opacity-80 text-xs md:text-sm">Jadwal Ramadhan</div>
						<div className="text-2xl md:text-3xl font-bold mt-1">Aktif</div>
					</div>
				</div>
					
				<div className="max-w-2xl mx-auto mt-6 px-3 md:px-0">
					<div className={`seasonal-card ${override === "2-14" || key === "2-14" ? "valentine" : ""}`} style={{ position: "relative" }}>
						<div className="seasonal-card-title">{seasonal.title}</div>
						<div className="seasonal-card-sub">{seasonal.subtitle}</div>
						<div style={{ position: "absolute", top: 8, right: 8 }}>{getSeasonalIcon(override || key)}</div>
					</div>
					{showEid && (
						<div className="seasonal-card mt-3" style={{ position: "relative" }}>
							<div className="seasonal-card-title">{eidMsg.title}</div>
							<div className="seasonal-card-sub">{eidMsg.subtitle}</div>
							<div style={{ position: "absolute", top: 8, right: 8 }}>{getSeasonalIcon("eid")}</div>
						</div>
					)}
					{showRamadhan && (
						<div className="seasonal-card ramadhan mt-3" style={{ position: "relative" }}>
							<div className="seasonal-card-title">{ramadhanMsg.title}</div>
							<div className="seasonal-card-sub">{ramadhanMsg.subtitle}</div>
							<div style={{ position: "absolute", top: 8, right: 8 }}>{getSeasonalIcon("ramadhan")}</div>
						</div>
					)}
				</div>
			</div>

			<div className="mt-8 md:mt-12">
				<div className="max-w-xl mx-auto" id="Kebersamaan">
					<Slider
						dots={true}
						arrows={true}
						slidesToShow={1}
						slidesToScroll={1}
						swipeToSlide={true}
						autoplay={true}
						autoplaySpeed={3000}
					>
						<div className="image-card">
							<img
								src={asset("rujakan.jpg")}
								alt="Rujakan Ziarah"
								onError={(e) => { e.currentTarget.src = (seasonal.image || asset("kebersamaan.jpg")) }}
							/>
							<div className="image-caption">Kebersamaan kelas — UNHASY Tebuireng Jombang</div>
						</div>
						<div className="image-card">
							<img
								src={asset("ziarah.jpg")}
								alt="Ziarah"
								onError={(e) => { e.currentTarget.style.display = 'none' }}
							/>
							<div className="image-caption">Kebersamaan kelas — UNHASY Tebuireng Jombang</div>
						</div>
					</Slider>
				</div>
			</div>
		</div>
	)
}

export default Home
