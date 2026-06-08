let cart = JSON.parse(localStorage.getItem("cart")) || [];

// تشغيل التحديث أول ما الصفحة تفتح
window.addEventListener("DOMContentLoaded", updateCart);

// 1️⃣ دالة إضافة منتج للسلة
function addToCart(name, price) {
    cart.push({ name: name, price: price });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart();
    alert("تمت إضافة المنتج للسلة");
}

// 2️⃣ دالة تحديث وعرض السلة والعداد
function updateCart() {
    let cartList = document.getElementById("cart-list");
    let cartTotal = document.getElementById("cart-total");
    let cartCount = document.getElementById("cart-count");

    if (cartCount) cartCount.innerText = cart.length;
    if (!cartList) return; 

    // التعديل اللطيف هنا: لو السلة فضيت يكتب له السلة فارغة
    if (cart.length === 0) {
        cartList.innerHTML = "<h3 style='text-align:center; padding:20px; color:#999;'>السلة فارغة حالياً 🛒</h3>";
        if (cartTotal) cartTotal.innerText = "0";
        return;
    }

    cartList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        cartList.innerHTML += `
            <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 10px; border-bottom: 1px solid #eee;">
                <span>${item.name} - ${item.price} جنيه</span>
                <button onclick="removeFromCart(${index})" style="background: none; border: none; color: red; font-weight: bold; cursor: pointer; font-size: 16px;">❌</button>
            </div>
        `;
    });

    if (cartTotal) cartTotal.innerText = total;
}

// 3️⃣ دالة مسح منتج معين من السلة بـ الـ X
function removeFromCart(index) {
    cart.splice(index, 1); 
    localStorage.setItem("cart", JSON.stringify(cart)); 
    updateCart(); 
}

// 4️⃣ دالة إرسال الطلب للواتساب
function sendWhatsApp() {
    let name = document.getElementById("name") ? document.getElementById("name").value : "";
    let phone = document.getElementById("phone") ? document.getElementById("phone").value : "";
    let address = document.getElementById("address") ? document.getElementById("address").value : "";
    
    if (cart.length === 0) {
        alert("السلة فارغة المحتوى!");
        return;
    }

    if (!name || !phone || !address) {
        alert("من فضلك أكمل جميع بيانات الطلب أولاً");
        return;
    }
    
    let message = "طلب جديد من 5AMSA STORE:\n\n";
    cart.forEach((item) => {
        message += `- ${item.name} (${item.price} جنيه)\n`;
    });
    
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    message += `\nإجمالي الحساب: ${total} جنيه\n\n`;
    message += `الاسم: ${name}\nالرقم: ${phone}\nالعنوان: ${address}`;
    
    // تم الحفاظ على الرقم الجديد المكتوب في صفحتك 01095354087
    let url = "https://wa.me/201095354087?text=" + encodeURIComponent(message);
    window.open(url, "_blank");
}