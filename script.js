// Sample product data
const products = [
    {
        id: 1,
        name: 'Wireless Headphones',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Premium wireless headphones with noise cancellation'
    },
    {
        id: 2,
        name: 'Smart Watch',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Feature-rich smartwatch with health monitoring'
    },
    {
        id: 3,
        name: 'Bluetooth Speaker',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Portable speaker with 20-hour battery life'
    },
    {
        id: 4,
        name: 'Laptop Backpack',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Durable backpack with USB charging port'
    },
    {
        id: 5,
        name: 'Wireless Mouse',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Ergonomic wireless mouse with silent clicks'
    },
    {
        id: 6,
        name: 'Phone Stand',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Adjustable stand for phones and tablets'
    }
];

// Cart state
let cart = [];

// DOM elements
const productsContainer = document.getElementById('products');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartBtn = document.getElementById('cart-btn');
const closeCart = document.getElementById('close-cart');
const checkoutBtn = document.getElementById('checkout-btn');

// Initialize the app
function init() {
    renderProducts();
    setupEventListeners();
}

// Render all products
function renderProducts() {
    productsContainer.innerHTML = products.map(product => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2">${product.name}</h3>
                <p class="text-gray-600 mb-4">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-lg">$${product.price.toFixed(2)}</span>
                    <button 
                        class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded add-to-cart" 
                        data-id="${product.id}"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Set up event listeners
function setupEventListeners() {
    // Add to cart buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            addToCart(productId);
        }
    });

    // Cart button
    cartBtn.addEventListener('click', () => {
        cartModal.classList.remove('hidden');
        renderCart();
    });

    // Close cart
    closeCart.addEventListener('click', () => {
        cartModal.classList.add('hidden');
    });

    // Checkout button
    checkoutBtn.addEventListener('click', checkout);
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartCount();
    showAddedToCartNotification(product.name);
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Render cart items
function renderCart() {
    cartItems.innerHTML = cart.map(item => `
        <div class="py-4 flex justify-between">
            <div class="flex">
                <img src="${item.image}" alt="${item.name}" class="h-16 w-16 object-cover rounded">
                <div class="ml-4">
                    <h4 class="font-bold">${item.name}</h4>
                    <p class="text-gray-600">$${item.price.toFixed(2)}</p>
                    <div class="flex items-center mt-1">
                        <button class="text-gray-500 change-quantity" data-id="${item.id}" data-change="-1">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="text-gray-500 change-quantity" data-id="${item.id}" data-change="1">+</button>
                    </div>
                </div>
            </div>
            <button class="text-red-500 remove-item" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;

    // Add event listeners for quantity changes and removal
    document.querySelectorAll('.change-quantity').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const change = parseInt(e.target.getAttribute('data-change'));
            updateQuantity(productId, change);
        });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        updateCartCount();
        renderCart();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
}

// Show notification when item is added to cart
function showAddedToCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg';
    notification.textContent = `${productName} added to cart!`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    alert(`Thank you for your purchase! Total: $${cartTotal.textContent}`);
    cart = [];
    updateCartCount();
    cartModal.classList.add('hidden');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
