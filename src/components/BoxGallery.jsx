const BoxGallery = () => {
	const asset = (p) => {
		const base = import.meta.env.BASE_URL || "/"
		const clean = encodeURIComponent(String(p || "").replace(/^\//, ""))
		return `${base}${clean}`
	}
	return (
		<div id="BoxGallery">
			<div className="flex justify-between">
				<img src={asset("upload.png")} alt="" className="w-auto h-10" />
				<img src={asset("next.png")} alt="" className="h-5 w-5" />
			</div>

			<h1 className="text-white text-xl pr-3  mt-3">Class Gallery</h1>
		</div>
	)
}

export default BoxGallery
