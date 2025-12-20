
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { showToast } from './toast.js';

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

/* ELEMENT*/
const userName = document.getElementById("userName");
const userAvatar = document.getElementById("userAvatar");
const profilePhoneNumber = document.getElementById('profilePhoneNumber');
const userJoinedDate = document.getElementById('userJoinedDate');

/*AUTH STATE*/
onAuthStateChanged(auth, async (user) => {
    if (user) {
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

        try {
            const ref = doc(db, "users", user.uid);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                const phoneNumber = snap.data().phoneNumber;
                profilePhoneNumber.innerText = phoneNumber;
            }
        } catch (e) {
            console.warn("Không lấy được phone number:", e);
        }

        userName.innerText = name;
        userAvatar.src = '' + (user.photoURL || './image/bguser.jfif');
        profileUserName.innerText = name;
        profileEmail.innerText = user.email;
        profileDisplayName.innerText = name;
        
        const tokenResult = await user.getIdTokenResult();
        
        //thời điểm người dùng xác thực (đăng nhập)
        const authTime = tokenResult.authTime; 
        
        const date = new Date(authTime);
        const formattedSignIn = date.toLocaleString('vi-VN');
        if (userJoinedDate) {
            userJoinedDate.innerText = formattedSignIn;
        };

}
    else {
        userAvatar.src = './image/bguser.jfif';
    }
  });

const btnEdit = document.getElementById("btnEditProfile");
const profileActions = document.getElementById("profileActions");

if (btnEdit) {
    btnEdit.addEventListener("click", (e) => {
        e.preventDefault();
        const spanName = document.getElementById("profileUserName");
        const spanPhone = document.getElementById("profilePhoneNumber");

        const oldName = spanName.innerText;
        const oldPhone = spanPhone.innerText;

        // Chuyển thành ô Input
        spanName.innerHTML = `<input type="text" id="inputName" class="edit-input" value="${oldName}">`;
        spanPhone.innerHTML = `<input type="text" id="inputPhone" class="edit-input" value="${oldPhone}">`;

        //Thay đổi nút Edit thành nhóm nút Save/Cancel trải ngang
        profileActions.innerHTML = `
            <div class="edit-btn-horizontal-group">
                <button class="btn btn-primary" id="btnSaveData">SAVE</button>
            </div>
        `;

    // Gán sự kiện trực tiếp để tránh lỗi "is not defined"

    document.getElementById("btnSaveData").onclick = async () => {
        const { auth, db } = await import('./firebase.js');
        const { updateProfile } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
        const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
        
        const user = auth.currentUser;
        const newName = document.getElementById("inputName").value.trim();
        const newPhone = document.getElementById("inputPhone").value.trim();

        if (!user) return;

        try {
            // Cập nhật Firebase Auth & Firestore
            await updateProfile(user, { displayName: newName });
            await setDoc(doc(db, "users", user.uid), {
                username: newName,
                phoneNumber: newPhone
            }, { merge: true });

            showToast("Cập nhật thành công 🎉", 3000);
            setTimeout(() => {
                location.reload();
            }   , 1000);
        } catch (error) {
            showToast("Lỗi: " + error.message);
        }
    };
  });
}

