import Rating from "../components/Rating"

const Footer = () => {
	const asset = (p) => {
		const base = import.meta.env.BASE_URL || "/"
		const clean = encodeURIComponent(String(p || "").replace(/^\//, ""))
		return `${base}${clean}`
	}
	return (
		<footer className="" id="Footer">
			<div className="mx-auto w-full max-w-screen-xl px-8 py-6 lg:py-8">
				<div className="md:flex md:justify-between">
					<div className="mb-6 md:mb-0">
						<a href="#" className="flex items-center">
							<img
								src={asset("logoo.jpg")}
								alt=""
								className="h-[4.5rem] w-[4.5rem] right-2 relative rounded-full brightness-200"
							/>
							<span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"></span>
						</a>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3">
						<div className=" ">
							<h2 className="mb-4 text-sm font-semibold uppercase text-white">CREATED BY</h2>
							<ul className="text-gray-400 dark:text-gray-400 font-medium">
								<p>Sihunnn</p>
								<li>
									<a href="" className="hover:underline">
										Gmail : smatecink@gmail.com
									</a>
								</li>
							</ul>
						</div>
						<div className="">
							<h2 className="mb-4 text-sm font-semibold uppercase text-white">Follow us</h2>
							<ul className="text-gray-400 dark:text-gray-400 font-medium">
								<li className="mb-2">
									<a href="https://www.instagram.com/smatec.in_k?igsh=aTlqempuNXU2aWVz" className="hover:underline ">
										Instagram smatec
									</a>
								</li>
								<li>
									<a href="https://www.tiktok.com/@smatec_ink" className="hover:underline">
										Tiktok smatec
									</a>
								</li>
							</ul>
						</div>
						<div className="hidden md:block">
							<Rating />
						</div>
					</div>

					<div className="flex items-center justify-center mt-8  md:hidden">
						{/* RATING */}
						<Rating />
					</div>
				</div>
				<hr className="my-2 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
				<div className="sm:flex sm:items-center sm:justify-between">
					<div className="flex mt-4 justify-center sm:mt-0">
						<p className="text-[0.7rem] text-white opacity-70">
							© {new Date().getFullYear()}Smatech.in_k | Di Kelola Oleh mahasiswa smatech.in_k
						</p>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
