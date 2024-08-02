// Base URL for the Fake Store API, which is a mock up API helps me with test products
const API_BASE_URL = 'https://fakestoreapi.com';

// Function to fetch products from the API
async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Function to display products
function displayProducts(products) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    productList.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <p>${product.description.substring(0, 100)}...</p>
            <a href="product-detail.html?id=${product.id}" class="btn">View Details</a>
        `;
        productList.appendChild(productCard);
    });
}

// Function to filter products
async function filterProducts() {
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');

    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categorySelect.value;
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

    const products = await fetchProducts();
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
        return matchesSearch && matchesCategory && matchesPrice;
    });

    displayProducts(filteredProducts);
}

// Event listener for filter button
const applyFiltersButton = document.getElementById('apply-filters');
if (applyFiltersButton) {
    applyFiltersButton.addEventListener('click', filterProducts);
}

// Function to display product details
async function displayProductDetails() {
    const productDetail = document.getElementById('product-detail');
    if (!productDetail) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        const product = await response.json();

        productDetail.innerHTML = `
            <h2>${product.title}</h2>
            <img src="${product.image}" alt="${product.title}" width="260" height="300">
            <p>Price: $${product.price.toFixed(2)}</p>
            <p>${product.description}</p>
            <p>Category: ${product.category}</p>
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" value="1" min="1">
            <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
    } catch (error) {
        console.error('Error fetching product details:', error);
        productDetail.innerHTML = '<p>Product not found</p>';
    }
}

// Function to add product to cart
async function addToCart(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        const product = await response.json();
        const quantity = parseInt(document.getElementById('quantity').value);

        if (product && quantity > 0) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ ...product, quantity });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Product added to cart!');
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        alert('Failed to add product to cart. Please try again.');
    }
}

// Display cart items
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    if (!cartItems || !cartTotal) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <span>${item.title} - $${item.price.toFixed(2)} x ${item.quantity}</span>
            <button onclick="removeFromCart(${item.id})" class="btn">Remove</button>
        `;
        cartItems.appendChild(itemElement);
        total += item.price * item.quantity;
    });

    cartTotal.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
}

// Removing items from cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Show the order summary on checkout page
function displayOrderSummary() {
    const orderSummary = document.getElementById('order-summary');
    if (!orderSummary) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    orderSummary.innerHTML = '<h4>Order Items:</h4>';
    cart.forEach(item => {
        orderSummary.innerHTML += `<p>${item.title} - $${item.price.toFixed(2)} x ${item.quantity}</p>`;
        total += item.price * item.quantity;
    });
    orderSummary.innerHTML += `<strong>Total: $${total.toFixed(2)}</strong>`;
}

// take the checkout form submission info
function handleCheckout(event) {
    event.preventDefault();

    // Validate form inputs
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const country = document.getElementById('country').value;
    const zip = document.getElementById('zip').value;
    const cardNumber = document.getElementById('card-number').value;
    const cardName = document.getElementById('card-name').value;
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;

    if (!name || !address || !city || !country || !zip || !cardNumber || !cardName || !expiry || !cvv) {
        alert('Please fill in all fields');
        return;
    }

    // Confirm payment processing it is just a mockUp
    setTimeout(() => {
        alert('Order placed successfully! - Just a Test');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    }, 1500);
}

// Event listeners for all the pages
document.addEventListener('DOMContentLoaded', async () => {
    // Display products on product listing page
    if (document.getElementById('product-list')) {
        const products = await fetchProducts();
        displayProducts(products);
    }

    // Display product details on product detail page
    if (document.getElementById('product-detail')) {
        displayProductDetails();
    }

    // Display cart on cart page
    if (document.getElementById('cart-items')) {
        displayCart();
    }

    // Display order summary on checkout page
    if (document.getElementById('order-summary')) {
        displayOrderSummary();
    }

    // Handle checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    // Populate category select
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/categories`);
            const categories = await response.json();
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }
});

// Simple search function
async function searchProducts() {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    const products = await fetchProducts();
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}

// Event listener for search input
const searchInput = document.getElementById('search');
if (searchInput) {
    searchInput.addEventListener('input', searchProducts);
}

// Access inputs and create labels
function improveAccessibility() {
    // Add aria labels to inputs
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (!input.hasAttribute('aria-label')) {
            input.setAttribute('aria-label', input.placeholder || input.name);
        }
    });

    // Add skip to main content link
    const header = document.querySelector('header');
    if (header) {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        header.insertBefore(skipLink, header.firstChild);
    }
}
improveAccessibility();