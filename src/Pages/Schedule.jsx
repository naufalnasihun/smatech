import React, { useEffect, useState } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

const Senin = React.lazy(() => import("../components/mapel/Senin"))
const Selasa = React.lazy(() => import("../components/mapel/Selasa"))
const Rabu = React.lazy(() => import("../components/mapel/Rabu"))
const Kamis = React.lazy(() => import("../components/mapel/Kamis"))
const Jumat = React.lazy(() => import("../components/mapel/Jumat"))
const Sabtu = React.lazy(() => import("../components/mapel/Sabtu"))
const Minggu = React.lazy(() => import("../components/mapel/Minggu"))

const Schedule = () => {
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
    const todayIndex = new Date().getDay()
    const [activeIndex, setActiveIndex] = useState(todayIndex)

    useEffect(() => {
        AOS.init()
        AOS.refresh()
    }, [])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const q = params.get("day")
        if (q) {
            const lower = q.toLowerCase()
            const map = {
                minggu: 0, sunday: 0, "0": 0,
                senin: 1, monday: 1, "1": 1,
                selasa: 2, tuesday: 2, "2": 2,
                rabu: 3, wednesday: 3, "3": 3,
                kamis: 4, thursday: 4, "4": 4,
                jumat: 5, friday: 5, "5": 5,
                sabtu: 6, saturday: 6, "6": 6,
            }
            if (lower in map) setActiveIndex(map[lower])
        }
        const handler = (e) => {
            const idx = typeof e.detail === "number" ? e.detail : todayIndex
            setActiveIndex(Math.max(0, Math.min(6, idx)))
        }
        window.addEventListener("schedule:setDay", handler)
        return () => window.removeEventListener("schedule:setDay", handler)
    }, [todayIndex])

    const dayComponents = [
        Minggu,
        Senin,
        Selasa,
        Rabu,
        Kamis,
        Jumat,
        Sabtu,
    ]

    const ActiveComponent = dayComponents[activeIndex]

    return (
        <>
            {/* Jadwal Mapel */}
            <div className="lg:flex lg:justify-center lg:gap-32 lg:mb-10 lg:mt-16 ">
                <div className="text-white flex flex-col justify-center items-center mt-8 md:mt-3 overflow-y-hidden">
                    <div className="text-2xl font-medium mb-3" data-aos="fade-up" data-aos-duration="500">
                        {dayNames[activeIndex]}
                    </div>
                    <div className="mb-2">
                        {activeIndex === todayIndex && (
                            <span className="inline-block px-2 py-1 text-[11px] rounded-full bg-white/10 border border-white/20">
                                Hari ini
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-4" data-aos="fade-up" data-aos-duration="500">
                        {dayNames.map((nm, i) => (
                            <button
                                key={nm}
                                type="button"
                                onClick={() => setActiveIndex(i)}
                                className={`px-3 py-1 rounded-full border ${i === activeIndex ? "bg-white/20 border-white/40" : "bg-white/10 border-white/20"} text-xs`}
                            >
                                {nm}
                            </button>
                        ))}
                    </div>
                    <div data-aos="fade-up" data-aos-duration="400">
                        {ActiveComponent ? (
                            <React.Suspense fallback={<p>Loading...</p>}>
                                <ActiveComponent />
                            </React.Suspense>
                        ) : (
                            <p className="opacity-50">Tidak Ada Jadwal Hari Ini</p>
                        )}
                    </div>
                </div>
            </div>

           
        </>
    )
}

export default Schedule
