
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ===== Firebase config (GIỐNG firebase.js) ===== */
const firebaseConfig = {
  apiKey: "AIzaSyB9EPdiS8l9pufvZYrW1L-EXE3xCygPUO0",
  authDomain: "bao-film.firebaseapp.com",
  projectId: "bao-film",
  storageBucket: "bao-film.firebasestorage.app",
  messagingSenderId: "62494525428",
  appId: "1:62494525428:web:73407ff99f7b52634a9ba1",
  measurementId: "G-BQP74Z3223"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ===== ELEMENT ===== */
const btnSignIn = document.getElementById("btnSignIn");
const userBox = document.getElementById("userBox");
const userName = document.getElementById("userName");
const userAvatar = document.getElementById("userAvatar");

/* ===== AUTH STATE ===== */
onAuthStateChanged(auth, async (user) => {
    
    // Ẩn cả 2 ngay từ đầu (chống flicker)
    btnLogin.classList.add("auth-hidden");
    userBox.classList.add("auth-hidden");
    userDropdown.classList.remove("show");

    if (user) {
        /* ========= LẤY THÔNG TIN USER ========= */
        let name = user.email;

        try {
            const ref = doc(db, "users", user.uid);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                name = snap.data().username;
            }
        } catch (e) {
            console.warn("Không lấy được username:", e);
        }

        /* ========= UPDATE UI ========= */
        userName.innerText = name;
        userAvatar.src =
            "https://ui-avatars.com/api/?name=" + encodeURIComponent(name);

        btnLogin.classList.add("auth-hidden");
        userBox.classList.remove("auth-hidden");

    } else {
        /* ========= CHƯA ĐĂNG NHẬP ========= */
        btnLogin.classList.remove("auth-hidden");
        userBox.classList.add("auth-hidden");
    }
    header.classList.remove("auth-loading");
});



