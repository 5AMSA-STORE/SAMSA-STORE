import { db } from "./js/firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const pageName = window.location.pathname.split("/").pop() || "index.html";


// =========================
// Slider
// =========================

const slides = document.querySelectorAll(".slide");

if (slides.length > 0) {

    let current = 0;

    setInterval(() => {

        slides[current].classList.remove("active");

        current++;

        if (current >= slides.length) {
            current = 0;
        }

        slides[current].classList.add("active");

    }, 3000);

}


// =========================
// Product Images Slider
// =========================

window.moveSlide = function(button, direction) {

    const container = button.parentElement;
    const images = container.querySelectorAll(".slides img");

    let activeIndex = 0;

    images.forEach((img, index) => {

        if (img.classList.contains("active")) {
            activeIndex = index;
        }

    });

    images[activeIndex].classList.remove("active");

    let newIndex = activeIndex + direction;

    if (newIndex >= images.length) newIndex = 0;
    if (newIndex < 0) newIndex = images.length - 1;

    images[newIndex].classList.add("active");

};


// =========================
// Search
// =========================

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("keyup", () => {

        const searchValue = searchInput.value.toLowerCase();

        const products = document.querySelectorAll(".card");

        products.forEach(product => {

            const productName = product.querySelector("h3").innerText.toLowerCase();

            product.style.display =
                productName.includes(searchValue) ? "block" : "none";

        });

    });

}


// =========================
// Load Products
// =========================

const productsContainer = document.getElementById("productsContainer");

async function loadProducts() {

    if (!productsContainer) return;

    productsContainer.innerHTML = "";

    try {

        const snapshot = await getDocs(collection(db, "products"));

        console.log("عدد المنتجات:", snapshot.size);

        snapshot.forEach(doc => {

            const product = doc.data();

            // فلترة حسب الصفحة

            if (pageName === "accessories.html" && product.category !== "accessories") return;

            if (pageName === "cases.html" && product.category !== "cases") return;

            if (pageName === "decor.html" && product.category !== "decor") return;

            if (pageName === "offers.html" && !product.bestSeller) return;

            productsContainer.innerHTML += `

            <div class="card">

                <a href="${product.page || "#"}">

                    <img src="images/${product.image}" alt="${product.name}">

                </a>

                <a href="${product.page || "#"}" class="product-link">

                    <h3>${product.name}</h3>

                </a>

                <p>${product.price} جنيه</p>

                <button onclick="addToCart('${product.name}', ${product.price})">

                    أضف للسلة

                </button>

            </div>

            `;

        });

    }

    catch (error) {

        console.error("Firebase Error:", error);

    }

}

loadProducts();