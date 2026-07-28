import { db } from "./js/firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const CLOUD_NAME = "kpmisxyy";
const UPLOAD_PRESET = "5amsa-store";

const productsRef = collection(db, "products");

const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const oldPriceInput = document.getElementById("oldPrice");
const brandInput = document.getElementById("brand");
const pageInput = document.getElementById("page");
const categoryInput = document.getElementById("category");
const imageInput = document.getElementById("imageFile");
const newInput = document.getElementById("new");
const bestInput = document.getElementById("best");

const productsList = document.getElementById("productsList");

const productsCount = document.getElementById("productsCount");
const newCount = document.getElementById("newCount");
const bestCount = document.getElementById("bestCount");
const categoriesCount = document.getElementById("categoriesCount");

let editId = null;
let currentImage = "";

async function uploadImage(file){

    const formData = new FormData();

    formData.append("file",file);
    formData.append("upload_preset",UPLOAD_PRESET);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
            method:"POST",
            body:formData
        }
    );

    const data = await response.json();

if (data.error) {
    throw new Error(data.error.message);
}

return data.secure_url;

}

function clearForm(){

    nameInput.value="";
    priceInput.value="";
    oldPriceInput.value="";
    brandInput.value="";
    pageInput.value="";
    categoryInput.value="cases";
    imageInput.value="";
    newInput.checked = false;
    bestInput.checked = false;

    editId=null;
    currentImage="";

    document.getElementById("saveBtn").style.display="none";

}

window.addProduct = async function(){

    try{

        if(nameInput.value==""){
            alert("اكتب اسم المنتج");
            return;
        }

        if(priceInput.value==""){
            alert("اكتب السعر");
            return;
        }

        let image=currentImage;

        if(imageInput.files.length>0){

            image=await uploadImage(imageInput.files[0]);

        }

        const product = {
    name: nameInput.value,
    price: Number(priceInput.value),
    oldPrice: Number(oldPriceInput.value || 0),
    brand: brandInput.value,
    page: pageInput.value,
    category: categoryInput.value,
    image: image,
    new: newInput.checked,
    best: bestInput.checked,
    createdAt: Date.now()
};

        if(!image){
    alert("فشل رفع الصورة");
    return;
}

        await addDoc(productsRef,product);

        alert("تمت إضافة المنتج");

        clearForm();

        loadProducts();

    }

    catch(e){

        console.log(e);

        alert("حدث خطأ");

    }

}
async function loadProducts() {

    productsList.innerHTML = "جارى تحميل المنتجات...";

    const snapshot = await getDocs(productsRef);

    let html = "";

    let total = 0;
    let newProducts = 0;
    let bestProducts = 0;

    const categories = new Set();

    snapshot.forEach((docSnap) => {

        total++;

        const p = docSnap.data();

        if (p.new) newProducts++;
        if (p.best) bestProducts++;

        categories.add(p.category);

        html += `
        <div class="product">

            <div style="display:flex;align-items:center;gap:15px;">

                <img src="${p.image}" alt="">

                <div>

                    <h3>${p.name}</h3>

                    <p>${p.price} جنيه</p>

                    <small>${p.brand || ""}</small>

                </div>

            </div>

            <div style="display:flex;gap:10px;">

                <button onclick="editProduct('${docSnap.id}')">
                ✏️ تعديل
                </button>

                <button onclick="deleteProduct('${docSnap.id}')">
                🗑 حذف
                </button>

            </div>

        </div>
        `;

    });

    if (html === "") {
        html = "<p>لا يوجد منتجات.</p>";
    }

    productsList.innerHTML = html;

    productsCount.textContent = total;
    newCount.textContent = newProducts;
    bestCount.textContent = bestProducts;
    categoriesCount.textContent = categories.size;

}

window.deleteProduct = async function(id){

    if(!confirm("هل تريد حذف المنتج؟")) return;

    await deleteDoc(doc(db,"products",id));

    loadProducts();

};

window.editProduct = async function(id){

    const snapshot = await getDocs(productsRef);

    snapshot.forEach((d)=>{

        if(d.id===id){

            const p=d.data();

            editId=id;

            currentImage=p.image;

            nameInput.value=p.name;
            priceInput.value=p.price;
            oldPriceInput.value=p.oldPrice || "";
            brandInput.value=p.brand || "";
            pageInput.value=p.page || "";
            categoryInput.value=p.category;
            newInput.checked = p.new;
            bestInput.checked = p.best;
            document.getElementById("saveBtn").style.display="block";

            window.scrollTo({
                top:0,
                behavior:"smooth"
            });

        }

    });

};

document.getElementById("saveBtn").onclick = async function(){

    try{

        let image=currentImage;

        if(imageInput.files.length>0){

            image=await uploadImage(imageInput.files[0]);

        }

        await updateDoc(doc(db,"products",editId),{

            name:nameInput.value,
            price:Number(priceInput.value),
            oldPrice:Number(oldPriceInput.value || 0),
            brand:brandInput.value,
            page:pageInput.value,
            category:categoryInput.value,
            image:image,
            new:newInput.checked,
            best:bestInput.checked

        });

        alert("تم حفظ التعديلات");

        clearForm();
        preview.style.display = "none";
preview.src = "";

        loadProducts();

    }

    catch(err){

        console.log(err);

        alert("حدث خطأ أثناء التعديل");

    }

};

loadProducts();
// ==========================
// Preview للصورة
// ==========================

const preview = document.createElement("img");

preview.style.width = "120px";
preview.style.height = "120px";
preview.style.objectFit = "cover";
preview.style.borderRadius = "12px";
preview.style.display = "none";
preview.style.marginTop = "10px";

imageInput.parentNode.appendChild(preview);

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if (!file) {

        preview.style.display = "none";
        return;

    }

    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";

});

// ==========================
// Loading للأزرار
// ==========================

const addBtn = document.querySelector("button[onclick='addProduct()']");

function startLoading(button, text = "جارى التنفيذ...") {

    button.disabled = true;
    button.dataset.oldText = button.innerHTML;
    button.innerHTML = text;

}

function stopLoading(button) {

    button.disabled = false;
    button.innerHTML = button.dataset.oldText;

}

// تحسين زر الإضافة
const oldAdd = window.addProduct;

window.addProduct = async function () {

    startLoading(addBtn, "⏳ جارٍ رفع المنتج...");

    try {

        await oldAdd();

    } finally {

        stopLoading(addBtn);

    }

};

// تحسين زر الحفظ
const saveBtn = document.getElementById("saveBtn");

const oldSave = saveBtn.onclick;

saveBtn.onclick = async function () {

    startLoading(saveBtn, "⏳ جارٍ الحفظ...");

    try {

        await oldSave();

    } finally {

        stopLoading(saveBtn);

    }

};

// ==========================
// إعادة تحميل تلقائية كل دقيقة
// ==========================

setInterval(() => {
    loadProducts();
}, 60000);

loadProducts();

console.log("✅ 5AMSA Admin Loaded Successfully");