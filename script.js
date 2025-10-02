let products = JSON.parse(localStorage.getItem("products")) || [];

function displayProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";
  products.forEach((product, index) => {
    container.innerHTML += `
      <div class="product">
        <img src="${product.image}" alt="Product Image" />
        <h3>${product.name}</h3>
        <p><strong>Price:</strong> $${product.price}</p>
        <p>${product.description}</p>
        <button class="delete-btn" onclick="deleteProduct(${index})">Delete</button>
      </div>
    `;
  });
}

function addProduct() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;
  const imageInput = document.getElementById("image");

  if (!name || !price || !imageInput.files[0]) {
    alert("Please fill all fields and add an image!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const newProduct = {
      name,
      price,
      description,
      image: e.target.result
    };
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
  };
  reader.readAsDataURL(imageInput.files[0]);

  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("description").value = "";
  imageInput.value = "";
}

function deleteProduct(index) {
  if (confirm("Are you sure you want to delete this product?")) {
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
  }
}

displayProducts();

// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
