// Product data
const products = [
  {
    id: 1,
    name: "Professional Camera Lens",
    description: "High-quality camera lens for professional photography",
    price: 599.99,
    image: "products/1 (1).png",
    amazonLink: "https://www.amazon.com/dp/B00LXKN6HQ",
    category: "Lenses",
    featured: true,
  },
  {
    id: 2,
    name: "Camera Tripod",
    description: "Sturdy tripod for stable shots",
    price: 149.99,
    image: "products/2 (1).png",
    amazonLink: "https://www.amazon.com/dp/B00XIABVTS",
    category: "Accessories",
    featured: true,
  },
  {
    id: 3,
    name: "Camera Bag",
    description: "Durable camera bag with padding",
    price: 79.99,
    image: "products/3.png",
    amazonLink: "https://www.amazon.com/dp/B002VPE1WK",
    category: "Accessories",
    featured: false,
  },
  {
    id: 4,
    name: "Professional Flash",
    description: "High-power flash for perfect lighting",
    price: 249.99,
    image: "products/4.png",
    amazonLink: "https://www.amazon.com/dp/B00ZP8G2DK",
    category: "Lighting",
    featured: true,
  },
  {
    id: 5,
    name: "UV Filter Set",
    description: "Professional UV filters for lens protection",
    price: 49.99,
    image: "products/5.png",
    amazonLink: "https://www.amazon.com/dp/B00004ZCJJ",
    category: "Accessories",
    featured: false,
  },
  {
    id: 6,
    name: "Pro Memory Card",
    description: "High-speed memory card for professionals",
    price: 89.99,
    image: "products/6.png",
    amazonLink: "https://www.amazon.com/dp/B07H9DVLBB",
    category: "Accessories",
    featured: false,
  },
];

// DOM Elements
const productsContainer = document.querySelector(".products-container");
const searchInput = document.getElementById("productSearch");
const sortSelect = document.getElementById("sortProducts");
const clearSearchBtn = document.getElementById("clearSearch");

// Function to create product card HTML
function createProductCard(product) {
  return `
    <div class="product-card">
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-overlay">
          <a href="${
            product.amazonLink
          }" target="_blank" class="quick-view-btn">
            <i class="fas fa-shopping-cart"></i> Shop Now
          </a>
        </div>
      </div>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="product-price">$${product.price.toFixed(2)}</div>
      <a href="${product.amazonLink}" target="_blank" class="product-link">
        Shop Now <i class="fas fa-shopping-cart"></i>
      </a>
    </div>
  `;
}

// Function to display products
function displayProducts(productsToShow = products) {
  if (productsToShow.length === 0) {
    productsContainer.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <h3>No products found</h3>
        <p>Try adjusting your search criteria</p>
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = productsToShow
    .map((product) => createProductCard(product))
    .join("");
}

// Function to filter products
function filterProducts(searchTerm) {
  if (!searchTerm) return products;

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

// Function to sort products
function sortProducts(productsToSort, sortBy) {
  const sortedProducts = [...productsToSort];
  switch (sortBy) {
    case "price-low":
      sortedProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      sortedProducts.sort((a, b) => b.price - a.price);
      break;
    case "name":
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // For 'default', show featured items first
      sortedProducts.sort((a, b) => b.featured - a.featured);
  }
  return sortedProducts;
}

// Function to update display based on current filters and sort
function updateProductDisplay() {
  const searchTerm = searchInput.value;
  const sortValue = sortSelect.value;

  const filteredProducts = filterProducts(searchTerm);
  const sortedProducts = sortProducts(filteredProducts, sortValue);

  displayProducts(sortedProducts);
}

// Function to toggle clear button visibility
function toggleClearButton() {
  const isVisible = searchInput.value.length > 0;
  clearSearchBtn.classList.toggle("visible", isVisible);
}

// Function to clear search
function clearSearch() {
  searchInput.value = "";
  toggleClearButton();
  updateProductDisplay();
  searchInput.focus();
}

// Event Listeners
searchInput.addEventListener("input", () => {
  toggleClearButton();
  updateProductDisplay();
});

clearSearchBtn.addEventListener("click", clearSearch);

sortSelect.addEventListener("change", updateProductDisplay);

// Initialize products display
document.addEventListener("DOMContentLoaded", () => {
  displayProducts(sortProducts(products, "default"));
  toggleClearButton();
});
