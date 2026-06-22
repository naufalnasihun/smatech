import Navbar from "../components/Navbar"
import Slider from "react-slick"
import { useEffect, useRef, useMemo, useState } from "react"
import { specials, getSeasonalIcon, getGreetingByTime } from "../utils/seasonal"

const Home = () => {
	const d = new Date()
	const params = new URLSearchParams(window.location.search)
	const override = params.get("special")
	const key = `${d.getMonth() + 1}-${d.getDate()}`

	const asset = (p) => {
		const base = import.meta.env.BASE_URL || "/"
		const s = String(p || "").replace(/^\//, "")
		const enc = s.split("/").map((seg) => encodeURIComponent(seg)).join("/")
		return `${base}${enc}`
	}

	const seasonal = specials[override || key] || getGreetingByTime(d)
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	return (
		<div className="text-white px-[6%] md:px-[8%] lg:px-[10%]" id="Home">
			<Navbar />

			<div className="min-h-[80vh] flex flex-col items-center justify-center text-center py-16">
				<div
					className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/10 backdrop-blur-lg text-xs md:text-sm hover:bg-white/15 transition"
				>
					<span className="opacity-80"></span>
					<span className="font-semibold">Informatics Engineering</span>
				</div>
				<h1 className="mt-4 text-3xl md:text-5xl lg:text-6xl font-extrabold glow-soft">
					Smart Technology Informatics Karyawan
				</h1>
				<div className="opacity-80 mt-2 text-sm md:text-base">
					Wroker Class — UNHASY Tebuireng Jombang.
				</div>

				<div className="mt-6">
					<div className="hero-logo">
						<img
							src={asset("logoo.jpg")}
							alt="Logo"
							onError={(e) => { e.currentTarget.style.display = 'none' }}
						/>
					</div>
					
					<div className="text-center mt-2 opacity-70 text-sm">
						Hari ini: {d.toLocaleDateString('id-ID', { 
							weekday: 'long', 
							year: 'numeric', 
							month: 'long', 
							day: 'numeric' 
						})}
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
					<a href="#Tabs" className="info-card px-4 py-3 md:px-5 md:py-4 flex flex-col items-center min-h-[76px] md:min-h-[88px] hover:bg-white/5 transition-colors">
						<div className="opacity-80 text-xs md:text-sm">Jadwal Kelas</div>
						<div className="text-sm font-semibold mt-1 text-center">Buka Jadwal</div>
					</a>
				</div>
					
				<div className="max-w-2xl mx-auto mt-6 px-3 md:px-0">
					<div className={`seasonal-card ${override === "2-14" || key === "2-14" ? "valentine" : ""}`} style={{ position: "relative" }}>
						<div className="seasonal-card-title">{seasonal.title}</div>
						<div className="seasonal-card-sub">{seasonal.subtitle}</div>
						<div style={{ position: "absolute", top: 8, right: 8 }}>{getSeasonalIcon(override || key)}</div>
					</div>
				</div>
			</div>

			<div className="mt-8 md:mt-12" id="Gallery">
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
								src={asset("kebersamaan.jpg")}
								alt="Kebersamaan Kelas"
								onError={(e) => { e.currentTarget.style.display = 'none' }}
							/>
							<div className="image-caption">Kebersamaan kelas — smatech.in_k</div>
						</div>
						<div className="image-card">
							<img
								src={asset("rujakan.jpg")}
								alt="Rujakan Ziarah"
								onError={(e) => { e.currentTarget.src = (seasonal.image || asset("kebersamaan.jpg")) }}
							/>
							<div className="image-caption">Kebersamaan kelas — smatech.in_k</div>
						</div>
						<div className="image-card">
							<img
								src={asset("ziarah.jpg")}
								alt="Ziarah"
								onError={(e) => { e.currentTarget.style.display = 'none' }}
							/>
							<div className="image-caption">Kebersamaan kelas — smatech.in_k</div>
						</div>
						<div className="image-card">
							<img
								src={asset("dosen1.jpg")}
								alt="Ziarah"
								onError={(e) => { e.currentTarget.style.display = 'none' }}
							/>
							<div className="image-caption">Kebersamaan kelas — smatech.in_k</div>
						</div>
						<div className="image-card">
							<img
								src={asset("dosen2.jpg")}
								alt="Ziarah"
								onError={(e) => { e.currentTarget.style.display = 'none' }}
							/>
							<div className="image-caption">Kebersamaan kelas — UNHASY Tebuireng Jombang</div>
						</div>
						<div className="image-card">
							<img
								src={asset("dosen3.jpg")}
								alt="Ziarah"
								onError={(e) => { e.currentTarget.style.display = 'none' }}
							/>
							<div className="image-caption">Kebersamaan kelas — smatech.in_k</div>
						</div>
						<div className="image-card">
							<img
								src={asset("dosen4.jpg")}
								alt="Ziarah"
								onError={(e) => { e.currentTarget.style.display = 'none' }}
							/>
							<div className="image-caption">Kebersamaan kelas — smatech.in_k</div>
						</div>
						<div className="image-card">
							<img
								src={asset("dosen5.jpg")}
								alt="Ziarah"
								onError={(e) => { e.currentTarget.style.display = 'none' }}
							/>
							<div className="image-caption">Kebersamaan kelas — smatech.in_k</div>
						</div>
						<div className="image-card">
							<img
								src={asset("dosen6.jpg")}
								alt="Ziarah"
								onError={(e) => { e.currentTarget.style.display = 'none' }}
							/>
							<div className="image-caption">Kebersamaan kelas — smatech.in_k</div>
						</div>
					</Slider>
				</div>
			</div>
		</div>
	)
}

export default Home
