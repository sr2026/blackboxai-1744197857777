// Product data
const products = [
    {
        id: 1,
        name: 'Wireless Headphones',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop',
        description: 'Premium wireless headphones with noise cancellation'
    },
    {
        id: 2,
        name: 'Smart Watch',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop',
        description: 'Fitness tracking and smart notifications'
    },
    {
        id: 3,
        name: 'Bluetooth Speaker',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&auto=format&fit=crop',
        description: 'Portable speaker with 20hr battery life'
    },
    {
        id: 4,
        name: 'Laptop Backpack',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop',
        description: 'Durable backpack with USB charging port'
    },
    {
        id: 5,
        name: 'Wireless Mouse',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&auto=format&fit=crop',
        description: 'Ergonomic wireless mouse with silent clicks'
    },
    {
        id: 6,
        name: 'Phone Stand',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&auto=format&fit=crop',
        description: 'Adjustable stand for phones and tablets'
    }
];

// Cart state
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('products');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');

// Initialize the app
function init() {
    renderProducts();
    setupEventListeners();
}

// Render all products
function renderProducts() {
    productsGrid.innerHTML = products.map(product => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }
    });

    // Cart button
    cartBtn.addEventListener('click', () => {
        cartModal.classList.remove('hidden');
        renderCart();
    });

    // Close cart button
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
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    showAddedToCartNotification(product.name);
}

// Update cart count in navbar
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Show notification when item is added to cart
function showAddedToCartNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade-in-out';
    notification.textContent = `${productName} added to cart!`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Render cart items
function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="py-4 text-center text-gray-500">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="py-4 flex justify-between items-center">
            <div class="flex items-center">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                <div class="ml-4">
                    <h4 class="font-medium">${item.name}</h4>
                    <p class="text-gray-600">$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
            </div>
            <div class="flex items-center">
                <button class="text-gray-500 hover:text-gray-700 change-quantity" data-id="${item.id}" data-change="-1">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="mx-2">${item.quantity}</span>
                <button class="text-gray-500 hover:text-gray-700 change-quantity" data-id="${item.id}" data-change="1">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="ml-4 text-red-500 hover:text-red-700 remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;

    // Add event listeners for quantity changes and removal
    document.querySelectorAll('.change-quantity').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('button').dataset.id);
            const change = parseInt(e.target.closest('button').dataset.change);
            updateCartItemQuantity(productId, change);
        });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('button').dataset.id);
            removeFromCart(productId);
        });
    });
}

// Update item quantity in cart
function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }

    updateCartCount();
    renderCart();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
}

// Checkout function
function checkout() {
    if (cart.length === 0) return;

    alert(`Thank you for your purchase! Total: $${cartTotal.textContent}`);
    cart = [];
    updateCartCount();
    renderCart();
    cartModal.classList.add('hidden');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add simple animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-20px); }
        10% { opacity: 1; transform: translateY(0); }
        90% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
    }
    .animate-fade-in-out {
        animation: fadeInOut 3s ease-in-out forwards;
    }
`;
document.head.appendChild(style);
