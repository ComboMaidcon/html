// IMPORTS 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile, 
    signOut, 
    sendPasswordResetEmail } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, 
    doc,
    setDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { showToast } from './toast.js';


//  FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyB9EPdiS8l9pufvZYrW1L-EXE3xCygPUO0",
  authDomain: "bao-film.firebaseapp.com",
  projectId: "bao-film",
  storageBucket: "bao-film.firebasestorage.app",
  messagingSenderId: "62494525428",
  appId: "1:62494525428:web:73407ff99f7b52634a9ba1",
  measurementId: "G-BQP74Z3223"
};


// INIT 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


// PASSWORD CHECK 
function isStrongPassword(password) {
    return typeof password === "string" && password.length >= 6;
}

// SIGN UP 
const signupForm = document.getElementById("signupForm");
if (signupForm) {
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", async e => {
        e.preventDefault();

        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("signupConfirmPassword").value;
        const username = document.getElementById("signupUsername").value.trim();
        const phone = document.getElementById("signupPhone").value.trim(); // Lấy SĐT

        if (password !== confirmPassword) {
            showToast("Mật khẩu không khớp ❌");
            return;
        }
        if (phone.length < 10) {
            showToast("Số điện thoại không hợp lệ ❌");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: username });

            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                phoneNumber: phone,
                createdAt: new Date()
            });

            showToast("Đăng ký thành công 🎉");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);

        } catch (err) {
            console.error(err);
            if (err.code === "auth/email-already-in-use")
                showToast("Email đã tồn tại ❌");
            else
                showToast("Đăng ký thất bại ❌");
        }
    });
}
}

// LOGIN
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

export { auth, db, storage, showToast };

//FORGOT PASSWORD 
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

// LOGOUT
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
    btnLogout.addEventListener("click", async (e) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        try {
            await signOut(auth);
            console.log("Đăng xuất thành công");
            window.location.href = "index.html"; 
        } catch (err) {
            console.error("Lỗi đăng xuất:", err);
            alert("Không thể đăng xuất, vui lòng thử lại!");
        }
    });
}




