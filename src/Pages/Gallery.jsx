 
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import PhotoGallery from "../components/gallery/PhotoGallery"
import VideoGallery from "../components/gallery/VideoGallery"
 

const Carousel = () => {
	

	return (
		<>
			<div className="section-title" id="Gallery">
				<span className="glow-soft">Class Gallery</span>
			</div>
			<div id="Carousel" className="container-carousel">
				<PhotoGallery />
			</div>

			<div className="section-title">
				<span className="glow-soft">Video Gallery</span>
			</div>
			<div className="container-carousel">
				<VideoGallery />
			</div>

			

			

			
			
			
		</>
	)
}
export default Carousel
