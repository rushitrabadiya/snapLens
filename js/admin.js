// Admin password (in a real application, this would be handled server-side)
const ADMIN_PASSWORD = "admin123";

// Function to check admin authentication
function checkAuth() {
  return localStorage.getItem("adminAuthenticated") === "true";
}

// Function to handle admin login
function handleLogin(event) {
  event.preventDefault();
  const password = document.getElementById("adminPassword").value;

  if (password === ADMIN_PASSWORD) {
    localStorage.setItem("adminAuthenticated", "true");
    showAdminPanel();
  } else {
    showNotification("Invalid password", "error");
  }
}

// Function to handle logout
function handleLogout() {
  localStorage.removeItem("adminAuthenticated");
  showLoginForm();
}

// Function to show admin panel
function showAdminPanel() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("adminPanel").style.display = "block";
  loadWarrantyData();
  loadProducts();
}

// Function to show login form
function showLoginForm() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("adminPanel").style.display = "none";
}

// Function to show notification
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Function to load warranty data
function loadWarrantyData(searchTerm = "") {
  const warrantyData = JSON.parse(localStorage.getItem("warrantyData")) || [];
  const tbody = document.querySelector("#warrantyTable tbody");

  let filteredData = warrantyData;
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filteredData = warrantyData.filter((data) =>
      Object.values(data).some((value) =>
        String(value).toLowerCase().includes(searchLower)
      )
    );
  }

  tbody.innerHTML = filteredData
    .map(
      (data) => `
    <tr>
      <td>${data.name}</td>
      <td>${data.email}</td>
      <td>${data.phone}</td>
      <td>${data.product}</td>
      <td>${data.orderNumber}</td>
      <td>${data.platform}</td>
      <td>${data.orderDate}</td>
      <td>${new Date(data.submissionDate).toLocaleDateString()}</td>
    </tr>
  `
    )
    .join("");

  // Update count
  document.getElementById("warrantyCount").textContent = filteredData.length;
}

// Function to download warranty data as Excel
function downloadWarrantyData() {
  const warrantyData = JSON.parse(localStorage.getItem("warrantyData")) || [];
  if (warrantyData.length === 0) {
    showNotification("No data to download", "error");
    return;
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(warrantyData);
  XLSX.utils.book_append_sheet(wb, ws, "Warranty Data");
  XLSX.writeFile(wb, "warranty_data.xlsx");
  showNotification("Data downloaded successfully");
}

// Function to load products
function loadProducts() {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const productList = document.getElementById("productList");

  if (productList) {
    productList.innerHTML = products
      .map(
        (product, index) => `
      <div class="product-item">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <a href="${product.link}" target="_blank">View Product</a>
        </div>
        <div class="product-actions">
          <button onclick="editProduct(${index})" class="btn">Edit</button>
          <button onclick="deleteProduct(${index})" class="btn btn-danger">Delete</button>
        </div>
      </div>
    `
      )
      .join("");
  }
}

// Function to handle product form submission
function handleProductSubmit(event) {
  event.preventDefault();

  const productData = {
    name: document.getElementById("productName").value.trim(),
    link: document.getElementById("productLink").value.trim(),
    image: document.getElementById("productImage").value.trim(),
    description: document.getElementById("productDescription").value.trim(),
  };

  // Validate product data
  if (
    !productData.name ||
    !productData.link ||
    !productData.image ||
    !productData.description
  ) {
    showNotification("Please fill in all fields", "error");
    return;
  }

  try {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(productData);
    localStorage.setItem("products", JSON.stringify(products));

    showNotification("Product added successfully");
    event.target.reset();
    loadProducts();
  } catch (error) {
    console.error("Error saving product:", error);
    showNotification("Error saving product", "error");
  }
}

// Function to edit product
function editProduct(index) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products[index];

  document.getElementById("productName").value = product.name;
  document.getElementById("productLink").value = product.link;
  document.getElementById("productImage").value = product.image;
  document.getElementById("productDescription").value = product.description;

  // Remove the product from the list
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  loadProducts();
}

// Function to delete product
function deleteProduct(index) {
  if (confirm("Are you sure you want to delete this product?")) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    loadProducts();
    showNotification("Product deleted successfully");
  }
}

// Initialize admin panel
document.addEventListener("DOMContentLoaded", () => {
  // Check if already authenticated
  if (checkAuth()) {
    showAdminPanel();
  } else {
    showLoginForm();
  }

  // Add event listeners
  document.getElementById("adminLogin").addEventListener("submit", handleLogin);
  document.getElementById("logoutBtn").addEventListener("click", handleLogout);
  document
    .getElementById("downloadData")
    .addEventListener("click", downloadWarrantyData);
  document
    .getElementById("productForm")
    .addEventListener("submit", handleProductSubmit);

  // Add search functionality
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      loadWarrantyData(e.target.value);
    });
  }
});
