const slides = document.querySelectorAll(".slide");

let current = 0;

setInterval(() => {

slides[current].classList.remove("active");

current++;

if(current >= slides.length){
current = 0;
}

slides[current].classList.add("active");

},3000);
function moveSlide(button, direction) {
    const container = button.parentElement;
    const images = container.querySelectorAll('.slides img');
    let activeIndex = 0;

    // معرفة الصورة الظاهرة حالياً
    images.forEach((img, index) => {
        if (img.classList.contains('active')) {
            activeIndex = index;
        }
    });

    // إخفاء الصورة الحالية
    images[activeIndex].classList.remove('active');

    // حساب مكان الصورة الجديدة
    let newIndex = activeIndex + direction;
    if (newIndex >= images.length) newIndex = 0;
    if (newIndex < 0) newIndex = images.length - 1;

    // إظهار الصورة الجديدة
    images[newIndex].classList.add('active');
}
const searchInput = document.getElementById("searchInput");

if(searchInput){

searchInput.addEventListener("keyup", function(){

let searchValue = searchInput.value.toLowerCase();

let products = document.querySelectorAll(".card");

products.forEach(product => {

let productName = product.querySelector("h3").innerText.toLowerCase();

if(productName.includes(searchValue)){
product.style.display = "block";
}
else{
product.style.display = "none";
}

});

});

}
console.log("SEARCH WORKING");