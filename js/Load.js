import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

const btnLogin = document.getElementById("btnLogin"); // Nút đăng nhập/đăng ký
const userBox = document.getElementById("userBox");
const userName = document.getElementById("userName");
const userAvatar = document.getElementById("userAvatar");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // 1. Lấy thông tin cơ bản từ Auth (DisplayName và PhotoURL)
        // PhotoURL lúc này đã là link từ Firebase Storage nếu bạn đã nhấn Save ở Profile
        let displayTitle = user.displayName || user.email.split('@')[0];
        let displayImg = user.photoURL || './image/bguser.jfif';

        // 2. Lấy thêm thông tin từ Firestore để đảm bảo đồng bộ (Tên/SĐT)
        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                displayTitle = data.username || displayTitle;
            }
        } catch (error) {
            console.warn("Load.js: Không lấy được data Firestore", error);
        }

        // 3. Cập nhật giao diện Header
        if (userName) userName.innerText = displayTitle;
        if (userAvatar) userAvatar.src = displayImg;

        // Hiện UserBox, ẩn nút Login
        if (btnLogin) btnLogin.classList.add("auth-hidden");
        if (userBox) userBox.classList.remove("auth-hidden");

    } else {
        // Nếu chưa đăng nhập
        if (btnLogin) btnLogin.classList.remove("auth-hidden");
        if (userBox) userBox.classList.add("auth-hidden");
    }
});