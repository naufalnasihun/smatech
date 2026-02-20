import { useEffect, useState } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

const StrukturKelas = () => {
	const [pressed, setPressed] = useState(null)
	useEffect(() => {
		AOS.init()
		AOS.refresh()
	}, [])

	const anggota = [
		{ nama: "Marindra Puspitawati", photoUrl: "/rindra.jpg" },
		{ nama: "Elok Dewi Wulan Sari" , photoUrl: 	"/elok.jpg" },
		{ nama: "ARLICHAH" , photoUrl: "/arlychah.jpg" },
		{ nama: "Ridwan Panca Nagara" , photoUrl: "/ridwan.jpg" },
		{ nama: "Naufal Nashihun Nizhom" , photoUrl: "/sihun.jpg" },
		{ nama: "Dimas Ferdiansyah" , photoUrl: "/dimas.jpg" },
		{ nama: "AM Husni Mubarok" , photoUrl: "/husni.jpg" },
		{ nama: "Noval Fajar Idzal Ardiansah" , photoUrl: "/nopal.jpg" },
		{ nama: "Athailla Syadito Ramadhan" , photoUrl: "/ata.jpg" },
		{ nama: "Muhammad Akbar Din" , photoUrl: "/akbar.jpg" },
		{ nama: "MOHAMMAD BAGUS ADLAN" , photoUrl: "/bagus.jpg" },
		{ nama: "Rendi Asy'ari" , photoUrl: "/rendi.jpg" },	
		{ nama: "Saiful Alam" , photoUrl: "/saiful.jpg" },
	]
	const toFilename = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")

	return (
		<div className="px-4 md:px-[10%]">
			<div className="text-white text-2xl font-bold mt-10 mb-6">Struktur Kelas</div>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
				{anggota.map((item, idx) => {
					return (
					<div
						key={idx}
						className="profile-card flex flex-col items-center text-white"
						data-aos="fade-up"
						data-aos-duration={500 + idx * 50}>
						<img
							src={item.photoUrl ? item.photoUrl : `/struktur/${toFilename(item.nama)}.jpg`}
							alt={item.nama}
							className={`profile-photo h-20 w-20 md:h-24 md:w-24 rounded-full object-cover mb-2 brightness-105 ${pressed === idx ? "pressed" : ""}`}
							onError={(e) => { e.currentTarget.src = "/user.svg" }}
							onMouseDown={() => setPressed(idx)}
							onMouseUp={() => setPressed(null)}
							onMouseLeave={() => setPressed(null)}
							onTouchStart={() => setPressed(idx)}
							onTouchEnd={() => setPressed(null)}
						/>
						<div className="profile-name bg-white text-black rounded-3xl text-xs md:text-sm px-3 py-2 font-semibold text-center w-[86%]">
							{item.nama}
						</div>
					</div>
					)
				})}
			</div>
		</div>
	)
}

export default StrukturKelas
