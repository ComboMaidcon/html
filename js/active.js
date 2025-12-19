'use strict';
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

window.addEventListener("scroll", function () {

  window.scrollY >= 500 ? goTopBtn.classList.add("active") : goTopBtn.classList.remove("active");

});


// ===== REDIRECT TO LOGIN PAGE =====
document.getElementById("btnLogin").addEventListener("click", () => {
    window.location.href = "login.html";
});

const userBox = document.getElementById("userBox");
const dropdown = document.getElementById("userDropdown");
const btnLogout = document.getElementById("btnLogout");

if (userBox && dropdown) {
    userBox.addEventListener("click", (e) => {
    e.stopPropagation(); // 🔥 chặn document click
    userDropdown.classList.toggle("show");
    });

    document.addEventListener("click", () => {
        userDropdown.classList.remove("show");
    });
}


// LOGOUT

