import { useEffect, useState } from "react"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import Typography from "@mui/material/Typography"
import { useSpring, animated } from "@react-spring/web"
import CloseIcon from "@mui/icons-material/Close"
import { getStorage, ref, listAll, getDownloadURL, getMetadata, uploadBytes, deleteObject } from "firebase/storage"
import { db, auth, provider } from "../firebase"
import { signInWithPopup, signOut, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth"
import { addDoc } from "firebase/firestore"
import { getDocs, collection } from "firebase/firestore"

export default function ButtonRequest() {
	const [open, setOpen] = useState(false)
	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)

	const fade = useSpring({
		opacity: open ? 1 : 0,
		config: {
			duration: 200,
		},
	})

	const [images, setImages] = useState([])
	const [isAdmin, setIsAdmin] = useState(false)
	const [logged, setLogged] = useState(!!auth.currentUser)
	const [emailOrUser, setEmailOrUser] = useState("")
	const [password, setPassword] = useState("")
	const [videos, setVideos] = useState([])
	const [loginError, setLoginError] = useState("")
	const [loadingLogin, setLoadingLogin] = useState(false)

	// Fungsi untuk mengambil daftar gambar dari Firebase Storage
	const fetchImagesFromFirebase = async () => {
		try {
			const storage = getStorage()
			const storageRef = ref(storage, "images/")

			const imagesList = await listAll(storageRef)

			const imagePromises = imagesList.items.map(async (item) => {
				const url = await getDownloadURL(item)
				const metadata = await getMetadata(item)

				return {
					url,
					timestamp: metadata.timeCreated,
					name: metadata.name,
					fullPath: metadata.fullPath,
				}
			})

			const imageURLs = await Promise.all(imagePromises)

			// Urutkan array berdasarkan timestamp (dari yang terlama)
			imageURLs.sort((a, b) => a.timestamp - b.timestamp)

			setImages(imageURLs)
						} catch (error) {
			console.warn("Gagal memuat gambar dari Storage:", error)
		}
	}

	const fetchVideosFromFirebase = async () => {
		try {
			const storage = getStorage()
			let storageRef = ref(storage, "VideoRequest/")
			let listResp
			try {
				listResp = await listAll(storageRef)
			} catch {
				storageRef = ref(storage, "videos/")
				listResp = await listAll(storageRef)
			}
			const videoPromises = listResp.items.map(async (item) => {
				const url = await getDownloadURL(item)
				const metadata = await getMetadata(item)
				return {
					url,
					timestamp: metadata.timeCreated,
					name: metadata.name,
					fullPath: metadata.fullPath,
				}
			})
			const videoURLs = await Promise.all(videoPromises)
			videoURLs.sort((a, b) => a.timestamp - b.timestamp)
			setVideos(videoURLs)
		} catch (error) {
			console.warn("Gagal memuat video dari Storage:", error)
		}
	}

	const checkAdmin = async () => {
		try {
			if (!db) {
				setIsAdmin(false)
				return
			}
			const user = auth.currentUser
			if (!user) {
				setIsAdmin(false)
				return
			}
			const adminsSnap = await getDocs(collection(db, "admins"))
			const adminUids = adminsSnap.docs.map((d) => d.data().uid)
			const email = user.email || ""
			const byDomain = email.endsWith("@admin.local")
			setIsAdmin(byDomain || adminUids.includes(user.uid))
		} catch {
			setIsAdmin(false)
		}
	}

	const approveImage = async (imageData) => {
		try {
			const storage = getStorage()
			const sourceRef = ref(storage, imageData.fullPath)
			const targetRef = ref(storage, `GambarAman/${imageData.name}`)
			const res = await fetch(imageData.url)
			const blob = await res.blob()
			await uploadBytes(targetRef, blob)
			await deleteObject(sourceRef)
			setImages((prev) => prev.filter((i) => i.fullPath !== imageData.fullPath))
			window.dispatchEvent(new CustomEvent("gallery:refresh"))
		} catch (e) {
			console.warn("Approve gagal:", e)
		}
	}

	const approveVideo = async (videoData) => {
		try {
			const storage = getStorage()
			const sourceRef = ref(storage, videoData.fullPath)
			const targetRef = ref(storage, `VideoAman/${videoData.name}`)
			const res = await fetch(videoData.url)
			const blob = await res.blob()
			await uploadBytes(targetRef, blob)
			await deleteObject(sourceRef)
			setVideos((prev) => prev.filter((i) => i.fullPath !== videoData.fullPath))
			window.dispatchEvent(new CustomEvent("videoGallery:refresh"))
		} catch (e) {
			console.warn("Approve video gagal:", e)
		}
	}

	const rejectImage = async (imageData) => {
		try {
			const storage = getStorage()
			const sourceRef = ref(storage, imageData.fullPath)
			await deleteObject(sourceRef)
			setImages((prev) => prev.filter((i) => i.fullPath !== imageData.fullPath))
			window.dispatchEvent(new CustomEvent("gallery:refresh"))
		} catch (e) {
			console.warn("Hapus gagal:", e)
		}
	}

	const rejectVideo = async (videoData) => {
		try {
			const storage = getStorage()
			const sourceRef = ref(storage, videoData.fullPath)
			await deleteObject(sourceRef)
			setVideos((prev) => prev.filter((i) => i.fullPath !== videoData.fullPath))
			window.dispatchEvent(new CustomEvent("videoGallery:refresh"))
		} catch (e) {
			console.warn("Hapus video gagal:", e)
		}
	}

	const clearAllRequests = async () => {
		if (!isAdmin) return
		try {
			const storage = getStorage()
			// Hapus semua gambar pending
			for (const img of images) {
				if (!img.fullPath) continue
				try {
					const src = ref(storage, img.fullPath)
					await deleteObject(src)
				} catch (e) {
					console.warn("Gagal hapus gambar:", img.fullPath, e)
				}
			}
			// Hapus semua video pending
			for (const vid of videos) {
				if (!vid.fullPath) continue
				try {
					const src = ref(storage, vid.fullPath)
					await deleteObject(src)
				} catch (e) {
					console.warn("Gagal hapus video:", vid.fullPath, e)
				}
			}
			setImages([])
			setVideos([])
			window.dispatchEvent(new CustomEvent("gallery:refresh"))
			window.dispatchEvent(new CustomEvent("videoGallery:refresh"))
		} catch (e) {
			console.warn("Bersihkan semua request gagal:", e)
		}
	}

	const loginAdmin = async () => {
		try {
			setLoadingLogin(true)
			setLoginError("")
			await signInWithPopup(auth, provider)
			setLogged(true)
			await checkAdmin()
		} catch (e) {
			setLoginError("Login Google gagal. Coba lagi atau gunakan Password.")
			console.warn("Login gagal:", e)
		} finally {
			setLoadingLogin(false)
		}
	}

	const loginAdminWithPassword = async () => {
		try {
			setLoadingLogin(true)
			setLoginError("")
			const value = emailOrUser.trim()
			const email = value.includes("@") ? value : `${value}@admin.local`
			await signInWithEmailAndPassword(auth, email, password)
			setLogged(true)
			setPassword("")
			await checkAdmin()
		} catch (e) {
			setLoginError("Email/Password salah atau belum terdaftar di Firebase Auth.")
			console.warn("Login email/password gagal:", e)
		} finally {
			setLoadingLogin(false)
		}
	}

	const registerAdminWithPassword = async () => {
		try {
			setLoadingLogin(true)
			setLoginError("")
			const value = emailOrUser.trim()
			const email = value.includes("@") ? value : `${value}@admin.local`
			const cred = await createUserWithEmailAndPassword(auth, email, password)
			setLogged(true)
			setPassword("")
			if (db) {
				await addDoc(collection(db, "admins"), { uid: cred.user.uid, email })
				await checkAdmin()
			}
		} catch (e) {
			setLoginError("Gagal mendaftar. Pastikan Email/Password valid dan provider aktif.")
			console.warn("Register email/password gagal:", e)
		} finally {
			setLoadingLogin(false)
		}
	}

	const logoutAdmin = async () => {
		try {
			await signOut(auth)
			setLogged(false)
			setIsAdmin(false)
		} catch (e) {
			console.warn("Logout gagal:", e)
		}
	}

	useEffect(() => {
		fetchImagesFromFirebase()
		fetchVideosFromFirebase()
		checkAdmin()
	}, [])
	useEffect(() => {
		const unsub = onAuthStateChanged(auth, async () => {
			setLogged(!!auth.currentUser)
			await checkAdmin()
		})
		return () => unsub()
	}, [])

	return (
		<div>
			<button
				onClick={handleOpen}
				className="flex items-center space-x-2 text-white px-4 py-2 md:px-6 md:py-4 text-sm md:text-base"
				id="SendRequest">
				<img src="/Request.png" alt="Icon" className="w-5 h-5 md:w-6 md:h-6 relative bottom-0.5" />
				<span className="text-sm md:text-base lg:text-1xl">Request</span>
			</button>

			<Modal
				aria-labelledby="spring-modal-title"
				aria-describedby="spring-modal-description"
				open={open}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}>
				<animated.div style={fade}>
					<Box className="modal-container">
						<CloseIcon
							style={{ position: "absolute", top: "10px", right: "10px", cursor: "pointer",color: "grey", }}
							onClick={handleClose}
						/>
						<Typography id="spring-modal-description" component="div" sx={{ mt: 2 }}>
							<h6 className="text-center text-white text-2xl mb-5">Request</h6>
							<div className="flex justify-center gap-3 mb-4">
								{logged ? (
									<button onClick={logoutAdmin} className="px-3 py-1 rounded-2xl bg-white/15 text-white text-xs hover:bg-white/25">
										Logout Admin
									</button>
								) : (
									<button onClick={loginAdmin} className="px-3 py-1 rounded-2xl bg-white/20 text-white text-xs hover:bg-white/30 disabled:opacity-60" disabled={loadingLogin}>
										{loadingLogin ? "Memproses..." : "Login Admin"}
									</button>
								)}
								{isAdmin && <span className="px-2 py-1 rounded-2xl bg-green-600/70 text-white text-xs">Admin aktif</span>}
							</div>
							{isAdmin && (
								<div className="flex justify-center">
									<button
										onClick={clearAllRequests}
										className="px-3 py-1 rounded-2xl bg-white/20 text-white text-xs hover:bg-white/30">
										Bersihkan Semua Request
									</button>
								</div>
							)}
							{!logged && (
								<div className="flex flex-col items-center gap-2 mb-4">
									<input
										type="text"
										value={emailOrUser}
										onChange={(e) => setEmailOrUser(e.target.value)}
										placeholder="Email atau Username"
										className="px-3 py-2 rounded-2xl bg-white/10 text-white text-xs w-[80vw] max-w-[320px]"
									/>
									<input
										type="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Password"
										className="px-3 py-2 rounded-2xl bg-white/10 text-white text-xs w-[80vw] max-w-[320px]"
										onKeyDown={(e) => {
											if (e.key === "Enter") loginAdminWithPassword()
										}}
									/>
									<button
										onClick={loginAdminWithPassword}
										className="px-3 py-1 rounded-2xl bg-white/20 text-white text-xs hover:bg-white/30 disabled:opacity-60"
										disabled={loadingLogin}>
										{loadingLogin ? "Memproses..." : "Login dengan Password"}
									</button>
									<button
										onClick={registerAdminWithPassword}
										className="px-3 py-1 rounded-2xl bg-white/15 text-white text-xs hover:bg-white/25 disabled:opacity-60"
										disabled={loadingLogin}>
										{loadingLogin ? "Memproses..." : "Daftarkan Admin"}
									</button>
									{loginError && <div className="text-red-300 text-xs mt-1">{loginError}</div>}
								</div>
							)}
							<div className="text-white text-sm font-semibold opacity-90 mt-2 mb-2 px-2">Gambar Request</div>
							<div className="request-list h-[22rem] overflow-y-scroll overflow-y-scroll-no-thumb">
								{images
									.map((imageData, index) => (
										<div
											key={index}
											id="LayoutIsiButtonRequest"
											className="request-item">
											<div className="flex items-center gap-3">
												<img
													src={imageData.url}
													alt={`Image ${index}`}
													className="request-thumb"
												/>
												<div className="request-meta">
													<div className="request-name">{imageData.name || "Gambar"}</div>
													<div className="request-time">
														{new Date(imageData.timestamp).toLocaleString()}
													</div>
												</div>
											</div>
											{isAdmin && (
												<div className="request-actions">
													<button
														onClick={() => approveImage(imageData)}
														className="px-3 py-1 rounded-2xl bg-white/20 text-white text-xs hover:bg-white/30">
														Approve
													</button>
													<button
														onClick={() => rejectImage(imageData)}
														className="px-3 py-1 rounded-2xl bg-white/10 text-white text-xs hover:bg-white/20">
														Delete
													</button>
												</div>
											)}
										</div>
									))
									.reverse()}
							</div>
							<div className="text-white text-sm font-semibold opacity-90 mt-6 mb-2 px-2">Video Request</div>
							<div className="request-list h-[22rem] overflow-y-scroll overflow-y-scroll-no-thumb">
								{videos
									.map((videoData, index) => (
										<div
											key={index}
											id="LayoutIsiButtonRequest"
											className="request-item">
											<div className="flex items-center gap-3">
												<video
													src={videoData.url}
													className="request-video-thumb"
													controls
													controlsList="nodownload noplaybackrate noremoteplayback"
													disablePictureInPicture
												/>
												<div className="request-meta">
													<div className="request-name">{videoData.name || "Video"}</div>
													<div className="request-time">
														{new Date(videoData.timestamp).toLocaleString()}
													</div>
												</div>
											</div>
											{isAdmin && (
												<div className="request-actions">
													<button
														onClick={() => approveVideo(videoData)}
														className="px-3 py-1 rounded-2xl bg-white/20 text-white text-xs hover:bg-white/30">
														Approve
													</button>
													<button
														onClick={() => rejectVideo(videoData)}
														className="px-3 py-1 rounded-2xl bg-white/10 text-white text-xs hover:bg-white/20">
														Delete
													</button>
												</div>
											)}
										</div>
									))
									.reverse()}
							</div>
							<div className="text-white text-[0.7rem] mt-5">
								Note : Jika tidak ada gambar yang sudah anda upload silahkan reload
							</div>
						</Typography>
					</Box>
				</animated.div>
			</Modal>
		</div>
	)
}
