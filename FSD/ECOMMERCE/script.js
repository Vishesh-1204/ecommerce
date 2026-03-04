// ===== Product Data =====
const products = [
    {
        id: 1,
        name: 'Minimalist Chair',
        category: 'Furniture',
        price: 349.99,
        badge: 'New',
        icon: '🪑'
    },
    {
        id: 2,
        name: 'Pendant Light',
        category: 'Lighting',
        price: 189.99,
        badge: 'Sale',
        icon: '💡'
    },
    {
        id: 3,
        name: 'Ceramic Vase',
        category: 'Decor',
        price: 79.99,
        badge: '',
        icon: '🏺'
    },
    {
        id: 4,
        name: 'Wool Throw',
        category: 'Textiles',
        price: 129.99,
        badge: 'New',
        icon: '🧶'
    },
    {
        id: 5,
        name: 'Oak Coffee Table',
        category: 'Furniture',
        price: 599.99,
        badge: '',
        icon: '🪵'
    },
    {
        id: 6,
        name: 'Wall Sconce',
        category: 'Lighting',
        price: 149.99,
        badge: 'Sale',
        icon: '🔦'
    },
    {
        id: 7,
        name: 'Abstract Print',
        category: 'Decor',
        price: 199.99,
        badge: '',
        icon: '🖼️'
    },
    {
        id: 8,
        name: 'Linen Cushion',
        category: 'Textiles',
        price: 49.99,
        badge: 'New',
        icon: '🛋️'
    },
    {
        id: 9,
        name: 'Modern Bookshelf',
        category: 'Furniture',
        price: 449.99,
        badge: '',
        icon: '📚'
    },
    {
        id: 10,
        name: 'Table Lamp',
        category: 'Lighting',
        price: 119.99,
        badge: '',
        icon: '🪔'
    },
    {
        id: 11,
        name: 'Decorative Mirror',
        category: 'Decor',
        price: 249.99,
        badge: 'New',
        icon: '🪞'
    },
    {
        id: 12,
        name: 'Cotton Rug',
        category: 'Textiles',
        price: 299.99,
        badge: '',
        icon: '🎨'
    }
];

// ===== Cart State =====
let cart = [];

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', () => {
    initializeProducts();
    initializeNavigation();
    initializeCart();
    initializeLogin();
    loadCartFromStorage();
});

// ===== Product Rendering =====
function initializeProducts() {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;

    productGrid.innerHTML = products.map((product, index) => `
        <div class="product-card" style="--delay: ${index * 0.05}s;">
            <div class="product-image">
                <div class="product-image-placeholder">${product.icon}</div>
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price" data-product-id="${product.id}">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// ===== Navigation =====
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
}

// ===== Cart Functionality =====
function initializeCart() {
    const cartLinks = document.querySelectorAll('.cart-link');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');

    // Open cart
    cartLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    });

    // Close cart
    if (closeCart) {
        closeCart.addEventListener('click', closeCartSidebar);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartSidebar);
    }
}

function openCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    saveCartToStorage();
    showAddedToCartAnimation();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCartToStorage();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
        saveCartToStorage();
    }
}

function updateCart() {
    updateCartCount();
    updateCartItems();
    updateCartTotal();
}

function updateCartCount() {
    const cartCounts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCounts.forEach(count => {
        count.textContent = totalItems;
        
        // Animation
        count.style.transform = 'scale(1.3)';
        setTimeout(() => {
            count.style.transform = 'scale(1)';
        }, 200);
    });
}

function updateCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.icon}</div>
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
}

function updateCartTotal() {
    const totalPriceElement = document.getElementById('totalPrice');
    if (!totalPriceElement) return;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElement.textContent = `$${total.toFixed(2)}`;
}

function showAddedToCartAnimation() {
    // Simple feedback - you can enhance this
    const cartCounts = document.querySelectorAll('.cart-count');
    cartCounts.forEach(count => {
        count.style.backgroundColor = '#43e97b';
        setTimeout(() => {
            count.style.backgroundColor = '';
        }, 500);
    });
}

// ===== Local Storage =====
function saveCartToStorage() {
    localStorage.setItem('atelierCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('atelierCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// ===== Login/Register Forms =====
function initializeLogin() {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (!loginTab || !registerTab) return;

    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    // Form submissions
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            alert(`Login functionality would authenticate: ${email}`);
            // Here you would typically send to a backend API
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            alert(`Registration functionality would create account for: ${name} (${email})`);
            // Here you would typically send to a backend API
        });
    }
}

// ===== Dynamic Price Updates (Example Feature) =====
// This demonstrates how you could update prices dynamically
function applyDiscount(productId, discountPercent) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const originalPrice = product.price;
    const discountedPrice = originalPrice * (1 - discountPercent / 100);
    
    // Update product price
    product.price = discountedPrice;
    
    // Update display
    const priceElement = document.querySelector(`[data-product-id="${productId}"]`);
    if (priceElement) {
        priceElement.innerHTML = `
            <del style="color: #999; font-size: 0.9em;">$${originalPrice.toFixed(2)}</del>
            $${discountedPrice.toFixed(2)}
        `;
    }
    
    // Update cart if product is in cart
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.price = discountedPrice;
        updateCart();
    }
}

// Example: Apply 20% discount to product with ID 2
// Uncomment to test:
// setTimeout(() => applyDiscount(2, 20), 2000);

// ===== Newsletter Form =====
const newsletterForms = document.querySelectorAll('.newsletter-form');
newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('.newsletter-input').value;
        alert(`Newsletter subscription functionality would subscribe: ${email}`);
        form.reset();
    });
});

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
