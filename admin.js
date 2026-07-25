import { db } from "./js/firebase.js";
import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

async function addProduct() {

  const product = {
    id: Date.now(),
    name: document.getElementById("name").value,
    price: Number(document.getElementById("price").value),
    oldPrice: Number(document.getElementById("oldPrice").value),
    image: document.getElementById("image").value,
    page: document.getElementById("page").value,
    category: document.getElementById("category").value,
    brand: document.getElementById("brand").value,
    isNew: document.getElementById("new").checked,
    bestSeller: document.getElementById("best").checked,
    createdAt: new Date()
  };

  try {

    await addDoc(collection(db, "products"), product);

    alert("✅ تم إضافة المنتج إلى Firebase");

    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("oldPrice").value = "";
    document.getElementById("image").value = "";
    document.getElementById("page").value = "";
    document.getElementById("category").value = "";
    document.getElementById("brand").value = "";
    document.getElementById("new").checked = false;
    document.getElementById("best").checked = false;

  } catch (error) {
    console.error(error);
    alert(error.message);
}
}
window.addProduct = addProduct;