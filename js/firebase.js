// ===== IMPORT FIREBASE CDN =====
import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { 
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===== FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDVsJVKOjxuU2hqJi70NsJc_EySqVi3_bE",
  authDomain: "html-dc27b.firebaseapp.com",
  projectId: "html-dc27b",
  storageBucket: "html-dc27b.firebasestorage.app",
  messagingSenderId: "1002318618534",
  appId: "1:1002318618534:web:337cdfd75144b61b02b967"
};

// ===== INIT =====
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===== TOAST =====
function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 3000);
}

// ===== PASSWORD CHECK =====
function isStrongPassword(p) {
    return p.length >= 6 &&
           /[A-Z]/.test(p) &&
           /[a-z]/.test(p) &&
           /[0-9]/.test(p);
}

// ===== SIGN UP =====
signupForm.addEventListener("submit", async e => {
    e.preventDefault();

    const email = signupEmail.value;
    const password = signupPassword.value;

    if (!isStrongPassword(password)) {
        showToast("Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số");
        return;
    }

    try {
        const cred =
          await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", cred.user.uid), {
            username: signupUsername.value,
            email: email,
            createdAt: new Date()
        });

        showToast("Đăng ký thành công 🎉");
        chk.checked = false;

    } catch (err) {
        console.error(err.code);
        if (err.code === "auth/email-already-in-use")
            showToast("Email đã tồn tại ❌");
        else
            showToast("Đăng ký thất bại ❌");
    }
});

// ===== LOGIN =====
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
        }, 1000);
    }
    catch (err) {
        showToast("Sai email hoặc mật khẩu ❌");
    }


});

// ===== FORGOT PASSWORD =====
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

