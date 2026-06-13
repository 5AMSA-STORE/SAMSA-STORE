let cart = JSON.parse(localStorage.getItem("cart")) || [];

// تشغيل التحديث أول ما الصفحة تفتح
window.addEventListener("DOMContentLoaded", updateCart);

// إضافة منتج للسلة
function addToCart(name, price) {

    cart.push({
        name: name,
        price: price
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCart();

    alert("تمت إضافة المنتج للسلة");
}

// تحديث السلة والعدادات
function updateCart() {

    // عداد السلة اللي فوق
    let count = document.getElementById("cart-count");

    if (count) {
        count.innerText = cart.length;
    }

    // عداد السلة العائمة
    let floating = document.getElementById("cart-count-floating");

    if (floating) {
        floating.innerText = cart.length;
    }

    let cartList = document.getElementById("cart-list");
    let cartTotal = document.getElementById("cart-total");

    if (!cartList) return;

    if (cart.length === 0) {

        cartList.innerHTML =
        "<h3 style='text-align:center;padding:20px;color:#999;'>السلة فارغة حالياً 🛒</h3>";

        if (cartTotal) {
            cartTotal.innerText = "0";
        }

        return;
    }

    cartList.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += Number(item.price);

        cartList.innerHTML += `
        <div class="cart-item" style="display:flex;justify-content:space-between;align-items:center;padding:12px;border-bottom:1px solid #eee;">
            <span>${item.name} - ${item.price} جنيه</span>

            <button
            onclick="removeFromCart(${index})"
            style="
            background:red;
            color:white;
            border:none;
            padding:6px 12px;
            border-radius:6px;
            cursor:pointer;">
            حذف
            </button>
        </div>
        `;
    });

    if (cartTotal) {
        cartTotal.innerText = total;
    }
}

// حذف منتج من السلة
function removeFromCart(index) {

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCart();
}

// إرسال الطلب واتساب
function sendWhatsApp() {

    let name =
        document.getElementById("name")
        ? document.getElementById("name").value
        : "";

    let phone =
        document.getElementById("phone")
        ? document.getElementById("phone").value
        : "";

    let address =
        document.getElementById("address")
        ? document.getElementById("address").value
        : "";

    if (cart.length === 0) {
        alert("السلة فارغة");
        return;
    }

    if (!name || !phone || !address) {
        alert("من فضلك أكمل جميع البيانات");
        return;
    }

    let message = "طلب جديد من 5AMSA STORE:%0A%0A";

    cart.forEach(item => {
        message += `• ${item.name} - ${item.price} جنيه%0A`;
    });

    let total = cart.reduce((sum, item) => sum + Number(item.price), 0);

    message += `%0Aإجمالي الحساب: ${total} جنيه%0A%0A`;

    message += `الاسم: ${name}%0A`;
    message += `رقم الهاتف: ${phone}%0A`;
    message += `العنوان: ${address}`;

    window.open(
        `https://wa.me/201095354087?text=${message}`,
        "_blank"
    );
}