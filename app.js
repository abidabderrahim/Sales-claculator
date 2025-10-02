let products = [];

// DOM Elements
const productForm = document.getElementById("productForm");
const productsDiv = document.getElementById("products");
const resetBtn = document.getElementById("resetBtn");
const uploadInput = document.getElementById("uploadInput");
const summaryDiv = document.getElementById("summary");

// Load from localStorage
if (localStorage.getItem("products")) {
  products = JSON.parse(localStorage.getItem("products"));
  renderProducts();
  renderSummary();
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
    const imageData = event.target.result; // base64 image
    const profit = price * quantity * 0.03;

    const product = { name, price, quantity, profit, image: imageData };
    products.push(product);
    saveAndRender();
    productForm.reset();
  };
  reader.readAsDataURL(imageFile);
});

// Reset and download JSON with date
resetBtn.addEventListener("click", () => {
  if (products.length === 0) return alert("No products to reset!");
  const date = new Date();
  const dateStr = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
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
      // Ensure uploaded products have image in base64
      const validProducts = uploadedProducts.filter(p => p.image && p.name && p.price && p.quantity);
      if (validProducts.length === 0) {
        alert("Invalid JSON file or missing images. Use JSON exported from this app.");
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

// Save to localStorage and render
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

// Render summary at bottom
function renderSummary() {
  if (products.length === 0) {
    summaryDiv.innerHTML = "";
    return;
  }

  const totalSold = products.reduce((sum,p) => sum + p.price*p.quantity, 0);
  const total3Percent = products.reduce((sum,p) => sum + p.price*p.quantity*0.03,0);
  const totalProfit = products.reduce((sum,p) => sum + p.profit,0);

  summaryDiv.innerHTML = `
    Total Sold Amount: $${totalSold.toFixed(2)}<br>
    Total 3% Deduction: $${total3Percent.toFixed(2)}<br>
    Total Profit: $${totalProfit.toFixed(2)}
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