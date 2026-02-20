import * as React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Slider from "@mui/material/Slider"
import { collection, addDoc } from "firebase/firestore"
import { db } from "../firebase"

const units = ["/Rating/1.png", "/Rating/2.png", "/Rating/3.png", "/Rating/4.png", "/Rating/5.png"]

// Firestore dari konfigurasi aplikasi

export default function Rating() {
    const asset = (p) => {
        const base = import.meta.env.BASE_URL || "/"
        const s = String(p || "").replace(/^\//, "")
        const enc = s.split("/").map((seg) => encodeURIComponent(seg)).join("/")
        return `${base}${enc}`
    }
    const [value, setValue] = React.useState(() => {
        const lastRating = localStorage.getItem("lastRating")
        return lastRating ? parseFloat(lastRating) : 5.0
    })

    const [cooldown, setCooldown] = React.useState(false)

    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [videoVisible, setVideoVisible] = React.useState(true)
    const [count, setCount] = React.useState(() => {
        const c = localStorage.getItem("rating_count")
        return c ? parseInt(c, 10) : 0
    })
    const [avg, setAvg] = React.useState(() => {
        const sum = parseFloat(localStorage.getItem("rating_sum") || "0")
        const c = parseInt(localStorage.getItem("rating_count") || "0", 10)
        return c > 0 ? sum / c : 5.0
    })

    const handleChange = (event, newValue) => {
        if (typeof newValue === "number") {
            setValue(newValue)
        }
    }

    const handleSliderChange = async (event, newValue) => {
        if (typeof newValue === "number" && !isSubmitting && !cooldown) {
            setIsSubmitting(true)
            setValue(newValue)

            try {
                if (db) {
                    await addDoc(collection(db, "ratings"), {
                        value: newValue,
                        timestamp: new Date(),
                    })
                }

                localStorage.setItem("lastRating", newValue.toString())

                const prevSum = parseFloat(localStorage.getItem("rating_sum") || "0")
                const prevCount = parseInt(localStorage.getItem("rating_count") || "0", 10)
                const newSum = prevSum + newValue
                const newCount = prevCount + 1
                localStorage.setItem("rating_sum", newSum.toString())
                localStorage.setItem("rating_count", newCount.toString())
                setCount(newCount)
                setAvg(newSum / newCount)
            } catch (e) {
                console.warn("Rating gagal disimpan:", e)
            } finally {
                setIsSubmitting(false)
                setCooldown(true)
                setTimeout(() => setCooldown(false), 500)
            }
        }
    }

    const imgIndex = Math.min(Math.floor(value / 2), units.length - 1) // Mengambil indeks terakhir jika melebihi panjang array

    return (
        <Box sx={{ width: 307 }}>
            <Typography id="FixTextPoppins" component="div" gutterBottom>
                <div className="flex justify-between text-white relative top-3">
                    <div className="font-bold text-xs">RATE US</div>
                    <div className="font-bold text-xs">{avg.toFixed(1)}{count > 0 ? ` (${count})` : ""}</div>
                </div>
            </Typography>
            <div className="flex justify-center mb-3">
                <img
                    src={asset(units[imgIndex])}
                    alt={`Rating ${imgIndex + 1}`}
                    className="w-10 h-10"
                    id="ImgRating"
                />
            </div>
            <Slider
                value={value}
                min={0}
                step={0.1}
                max={10}
                color="secondary"
                valueLabelDisplay="off"
                onChange={handleChange}
                onChangeCommitted={handleSliderChange}
                disabled={isSubmitting || cooldown}
                sx={{
                    "& .MuiSlider-thumb": {
                        height: "1.5rem",
                        width: "1.5rem",
                        border: "none",
                        backgroundColor: "white",
                        boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
                        "&:hover, &.Mui-focusVisible": {
                            boxShadow: "0 0 15px rgba(255, 255, 255, 1)",
                        },
                    },
                    "& .MuiSlider-valueLabel": {
                        backgroundColor: "transparent",
                    },
                }}
            />
            {videoVisible && (
                <div style={{ marginTop: "12px" }}>
                    <div className="text-white text-xs font-medium mb-2">Video</div>
                    <video
                        src={asset("Rating/video.mp4")}
                        controls
                        playsInline
                        className="w-full rounded-lg"
                        style={{ maxHeight: "280px" }}
                        onError={() => setVideoVisible(false)}
                    />
                </div>
            )}
        </Box>
    )
}
