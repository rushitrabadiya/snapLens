// Sample product data - this would typically come from a database or API
const products = [
  {
    name: "Professional Camera Lens",
    description: "High-quality camera lens for professional photography",
    image: "https://via.placeholder.com/300x200",
    link: "https://www.amazon.com/example-product-1",
  },
  {
    name: "Camera Tripod",
    description: "Sturdy tripod for stable shots",
    image: "https://via.placeholder.com/300x200",
    link: "https://www.amazon.com/example-product-2",
  },
  {
    name: "Camera Bag",
    description: "Durable camera bag with padding",
    image: "https://via.placeholder.com/300x200",
    link: "https://www.amazon.com/example-product-3",
  },
];

// Function to create product cards
function createProductCard(product) {
  return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <a href="${product.link}" class="btn" target="_blank">Buy Now</a>
        </div>
    `;
}

// Function to render products
function renderProducts() {
  const productGrid = document.querySelector(".product-grid");
  if (productGrid) {
    productGrid.innerHTML = products.map(createProductCard).join("");
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
});
