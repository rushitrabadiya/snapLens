// Check if user is logged in
if (!sessionStorage.getItem("adminLoggedIn")) {
  window.location.href = "admin-login.html";
}

// DOM Elements
const productsTableBody = document.getElementById("productsTableBody");
const addProductBtn = document.getElementById("addProductBtn");
const productModal = document.getElementById("productModal");
const productForm = document.getElementById("productForm");
const modalTitle = document.getElementById("modalTitle");
const closeModal = document.querySelector(".close");
const cancelBtn = document.getElementById("cancelBtn");
const logoutBtn = document.getElementById("logoutBtn");
const adminProductSearch = document.getElementById("adminProductSearch");
const adminSortProducts = document.getElementById("adminSortProducts");

// Event Listeners
addProductBtn.addEventListener("click", () => openModal());
closeModal.addEventListener("click", () => closeProductModal());
cancelBtn.addEventListener("click", () => closeProductModal());
productForm.addEventListener("submit", handleProductSubmit);
logoutBtn.addEventListener("click", handleLogout);
adminProductSearch.addEventListener("input", updateProductsTable);
adminSortProducts.addEventListener("change", updateProductsTable);

// Initialize products display
displayProducts();

function openModal(product = null) {
  productModal.style.display = "block";
  if (product) {
    modalTitle.textContent = "Edit Product";
    fillFormWithProduct(product);
  } else {
    modalTitle.textContent = "Add New Product";
    productForm.reset();
    document.getElementById("productId").value = "";
  }
}

function closeProductModal() {
  productModal.style.display = "none";
  productForm.reset();
}

function fillFormWithProduct(product) {
  document.getElementById("productId").value = product.id;
  document.getElementById("productName").value = product.name;
  document.getElementById("productDescription").value = product.description;
  document.getElementById("productPrice").value = product.price;
  document.getElementById("productCategory").value = product.category;
  document.getElementById("productImage").value = product.image;
  document.getElementById("amazonLink").value = product.amazonLink;
  document.getElementById("productFeatured").checked = product.featured;
}

function handleProductSubmit(e) {
  e.preventDefault();

  const productId = document.getElementById("productId").value;
  const newProduct = {
    id: productId || Date.now().toString(),
    name: document.getElementById("productName").value,
    description: document.getElementById("productDescription").value,
    price: parseFloat(document.getElementById("productPrice").value),
    category: document.getElementById("productCategory").value,
    image: document.getElementById("productImage").value,
    amazonLink: document.getElementById("amazonLink").value,
    featured: document.getElementById("productFeatured").checked,
  };

  if (productId) {
    // Edit existing product
    const index = products.findIndex((p) => p.id === productId);
    if (index !== -1) {
      products[index] = newProduct;
    }
  } else {
    // Add new product
    products.push(newProduct);
  }

  // Save to localStorage
  localStorage.setItem("products", JSON.stringify(products));

  // Update display and close modal
  displayProducts();
  closeProductModal();
}

function displayProducts() {
  const searchTerm = adminProductSearch.value.toLowerCase();
  const sortBy = adminSortProducts.value;

  let filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
  );

  // Sort products
  switch (sortBy) {
    case "name":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "default":
      filteredProducts.sort((a, b) => b.featured - a.featured);
      break;
  }

  productsTableBody.innerHTML = filteredProducts
    .map(
      (product) => `
        <tr>
            <td><img src="${product.image}" alt="${product.name}"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price.toFixed(2)}</td>
            <td>${product.featured ? '<i class="fas fa-star"></i>' : ""}</td>
            <td>
                <button class="action-btn edit-btn" onclick="handleEdit('${
                  product.id
                }')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="handleDelete('${
                  product.id
                }')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `
    )
    .join("");
}

function handleEdit(productId) {
  const product = products.find((p) => p.id === productId);
  if (product) {
    openModal(product);
  }
}

function handleDelete(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    products = products.filter((p) => p.id !== productId);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
  }
}

function updateProductsTable() {
  displayProducts();
}

function handleLogout() {
  sessionStorage.removeItem("adminLoggedIn");
  window.location.href = "admin-login.html";
}

// Window click event to close modal
window.onclick = function (event) {
  if (event.target === productModal) {
    closeProductModal();
  }
};
