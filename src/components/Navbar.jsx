import { useEffect, useState } from "react"

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	useEffect(() => {
		if ("scrollRestoration" in window.history) {
			window.history.scrollRestoration = "manual"
		}
	}, [])

	return (
		<>
			{/* Mobile */}
			<div className="flex justify-between relative top-3 lg:hidden">
				<div className="w-10 h-10 rounded-full flex justify-center items-center" id="UserButton">
					<img src="./NavIcon.png" alt="" className="w-6 h-6" onClick={toggleMenu} />
				</div>
				<div className={`text-center text-white ${isMenuOpen ? "hidden" : ""}`}>
					<div className="text-[0.7rem]">Hi, Pengguna smatec.in_k !</div>
					<div className="font-bold text-[1rem]">WELCOME</div>
				</div>

				<div
					className={`w-10 h-10 rounded-full flex justify-center items-center `}
					id="UserButton">
					<img src="./user.svg" alt="" className="" />
				</div>

				{isMenuOpen && (
					<div className="fixed inset-0 bg-black opacity-50 z-10" onClick={toggleMenu}></div>
				)}

				<div
					className={`fixed top-0 left-0 h-full w-64 bg-black/80 backdrop-blur-md border-r border-white/10 px-4 overflow-y-auto shadow-lg transform transition-transform duration-300 ease-in-out ${
						isMenuOpen ? "translate-x-0" : "-translate-x-full"
					}`}
					id="IsiNavbar">
					<ul className="mt-8">
						<li className="mb-4">
							<a href="#Home" onClick={toggleMenu} className="text-white opacity-80 text-lg font-bold glow-soft transition-all hover:opacity-100 hover:scale-[1.02]">
								Home
							</a>
						</li>
						<li className="mb-4">
							<a href="#Gallery" onClick={toggleMenu} className="text-white opacity-80 text-lg font-bold glow-soft transition-all hover:opacity-100 hover:scale-[1.02]">
								Gallery
							</a>
						</li>
						<li className="mb-4">
							<a href="#Informasi" onClick={toggleMenu} className="text-white opacity-80 text-lg font-bold glow-soft transition-all hover:opacity-100 hover:scale-[1.02]">
								Informasi
							</a>
						</li>
						<li>
							<a href="#Tabs" onClick={toggleMenu} className="text-white opacity-80 text-lg font-bold glow-soft transition-all hover:opacity-100 hover:scale-[1.02]">
								Structure & Schedule
							</a>
						</li>
					</ul>
				</div>
			</div>

			{/* Dekstop */}
			<div className="flex justify-between relative top-3 hidden lg:flex">
				<div>
					<img src="./logoo.jpg" className="w-12 h-12 rounded-full" alt="Logo" />
				</div>
				<ul className="mt-2 flex gap-5">
					<li className="mb-4">
						<a href="#Home" className="text-white opacity-80 text-[1rem] font-semibold glow-soft transition-all hover:opacity-100 hover:scale-[1.02]">
							Home
						</a>
					</li>
					<li className="mb-4">
						<a href="#Gallery" className="text-white opacity-80 text-[1rem] font-semibold glow-soft transition-all hover:opacity-100 hover:scale-[1.02]">
							Gallery
						</a>
					</li>
					<li>
						<a href="#Tabs" className="text-white opacity-80 text-[1rem] font-semibold glow-soft transition-all hover:opacity-100 hover:scale-[1.02]">
							Structure & Schedule
						</a>
					</li>
					<li>
						<a href="#Informasi" className="text-white opacity-80 text-[1rem] font-semibold glow-soft transition-all hover:opacity-100 hover:scale-[1.02]">
							Informasi
						</a>
					</li>
				</ul>
			</div>
		</>
	)
}

export default Navbar
