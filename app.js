let products = [];

// DOM Elements
const productForm = document.getElementById("productForm");
const productsDiv = document.getElementById("products");
const resetBtn = document.getElementById("resetBtn");
const uploadInput = document.getElementById("uploadInput");
const summaryDiv = document.getElementById("summary");
const previewImage = document.getElementById("previewImage");
const imageInput = document.getElementById("image");

// Load from localStorage
if (localStorage.getItem("products")) {
  products = JSON.parse(localStorage.getItem("products"));
  renderProducts();
  renderSummary();
}

// Show live image preview
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) {
    previewImage.style.display = "none";
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    previewImage.src = e.target.result;
    previewImage.style.display = "block";
  };
  reader.readAsDataURL(file);
});

// Add product
productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const price = parseFloat(document.getElementById("price").value);
  const quantity = parseInt(document.getElementById("quantity").value);
  const imageFile = imageInput.files[0];

  if (!imageFile) return alert("Please select an image");

  const reader = new FileReader();
  reader.onload = function(event) {
    const imageData = event.target.result;
    const profit = price * quantity * 0.03;

    const product = { name, price, quantity, profit, image: imageData };
    products.push(product);
    saveAndRender();
    productForm.reset();
    previewImage.style.display = "none";
  };
  reader.readAsDataURL(imageFile);
});

// Reset and download JSON with date
resetBtn.addEventListener("click", () => {
  if (products.length === 0) return alert("No products to reset!");
  const date = new Date();
  const dateStr = `${date.getDate()}_${date.getMonth()+1}_${date.getFullYear()}`;
  downloadJSON(`products_${dateStr}.json`);
  products = [];
  saveAndRender();
});

// Upload JSON
uploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const uploadedProducts = JSON.parse(event.target.result);
      const validProducts = uploadedProducts.filter(p => p.image && p.name && p.price && p.quantity);
      if (validProducts.length === 0) {
        alert("Invalid JSON. Please use JSON exported from this app.");
        return;
      }
      products = validProducts;
      saveAndRender();
    } catch (err) {
      alert("Invalid JSON file");
    }
  };
  reader.readAsText(file);
});

// Save & render
function saveAndRender() {
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
  renderSummary();
}

// Render products table
function renderProducts() {
  productsDiv.innerHTML = "";
  products.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div>
        <strong>${p.name}</strong><br>
        Price: ${p.price.toFixed(2)} DH<br>
        Quantity: ${p.quantity}<br>
        Profit: ${p.profit.toFixed(2)} DH
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

// Render summary (Total Sold after 3% per product, Total Profit)
function renderSummary() {
  if (products.length === 0) {
    summaryDiv.innerHTML = "";
    return;
  }

  let totalSoldAfter3 = 0; // total received after 3% per product
  let totalProfit = 0;     // sum of 3% for each product

  products.forEach(p => {
    const productTotal = p.price * p.quantity;
    const productProfit = productTotal * 0.03;
    totalProfit += productProfit;
    totalSoldAfter3 += productTotal - productProfit;
  });

  summaryDiv.innerHTML = `
    Total Sold Amount (after 3% per product): ${totalSoldAfter3.toFixed(2)} DH<br>
    Total Profit from 3%: ${totalProfit.toFixed(2)} DH
  `;
}

// Download JSON helper
function downloadJSON(filename) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", filename);
  dlAnchor.click();
}