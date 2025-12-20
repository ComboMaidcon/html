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


// INIT 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const btnWatchNow = document.getElementById('btnWatchNow');
    const movieDetail = document.getElementById('movieDetail');
    const videoSection = document.getElementById('videoPlayerSection');
    const videoElement = document.getElementById('mainMovieVideo');
    const commentForm = document.getElementById('commentForm');
    const commentText = document.getElementById('commentText');
    const commentContainer = document.getElementById('commentContainer');
    const stars = document.querySelectorAll('#ratingStars ion-icon');
    
    let currentRating = 0;
    // Ảnh mặc định nếu đường dẫn lưu trữ bị sai hoặc file bị xóa
    const DEFAULT_AVATAR = "../image/bguser.jfif"; 
    let currentUserData = { name: "Khách", avatar: DEFAULT_AVATAR };
    const storageKey = "comments_free_guy";

    onAuthStateChanged(auth, async (user) => {
        const btnLogin = document.getElementById("btnLogin");
        const userBox = document.getElementById("userBox");
        const userNameDisp = document.getElementById("userName");
        const userAvatarDisp = document.getElementById("userAvatar");

        if (user) {
            let displayTitle = user.displayName || user.email.split('@')[0];
            let displayImg = user.photoURL || DEFAULT_AVATAR;

            try {
                const userSnap = await getDoc(doc(db, "users", user.uid));
                if (userSnap.exists()) displayTitle = userSnap.data().username || displayTitle;
            } catch (e) { console.warn("Lỗi Auth Profile", e); }

            currentUserData = { name: displayTitle, avatar: displayImg };

            if (userNameDisp) userNameDisp.innerText = displayTitle;
            if (userAvatarDisp) {
                userAvatarDisp.src = displayImg;
                // Xử lý nếu ảnh từ Auth bị lỗi 404
                userAvatarDisp.onerror = () => { userAvatarDisp.src = DEFAULT_AVATAR; };
            }
            if (btnLogin) btnLogin.style.display = 'none';
            if (userBox) userBox.classList.remove("auth-hidden");
        }
    });

    btnWatchNow?.addEventListener('click', () => {
        movieDetail.style.display = 'none';
        videoSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        videoElement.play();
    });

    stars.forEach(star => {
        star.addEventListener('click', () => {
            currentRating = parseInt(star.getAttribute('data-value'));
            stars.forEach(s => {
                const val = parseInt(s.getAttribute('data-value'));
                s.classList.toggle('active', val <= currentRating);
                s.setAttribute('name', val <= currentRating ? 'star' : 'star-outline');
            });
        });
    });

    function loadComments() {
        const saved = JSON.parse(localStorage.getItem(storageKey)) || [];
        commentContainer.innerHTML = "";
        saved.forEach(item => renderCommentUI(item));
    }

    function renderCommentUI(data) {
        const li = document.createElement('li');
        li.className = 'comment-item';
        // Sử dụng onerror để thay thế ảnh lỗi bằng ảnh mặc định ngay lập tức
        li.innerHTML = `
            <img src="${data.avatar}" 
                 onerror="this.src='${DEFAULT_AVATAR}'" 
                 class="comment-avatar" 
                 style="width:45px; height:45px; border-radius:50%; object-fit:cover; border:2px solid #ffb400;">
            <div class="comment-content">
                <strong>${data.name} - ${'⭐'.repeat(data.rating)}</strong>
                <p style="color:#ccc; margin-top:5px;">${data.text}</p>
            </div>
        `;
        commentContainer.prepend(li);
    }

    commentForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (currentRating === 0) return alert("Vui lòng chọn số sao!");

        const newComment = {
            name: currentUserData.name,
            avatar: currentUserData.avatar,
            rating: currentRating,
            text: commentText.value.trim(),
            date: new Date().toISOString()
        };

        const all = JSON.parse(localStorage.getItem(storageKey)) || [];
        all.push(newComment);
        localStorage.setItem(storageKey, JSON.stringify(all));

        renderCommentUI(newComment);
        commentForm.reset();
        currentRating = 0;
        stars.forEach(s => { s.classList.remove('active'); s.setAttribute('name', 'star-outline'); });
    });

    loadComments();
});