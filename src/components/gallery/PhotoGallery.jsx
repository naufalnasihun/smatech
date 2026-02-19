import { useEffect, useState } from "react"
import Slider from "react-slick"
import Modal from "@mui/material/Modal"
import { IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { useSpring, animated } from "@react-spring/web"
import { LOCAL_PHOTOS } from "../../data/galleryMedia"

const STORAGE_KEY = "gallery_local_photos"

const PhotoGallery = () => {
  const [images, setImages] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const modalFade = useSpring({
    opacity: open ? 1 : 0,
    config: { duration: 300 },
  })

  const fetchImages = async () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const extras = raw ? JSON.parse(raw) : []
      const safeExtras = Array.isArray(extras) ? extras.filter((x) => x && x.url) : []
      setImages([...LOCAL_PHOTOS, ...safeExtras])
    } catch {
      setImages([...LOCAL_PHOTOS])
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])
  useEffect(() => {
    const handler = () => fetchImages()
    window.addEventListener("gallery:refresh", handler)
    return () => window.removeEventListener("gallery:refresh", handler)
  }, [])
  useEffect(() => {
    const addHandler = (e) => {
      try {
        const { url, name = "" } = (e.detail || {})
        if (!url) return
        const raw = localStorage.getItem(STORAGE_KEY)
        const extras = raw ? JSON.parse(raw) : []
        const list = Array.isArray(extras) ? extras : []
        list.push({ url, name })
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
        fetchImages()
      } catch {
        // ignore
      }
    }
    window.addEventListener("gallery:add", addHandler)
    return () => window.removeEventListener("gallery:add", addHandler)
  }, [])

  const settings = {
    centerMode: true,
    centerPadding: "0px",
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2400,
    dots: true,
    adaptiveHeight: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, arrows: false, centerPadding: "0px" } },
      { breakpoint: 768, settings: { slidesToShow: 1, arrows: false, centerPadding: "0px", centerMode: false, variableWidth: false } },
    ],
  }

  const onClickImage = (url) => {
    setSelectedImage(url)
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
    setSelectedImage(null)
  }

  return (
    <>
      <Slider {...settings}>
        {images.map((item, idx) => {
          const url = typeof item === "string" ? item : item.url
          const base = url.split("/").pop() || ""
          const name = typeof item === "string" ? base : (item.name || base)
          return (
            <div key={idx} className="image-card" onClick={() => onClickImage(url)} style={{ cursor: "pointer" }}>
              <img src={url} alt={name} onError={(e) => { e.currentTarget.style.display = 'none' }} />
              <div className="image-caption">{name}</div>
            </div>
          )
        })}
      </Slider>

      <Modal open={open} onClose={onClose} aria-labelledby="photo-modal" aria-describedby="photo-modal-description" className="flex justify-center items-center">
        <animated.div
          style={{
            ...modalFade,
            maxWidth: "90vw",
            maxHeight: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
          className="p-2 rounded-lg">
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            sx={{ position: "absolute", top: "12px", right: "23px", backgroundColor: "white", borderRadius: "50%" }}>
            <CloseIcon />
          </IconButton>
          <div className="w-full">
            <img src={selectedImage} alt="Selected Image" style={{ maxWidth: "100%", maxHeight: "100vh" }} />
          </div>
        </animated.div>
      </Modal>
    </>
  )
}

export default PhotoGallery
