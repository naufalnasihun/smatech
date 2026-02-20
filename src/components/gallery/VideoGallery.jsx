import { useEffect, useState } from "react"
import Slider from "react-slick"
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from "firebase/storage"
import { LOCAL_VIDEOS } from "../../data/galleryMedia"

const VideoGallery = () => {
  const asset = (u) => {
    if (!u) return u
    const s = String(u)
    if (/^(https?:|data:)/.test(s)) return s
    const base = import.meta.env.BASE_URL || "/"
    const clean = encodeURIComponent(s.replace(/^\//, ""))
    return `${base}${clean}`
  }
  const [videos, setVideos] = useState([])

  const fetchVideos = async () => {
    try {
      const storage = getStorage()
      const storageRef = ref(storage, "VideoAman/")
      const list = await listAll(storageRef)
      const items = await Promise.all(list.items.map(async (item) => {
        const url = await getDownloadURL(item)
        const meta = await getMetadata(item)
        return { url, name: meta.name || "", size: Number(meta.size || 0), timeCreated: meta.timeCreated }
      }))
      const limit = 25 * 1024 * 1024
      const filtered = items.filter((x) => !Number.isNaN(x.size) ? x.size <= limit : true)
      filtered.sort((a, b) => (new Date(a.timeCreated).getTime() || 0) - (new Date(b.timeCreated).getTime() || 0))
      const firebaseItems = filtered.map(({ url, name }) => ({ url, name }))
      setVideos([...LOCAL_VIDEOS, ...firebaseItems])
    } catch (e) {
      console.warn("Video tidak dapat dimuat:", e)
      setVideos([...LOCAL_VIDEOS])
    }
  }
  useEffect(() => {
    fetchVideos()
  }, [])
  useEffect(() => {
    const handler = () => fetchVideos()
    window.addEventListener("videoGallery:refresh", handler)
    return () => window.removeEventListener("videoGallery:refresh", handler)
  }, [])

  const settings = {
    dots: true,
    arrows: true,
    centerMode: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, arrows: true } },
      { breakpoint: 768, settings: { slidesToShow: 1, arrows: true } },
    ],
  }

  return (
    <div id="VideoGallery" className="mx-[10%]">
      {videos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-card">
            <div className="empty-title">Video belum ditambahkan</div>
            <div className="empty-sub">Konten video akan muncul di sini jika tersedia.</div>
          </div>
        </div>
      ) : (
        <Slider {...settings}>
          {videos.map((item, idx) => {
            const url = typeof item === "string" ? item : item.url
            const base = url.split("/").pop() || ""
            const name = typeof item === "string" ? base : (item.name || base)
            return (
            <div key={idx} className="video-card">
              <video
                src={asset(url)}
                controls
                controlsList="nodownload noplaybackrate noremoteplayback"
                disablePictureInPicture
                playsInline
                className="rounded-lg w-full"
                style={{ height: "clamp(180px, 32vh, 280px)" }}
                onError={(e) => {
                  e.currentTarget.parentElement.style.display = "none"
                }}
                onContextMenu={(e) => e.preventDefault()}
              />
              <div className="text-white opacity-80 text-sm mt-2">{name}</div>
            </div>
            )
          })}
        </Slider>
      )}
    </div>
  )
}

export default VideoGallery
