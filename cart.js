let cart = [];

function addToCart(name, price) {

cart.push({
name: name,
price: price
});

updateCart();

}

function updateCart() {

let count = document.getElementById("cart-count");

if(count){
count.innerText = cart.length;
}

}

function sendWhatsApp() {

if(cart.length === 0){
alert("السلة فارغة");
return;
}

let message = "طلب جديد:%0A%0A";

cart.forEach(item => {
message += `${item.name} - ${item.price} جنيه%0A`;
});

window.open(
`https://wa.me/201095354087?text=${message}`,
'_blank'
);

}