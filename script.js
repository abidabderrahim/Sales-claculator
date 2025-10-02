const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");
const totalSalesEl = document.getElementById("totalSales");
const totalShareEl = document.getElementById("totalShare");

let products = JSON.parse(localStorage.getItem("products")) || [];

function updateTotals() {
  let totalSales = 0;
  let totalShare = 0;

  products.forEach(p => {
    totalSales += p.sales;
    totalShare += p.sales * 0.03 * p.price;
  });

  totalSalesEl.textContent = totalSales;
  totalShareEl.textContent = totalShare.toFixed(2);
}

function renderProducts() {
  productList.innerHTML = "";
  products.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="product-info">
        <p><strong>${p.name}</strong></p>
        <p>Sales: ${p.sales}</p>
        <p>3%: ${(p.sales * 0.03 * p.price).toFixed(2)} MAD</p>
      </div>
      <button class="delete-btn" onclick="deleteProduct(${index})">Delete</button>
    `;

    productList.appendChild(card);
  });

  updateTotals();
}

productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const sales = parseInt(document.getElementById("sales").value);
  const imageFile = document.getElementById("image").files[0];

  if (!imageFile) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const newProduct = {
      name,
      sales,
      price: 100, // يمكنك تغيير السعر أو إضافته كـ input
      image: event.target.result,
    };

    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    renderProducts();
    productForm.reset();
  };

  reader.readAsDataURL(imageFile);
});

function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

renderProducts();
