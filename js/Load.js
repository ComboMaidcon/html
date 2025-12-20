import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
    collection, addDoc, onSnapshot, query, where, orderBy, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

const btnLogin = document.getElementById("btnLogin");
const userBox = document.getElementById("userBox");
const userName = document.getElementById("userName");
const userAvatar = document.getElementById("userAvatar");


onAuthStateChanged(auth, async (user) => {
    if (user) {
        //Lấy thông tin cơ bản từ Auth (DisplayName và PhotoURL)
        let displayTitle = user.displayName || user.email.split('@')[0];
        let displayImg = user.photoURL || './image/bguser.jfif'|| '../image/bguser.jfif';

        //Lấy thêm thông tin từ Firestore
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

        //Cập nhật giao diện Header
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


const headerBtnLogin = document.getElementById('btnLogin');
const headerUserBox = document.getElementById('userBox');
const headerUserAvatar = document.getElementById('userAvatar');
const headerUserName = document.getElementById('userName');
const headerBtnLogout = document.getElementById('btnLogout');

// Các phần tử trong navbar mobile
const navbarSignIn = document.getElementById('navbarSignIn');
const navbarBtnLogin = document.getElementById('navbarBtnLogin');
const navbarUserBox = document.getElementById('navbarUserBox');
const navbarUserAvatar = document.getElementById('navbarUserAvatar');
const navbarUserName = document.getElementById('navbarUserName');
const navbarBtnLogout = document.getElementById('navbarBtnLogout');

// Hàm hiển thị UI khi chưa đăng nhập
function showLoggedOutUI() {
  // Header
  if (headerBtnLogin) {
    headerBtnLogin.classList.remove('auth-hidden');
  }
  if (headerUserBox) {
    headerUserBox.classList.add('auth-hidden');
  }

  // Navbar
  if (navbarSignIn) {
    navbarSignIn.classList.remove('auth-hidden');
  }
  if (navbarUserBox) {
    navbarUserBox.classList.add('auth-hidden');
  }
}

// Hàm hiển thị UI khi đã đăng nhập
function showLoggedInUI(user) {
  const displayName = user.displayName || user.email.split('@')[0];
  const photoURL = user.photoURL || './image/bguser.jfif';

  // Header
  if (headerBtnLogin) {
    headerBtnLogin.classList.add('auth-hidden');
  }
  if (headerUserBox) {
    headerUserBox.classList.remove('auth-hidden');
    if (headerUserAvatar) headerUserAvatar.src = photoURL;
    if (headerUserName) headerUserName.textContent = displayName;
  }

  // Navbar
  if (navbarSignIn) {
    navbarSignIn.classList.add('auth-hidden');
  }
  if (navbarUserBox) {
    navbarUserBox.classList.remove('auth-hidden');
    if (navbarUserAvatar) navbarUserAvatar.src = photoURL;
    if (navbarUserName) navbarUserName.textContent = displayName;
  }
}

// Lắng nghe trạng thái đăng nhập
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Đã đăng nhập
    showLoggedInUI(user);
  } else {
    // Chưa đăng nhập
    showLoggedOutUI();
  }
});

// Xử lý click nút Sign In ở header
if (headerBtnLogin) {
  headerBtnLogin.addEventListener('click', () => {
    window.location.href = 'login.html';
  });
}

// Xử lý click nút Sign In ở navbar
if (navbarBtnLogin) {
  navbarBtnLogin.addEventListener('click', () => {
    window.location.href = 'login.html';
  });
}

// Xử lý đăng xuất ở header
if (headerBtnLogout) {
  headerBtnLogout.addEventListener('click', async () => {
    try {
      await signOut(auth);
      
      // Hiển thị thông báo (nếu có toast)
      if (window.showToast) {
        window.showToast('Đăng xuất thành công!', 'success');
      }
      
      // Chuyển về trang chủ
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
      if (window.showToast) {
        window.showToast('Lỗi khi đăng xuất!', 'error');
      }
    }
  });
}

// Xử lý đăng xuất ở navbar
if (navbarBtnLogout) {
  navbarBtnLogout.addEventListener('click', async () => {
    try {
      await signOut(auth);
      
      // Đóng navbar mobile
      const navbar = document.querySelector('[data-navbar]');
      const overlay = document.querySelector('[data-overlay]');
      if (navbar) navbar.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      
      // Hiển thị thông báo
      if (window.showToast) {
        window.showToast('Đăng xuất thành công!', 'success');
      }
      
      // Chuyển về trang chủ
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
      if (window.showToast) {
        window.showToast('Lỗi khi đăng xuất!', 'error');
      }
    }
  });
}

// Xử lý click vào user dropdown ở header
if (headerUserBox) {
  headerUserBox.addEventListener('click', (e) => {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
      dropdown.classList.toggle('active');
    }
    e.stopPropagation();
  });
}

// Đóng dropdown khi click ra ngoài
document.addEventListener('click', () => {
  const dropdown = document.getElementById('userDropdown');
  if (dropdown && dropdown.classList.contains('active')) {
    dropdown.classList.remove('active');
  }
});