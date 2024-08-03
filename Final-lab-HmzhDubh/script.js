// Base URL for the Fake Store API, which is a mock up API helps me with test products
const API_BASE_URL = 'https://fakestoreapi.com';

// Function to fetch products from the API this api is for testing only,
//which provides muck data to manipulate and test the web app
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

// Function to display products which takes the products from the api and append it to the page
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
            <input type="number" id="quantity" value="1" min="1">
            <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productCard);
    });
}

// Function to filter products this is an application of AJAX
//to update the list of products based on these filters (category, max / min price and search keyword)
async function filterProducts() {
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');

    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categorySelect.value;
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
    // here i am contacting the API again to fitch only filtered data and append it.
    const products = await fetchProducts();
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === '' || product.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesPrice;
    });


    displayProducts(filteredProducts);
}

// Event listener for filter button to execute the previous function "filterProducts()"
const applyFiltersButton = document.getElementById('apply-filters');
if (applyFiltersButton) {
    applyFiltersButton.addEventListener('click', filterProducts);
}

// Function to display product details
//i am now accessing each product returned from the API
// then show the details of each product such as price name and short description
async function displayProductDetails() {
    const productDetail = document.getElementById('product-detail');
    if (!productDetail) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        const product = await response.json();

        // appending the details of each product in a card view with a button to add it to the cart
        productDetail.innerHTML = `
            <h2>${product.title}</h2>
            <img src="${product.image}" alt="${product.title}" width="260" height="300">
            <p>Price: $${product.price.toFixed(2)}</p>
            <p>${product.description}</p>
            <p>Category: ${product.category}</p>
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" value="1" min="1">
            <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
            <a href="cart.html" class="btn">Go To Your Cart</a>
        `;
    } catch (error) {
        console.error('Error fetching product details:', error);
        productDetail.innerHTML = '<p>Product not found</p>';
    }
}

// Function to add product to cart array and display it at the cart page
// in addition to calculating the total price and the quantity of the added item/items
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
            // Adding to the cart array
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Product added to cart!');
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        alert('Failed to add product to cart. Please try again.');
    }
}

// Display cart items and their details in the cart page with the total price.
// button to remove the item by exe a function below (removeFromCart) when it is clicked
// and a button to continue to payment and checkout displayOrderSummary() on checkout page
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
        // adding the elements to the page
        cartItems.appendChild(itemElement);
        total += item.price * item.quantity;
    });
    // total fixed to constant
    cartTotal.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
}

// Removing items from cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Show the order summary on the checkout page
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

// take the checkout form submission info like the name, address and so on.
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

    // Regex for char numbers and date validation
    const onlyLettersRegex = /^[A-Za-z\s]+$/;
    const onlyNumbersRegex = /^\d+$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

    // validating that data are completely filled
    if (!name || !address || !city || !country || !zip || !cardNumber || !cardName || !expiry || !cvv) {
        alert('Please fill in all fields');
        return;
    }
    // Validating name, city, country, and cardName (only characters)
    if (!onlyLettersRegex.test(name) || !onlyLettersRegex.test(city) || !onlyLettersRegex.test(country) || !onlyLettersRegex.test(cardName)) {
        alert('Name, city, country, and card name should contain only letters');
        return;
    }

    // Validating zip, cardNumber, and cvv (only numbers)
    if (!onlyNumbersRegex.test(zip) || !onlyNumbersRegex.test(cardNumber) || !onlyNumbersRegex.test(cvv)) {
        alert('ZIP code, card number, and CVV should contain only numbers');
        return;
    }

     // Get cart items
     const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Calculate total
     const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Create order object
        const order = {
            id: Date.now(), // Use timestamp as a simple unique ID
            date: new Date().toISOString(),
            customer: { name, address, city, country, zip },
            items: cart,
            total: total,
            paymentStatus: 'Processing'
        };
        console.log("order is : " + order);

    // Confirm payment processing it is just a mockUp by showing the alert for a specific period of time as a sign of successful payment process.
     setTimeout(() => {
            // Update payment status
            order.paymentStatus = 'Paid';

            // Save order to localStorage
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));

            // Clear the cart
            localStorage.removeItem('cart');

            alert('Order placed successfully!');
            window.location.href = 'order.html?id=' + order.id;
        }, 1500);
}
function displayOrderDetails() {
    const orderDetails = document.getElementById('order-details');
    if (!orderDetails) return;

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = parseInt(urlParams.get('id'));

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);

    if (order) {
        orderDetails.innerHTML = `
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
            <p><strong>Customer:</strong> ${order.customer.name}</p>
            <p><strong>Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.country}, ${order.customer.zip}</p>
            <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
            <h3>Items:</h3>
            <ul>
                ${order.items.map(item => `
                    <li>${item.title} - $${item.price.toFixed(2)} x ${item.quantity}</li>
                    `).join('')}
            </ul>
            <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
        `;
    } else {
        orderDetails.innerHTML = '<p>Order not found</p>';
    }

}
// Event listeners for all the pages here i managed to put all eventlisteners here as much as i could
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

    // Handle checkout form submission button
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    if (document.getElementById('order-details')) {
        displayOrderDetails();
    }

    // I am using AJAX here to update the list of the products only, without reloading the entire page
    //Using the search input as the trigger for the change
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

// Simple search function for the filtering process.
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

// Event listener for search input that execute the previous function for the filtering of products
const searchInput = document.getElementById('search');
if (searchInput) {
    searchInput.addEventListener('input', searchProducts);
}

// Access inputs and create labels, here is a function that adds aria lapels for the inputs
function improveAccessibility() {
    // Add aria labels to inputs
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (!input.hasAttribute('aria-label')) {
            input.setAttribute('aria-label', input.placeholder || input.name);
        }
    });

     //Add skip link to the main content to go to main page to Ensure accessibility for users with disabilities.
    const header = document.querySelector('header');
    if (header) {
        const skipLink = document.createElement('a');
        skipLink.href = 'products.html';
        skipLink.textContent = 'Skip to products';
        skipLink.className = 'skip-link';
        skipLink.style.textDecoration = 'none';
        header.insertBefore(skipLink, header.firstChild);
    }
}
improveAccessibility();