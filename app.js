let products = [];

// DOM Elements
const productForm = document.getElementById("productForm");
const productsDiv = document.getElementById("products");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");
const uploadInput = document.getElementById("uploadInput");

// Load from localStorage
if (localStorage.getItem("products")) {
  products = JSON.parse(localStorage.getItem("products"));
  renderProducts();
}

// Add product
productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const price = parseFloat(document.getElementById("price").value);
  const quantity = parseInt(document.getElementById("quantity").value);
  const imageFile = document.getElementById("image").files[0];

  if (!imageFile) return alert("Please select an image");

  const reader = new FileReader();
  reader.onload = function(event) {
    const imageData = event.target.result; // base64 string

    const profit = price * quantity * 0.03;

    const product = { name, price, quantity, profit, image: imageData };
    products.push(product);
    saveAndRender();
    productForm.reset();
  };

  reader.readAsDataURL(imageFile); // convert image to base64
});

// Reset data
resetBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset all data?")) {
    downloadJSON(); // download backup before reset
    products = [];
    saveAndRender();
  }
});

// Download JSON
downloadBtn.addEventListener("click", downloadJSON);

function downloadJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "products.json");
  dlAnchor.click();
}

// Upload JSON
uploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      products = JSON.parse(event.target.result);
      saveAndRender();
    } catch (err) {
      alert("Invalid JSON file");
    }
  };
  reader.readAsText(file);
});

// Save to localStorage and render
function saveAndRender() {
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

// Render products
function renderProducts() {
  productsDiv.innerHTML = "";
  products.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div>
        <strong>${p.name}</strong><br>
        Price: $${p.price.toFixed(2)}<br>
        Quantity: ${p.quantity}<br>
        Profit: $${p.profit.toFixed(2)}
      </div>
      <button onclick="deleteProduct(${index})">Delete</button>
    `;
    productsDiv.appendChild(div);
  });
}

// Delete product
function deleteProduct(index) {
  products.splice(index, 1);
  saveAndRender();
}