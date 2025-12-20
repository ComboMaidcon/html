

// ===== NAVBAR TOGGLE =====

const navOpenBtn = document.querySelector("[data-menu-open-btn]");
const navCloseBtn = document.querySelector("[data-menu-close-btn]");
const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");

const navElemArr = [navOpenBtn, navCloseBtn, overlay];

for (let i = 0; i < navElemArr.length; i++) {

  navElemArr[i].addEventListener("click", function () {

    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
    document.body.classList.toggle("active");

  });

}

// ===== HEADER ACTIVE =====

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {

  window.scrollY >= 10 ? header.classList.add("active") : header.classList.remove("active");

});


// ===== GO TO TOP BUTTON =====

const goTopBtn = document.querySelector("[data-go-top]");
if (goTopBtn) {
    window.addEventListener("scroll", function () {
        window.scrollY >= 500 ? goTopBtn.classList.add("active") : goTopBtn.classList.remove("active");
    });
}


// ===== REDIRECT TO LOGIN PAGE =====
const btnLogin = document.getElementById("btnLogin");
if (btnLogin) {
    document.getElementById("btnLogin").addEventListener("click", () => {
        window.location.href = "./login.html";
    });
}

const userBox = document.getElementById("userBox");
const userDropdown = document.getElementById("userDropdown");

if (userBox && userDropdown) {
    userBox.addEventListener("click", (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle("show");
    });
}

const movieLink = document.querySelector('a[href="#upcoming"]');

if (movieLink) {
    movieLink.addEventListener("click", function (e) {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ a
        
        const targetSection = document.getElementById("upcoming");
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: "smooth", // Hiệu ứng cuộn mượt
                block: "start"      // Dừng ở đầu section
            });
        }
    });
}

const movieLink2 = document.querySelector('a[href="#movie"]');

if (movieLink2) {
    movieLink2.addEventListener("click", function (e) {
        e.preventDefault();
        const targetSection = document.getElementById("movie");
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
}

const movieLink3 = document.querySelector('a[href="#service"]');
if (movieLink3) {
    movieLink3.addEventListener("click", function (e) {
        e.preventDefault();
        const targetSection = document.getElementById("service");
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
}


// Tìm các phần tử
const premiumModal = document.getElementById("premiumModal");

// 1. Mở Modal
const pricingLink = document.getElementById("pricingLink");
if (pricingLink) {
    pricingLink.onclick = (e) => {
    e.preventDefault();
    premiumModal.classList.add("show");
    document.body.style.overflow = "hidden"; // Ngăn cuộn trang phía sau
    };
}


// 2. Đóng khi nhấn dấu X
const closeModal = document.getElementById("closeModal");
if (closeModal) { // Thêm dòng này để kiểm tra
    closeModal.onclick = () => {
  premiumModal.classList.remove("show");
  document.body.style.overflow = "auto";
};

// 3. Đóng khi nhấn ra ngoài khung Modal (vùng mờ)
premiumModal.addEventListener("click", (e) => {
  if (e.target === premiumModal) {
    premiumModal.classList.remove("show");
    document.body.style.overflow = "auto";
  }
})
};