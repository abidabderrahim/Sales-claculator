let products = JSON.parse(localStorage.getItem('products')) || [];

function renderProducts() {
  const table = document.getElementById("productTable");
  table.innerHTML = '';
  let totalSales = 0;
  let totalShare = 0;

  products.forEach(p => {
    const productTotal = p.price * p.count;
    const myShare = productTotal * 0.03;
    totalSales += productTotal;
    totalShare += myShare;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.image ? `<img src="${p.image}" />` : ''}</td>
      <td>${p.name}</td>
      <td>${p.price.toFixed(2)}</td>
      <td>${p.count}</td>
      <td>${productTotal.toFixed(2)}</td>
      <td>${myShare.toFixed(2)}</td>
    `;
    table.appendChild(row);
  });

  document.getElementById("totalSales").textContent = totalSales.toFixed(2);
  document.getElementById("totalShare").textContent = totalShare.toFixed(2);
  localStorage.setItem('products', JSON.stringify(products));
}

function addProduct() {
  const name = document.getElementById("productName").value;
  const price = parseFloat(document.getElementById("productPrice").value);
  const count = parseInt(document.getElementById("productCount").value);
  const imageFile = document.getElementById("productImage").files[0];

  if (!name || isNaN(price) || isNaN(count)) {
    alert("المرجو إدخال جميع القيم بشكل صحيح");
    return;
  }

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const newProduct = { name, price, count, image: e.target.result };
      products.push(newProduct);
      renderProducts();
    }
    reader.readAsDataURL(imageFile);
  } else {
    const newProduct = { name, price, count, image: null };
    products.push(newProduct);
    renderProducts();
  }

  document.getElementById("productName").value = '';
  document.getElementById("productPrice").value = '';
  document.getElementById("productCount").value = '';
  document.getElementById("productImage").value = '';
}

function downloadJSON() {
  const dataStr = JSON.stringify(products, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'TheePercentProducts.json';
  a.click();
  URL.revokeObjectURL(url);
  alert("تم تنزيل ملف JSON يحتوي على جميع المنتجات والصور");
}

// Load products from localStorage on start
renderProducts();
