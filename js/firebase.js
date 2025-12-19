// ================= IMPORTS =================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { updateProfile } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "firebase/storage";

export const storage = getStorage(app);


// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyB9EPdiS8l9pufvZYrW1L-EXE3xCygPUO0",
  authDomain: "bao-film.firebaseapp.com",
  projectId: "bao-film",
  storageBucket: "bao-film.firebasestorage.app",
  messagingSenderId: "62494525428",
  appId: "1:62494525428:web:73407ff99f7b52634a9ba1",
  measurementId: "G-BQP74Z3223"
};


// ================= INIT =================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===== TOAST =====
function showToast(message, duration = 3000) {
    return new Promise((resolve) => {
        const container = document.getElementById("toast-container");

        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerText = message;

        container.appendChild(toast);

        // Sau duration → bắt đầu fade out
        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(40px)";

            // Sau animation xong → remove & resolve
            setTimeout(() => {
                toast.remove();
                resolve();
            }, 1500);

        }, duration);
    });
}



// ===== PASSWORD CHECK =====
function isStrongPassword(password) {
    return typeof password === "string" && password.length >= 6;
}

// ===== SIGN UP =====
const signupForm = document.getElementById("signupForm");
if (signupForm) {
signupForm.addEventListener("submit", async e => {
    e.preventDefault();

    const email = signupEmail.value.trim();
    const password = signupPassword.value;
    const username = signupUsername.value.trim();

    if (!username) {
        showToast("Vui lòng nhập tên người dùng ❌");
        return;
    }

    if (!isStrongPassword(password)) {
        showToast("Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số");
        return;
    }

    try {
        // 1️⃣ Tạo tài khoản
        const cred = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        // 2️⃣ Lưu displayName vào Firebase Auth
        await updateProfile(cred.user, {
            displayName: username
        });

        // 3️⃣ Lưu thông tin vào Firestore
        await setDoc(doc(db, "users", cred.user.uid), {
            username,
            email,
            createdAt: new Date()
        });

        await showToast("Đăng ký thành công 🎉", 2000);
        setTimeout(() => window.location.href = "index.html", 1500);

    } catch (err) {
        console.error(err.code, err.message);

        if (err.code === "auth/email-already-in-use")
            showToast("Email đã tồn tại ❌");
        else
            showToast("Đăng ký thất bại ❌");
    }
});
}

// ===== LOGIN =====
const loginForm = document.getElementById("loginForm");
if (loginForm) {
loginForm.addEventListener("submit", async e => {
    e.preventDefault();

    try {
        await signInWithEmailAndPassword(
            auth,
            loginEmail.value,
            loginPassword.value
        );
        showToast("Đăng nhập thành công 🎉");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    }
    catch (err) {
        showToast("Sai email hoặc mật khẩu ❌");
    }
});
}

// ===== FORGOT PASSWORD =====
const forgotPassword = document.getElementById("forgotPassword");
if (forgotPassword) {
forgotPassword.addEventListener("click", async e => {
    e.preventDefault();

    if (!loginEmail.value) {
        showToast("Nhập email trước ❌");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, loginEmail.value);
        showToast("Đã gửi email khôi phục 📧");
    } catch (err) {
        console.error(err);
        showToast("Không gửi được email ❌: " + err.message);
    }
});
}

// ===== LOGOUT =====
const btnLogout = document.getElementById("btnLogout");

if (btnLogout) {
    btnLogout.addEventListener("click", async (e) => {
    e.stopPropagation();

    await signOut(auth);
}
);
}



