import { useState, useEffect, useRef } from "react";
import { addDoc, collection, query, orderBy, getDocs, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import axios from "axios";
const Swal = {
  fire: async ({ title = "", text = "", showCancelButton = false }) => {
    const message = [title, text].filter(Boolean).join("\n");
    if (showCancelButton) {
      const ok = window.confirm(message);
      return { isConfirmed: ok };
    }
    window.alert(message);
    return { isConfirmed: true };
  },
};

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [userIp, setUserIp] = useState("");
  const [messageCount, setMessageCount] = useState(0);

  const chatsCollectionRef = db ? collection(db, "chats") : null;
  const messagesEndRef = useRef(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fungsi untuk mengambil daftar alamat IP yang diblokir dari Firebase Firestore
  const fetchBlockedIPs = async () => {
    try {
      if (!db) return []
      const querySnapshot = await getDocs(collection(db, "blacklist_ips"));
      const blockedIPs = querySnapshot.docs.map((doc) => doc.data().ipAddress);
      return blockedIPs;
    } catch (error) {
      console.error("Gagal mengambil daftar IP yang diblokir:", error);
      return [];
    }
  }

  useEffect(() => {
    const loadOnce = async () => {
      try {
    if (!chatsCollectionRef) return
    const q = query(chatsCollectionRef, orderBy("timestamp"))
        const snapshot = await getDocs(q)
        const newMessages = snapshot.docs.map((doc) => ({ ...doc.data(), userIp: doc.data().userIp }))
        setMessages(newMessages)
        if (shouldScrollToBottom) scrollToBottom()
      } catch (e) {
        console.warn("Gagal memuat pesan:", e)
      }
    }
    loadOnce()
  }, [shouldScrollToBottom, chatsCollectionRef])

  useEffect(() => {
    getUserIp();
    const userIpAddress = userIp;
    const currentDate = new Date();
    const currentDateString = currentDate.toDateString();
    const storedDateString = localStorage.getItem("messageCountDate");
    if (currentDateString === storedDateString) {
      const userSentMessageCount = parseInt(localStorage.getItem(userIpAddress)) || 0;
      if (userSentMessageCount >= 20) {
        Swal.fire({
          icon: "error",
          title: "Message limit exceeded",
          text: "You have reached your daily message limit.",
          customClass: { container: "sweet-alert-container" },
        });
      } else {
        setMessageCount(userSentMessageCount);
      }
    } else {
      localStorage.removeItem(userIpAddress);
      localStorage.setItem("messageCountDate", currentDateString);
    }
    scrollToBottom();
    checkAdmin();
  }, [userIp]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, 100);
  }

  const getUserIp = async () => {
    try {
      if (!navigator.onLine) {
        setUserIp("offline")
        return
      }
      const cachedIp = localStorage.getItem("userIp");
      if (cachedIp) {
        setUserIp(cachedIp);
        return;
      }
      const response = await axios.get("https://api.ipify.org?format=json");
      const newUserIp = response.data.ip || "unknown";
      setUserIp(newUserIp);
      const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 jam
      localStorage.setItem("userIp", newUserIp);
      localStorage.setItem("ipExpiration", expirationTime.toString());
    } catch (error) {
      console.warn("Gagal mendapatkan alamat IP:", error);
      setUserIp("unknown")
    }
  };

  // Fungsi untuk memeriksa apakah alamat IP pengguna ada dalam daftar hitam
  const isIpBlocked = async () => {
    const blockedIPs = await fetchBlockedIPs();
    return blockedIPs.includes(userIp);
  };

  const checkAdmin = async () => {
    try {
      if (!db) {
        setIsAdmin(false);
        return;
      }
      const user = auth.currentUser;
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const adminsSnap = await getDocs(collection(db, "admins"));
      const adminUids = adminsSnap.docs.map((d) => d.data().uid);
      setIsAdmin(adminUids.includes(user.uid));
    } catch (e) {
      setIsAdmin(false);
    }
  };

  const sendMessage = async () => {
    if (message.trim() !== "") {
      if (!db) {
        Swal.fire({
          icon: "info",
          title: "Offline mode",
          text: "Chat tidak aktif di mode pengembangan.",
          customClass: { container: "sweet-alert-container" },
        });
        return;
      }
      // Memanggil isIpBlocked untuk memeriksa apakah pengguna diblokir
      const isBlocked = await isIpBlocked();

      if (isBlocked) {
        Swal.fire({
          icon: "error",
          title: "Blocked",
          text: "You are blocked from sending messages.",
          customClass: {
            container: "sweet-alert-container",
          },
        });
        return;
      }

      const senderImageURL = auth.currentUser?.photoURL || "/AnonimUser.png";
      const trimmedMessage = message.trim().substring(0, 60);
      const userIpAddress = userIp;

      if (messageCount >= 20) { // Batasan pesan per hari (20 pesan)
        Swal.fire({
          icon: "error",
          title: "Message limit exceeded",
          text: "You have reached your daily message limit.",
          customClass: {
            container: "sweet-alert-container",
          },
        });
        return;
      }

      const updatedSentMessageCount = messageCount + 1;
      localStorage.setItem(userIpAddress, updatedSentMessageCount.toString());
      setMessageCount(updatedSentMessageCount);

      // Menambahkan pesan ke Firestore
      await addDoc(chatsCollectionRef, {
        message: trimmedMessage,
        sender: {
          image: senderImageURL,
        },
        timestamp: new Date(),
        userIp: userIp,
      });

      setMessage(""); // Menghapus pesan setelah mengirim
      setTimeout(() => {
        setShouldScrollToBottom(true);
      }, 100);
    }
  };

  const resetChat = async () => {
    if (!isAdmin) {
      await Swal.fire({
        icon: "error",
        title: "Akses ditolak",
        text: "Fitur hapus hanya untuk admin.",
        customClass: { container: "sweet-alert-container" },
      });
      return;
    }
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Hapus semua pesan?",
      text: "Tindakan ini akan menghapus seluruh pesan anonim.",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      customClass: {
        container: "sweet-alert-container",
      },
    });
    if (!confirm.isConfirmed) return;

    try {
      const snapshot = await getDocs(chatsCollectionRef);
      const deletions = snapshot.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(deletions);
      setMessages([]);
      setMessage("");
      localStorage.removeItem("messageCountDate");
      if (userIp) {
        localStorage.removeItem(userIp);
      }
      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Semua pesan telah dihapus.",
        customClass: {
          container: "sweet-alert-container",
        },
      });
      scrollToBottom();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal menghapus",
        text: "Terjadi kesalahan saat menghapus pesan.",
        customClass: {
          container: "sweet-alert-container",
        },
      });
      console.error("Gagal menghapus pesan:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="" id="ChatAnonim">
      <div className="flex justify-between items-center mb-3">
        <div className="text-3xl font-extrabold text-center w-full tracking-wide" id="Glow">
          Text Anonim
        </div>
        {isAdmin && (
          <button
            onClick={resetChat}
            className="ml-4 text-xs px-3 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.09)",
              color: "white",
              opacity: 0.85,
            }}
            aria-label="Hapus semua pesan"
          >
            Hapus Semua
          </button>
        )}
      </div>
      <div className="text-white opacity-70 text-xs text-center mb-2">
        Kirim pesan singkat maksimal 60 karakter
      </div>

      <div className="mt-3" id="KotakPesan" style={{ overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div key={index} className="flex items-start text-sm py-2">
            <img src={msg.sender.image} alt="User Profile" className="h-7 w-7 mr-2" />
            <div className="relative top-[0.10rem]">{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div id="InputChat" className="flex items-center mt-3">
        <input
          className="bg-transparent flex-grow px-3 pr-4 w-4 placeholder:text-white placeholder:opacity-60"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ketik pesan Anda..."
          maxLength={60}
        />
        <button onClick={sendMessage} className="ml-2">
          <img src="/paper-plane.png" alt="" className="h-4 w-4 lg:h-6 lg:w-6" />
        </button>
      </div>
    </div>
  );
}

export default Chat;
