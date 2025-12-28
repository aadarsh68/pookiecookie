// Product Data
const products = [
    {
        id: 1,
        name: "Royal Nankhatai",
        price: 350,
        category: "spiced",
        description: "Melt-in-mouth shortbread with cardamom, saffron, and pistachios.",
        image: "assets/nankhatai.png"
    },
    {
        id: 2,
        name: "Hyderabadi Osmania",
        price: 280,
        category: "classic",
        description: "The classic sweet and salty biscuit, baked to golden perfection.",
        image: "assets/osmania.png"
    },
    {
        id: 3,
        name: "Shrewsbury Butter",
        price: 450,
        category: "classic",
        description: "Rich, buttery Pune classics stamped with our signature embossed Pookie design.",
        image: "assets/shrewsbury.png"
    },
    {
        id: 4,
        name: "Jeera Masala Crisp",
        price: 220,
        category: "spiced",
        description: "Savory cumin-spiced cookies for the perfect chai-time companion.",
        image: "assets/jeera.png"
    },
    {
        id: 5,
        name: "Coconut Khari",
        price: 300,
        category: "nutty",
        description: "Flaky, multi-layered puff pastry biscuits with a sweet coconut glaze.",
        image: "assets/khari.png"
    },
    {
        id: 6,
        name: "Rose Pistachio",
        price: 499,
        category: "nutty",
        description: "Infused with pure rose water and studded with Iranian pistachios.",
        image: "assets/rose_pistachio.png"
    }
];

// State
let cart = [];
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.querySelector('.cart-count');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Only verify icons if lucide is available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    renderProducts('all');
    setupEventListeners();
    setupCursor();
    setupAuthListeners(); // Initialize Auth Listeners
});

function setupEventListeners() {
    // Cart Toggles
    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('close-cart').addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(26, 15, 15, 0.95)';
        } else {
            nav.style.background = 'rgba(26, 15, 15, 0.6)';
        }
    });

    // Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class
            btn.classList.add('active');
            // Render filtered
            renderProducts(btn.dataset.filter);
        });
    });

    // Auth Toggles
    const authOverlay = document.getElementById('auth-overlay');
    const loginBtn = document.getElementById('login-nav-btn');
    const closeAuth = document.getElementById('close-auth');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            authOverlay.classList.add('open');
        });
    }

    closeAuth.addEventListener('click', () => {
        authOverlay.classList.remove('open');
    });

    authOverlay.addEventListener('click', (e) => {
        if (e.target === authOverlay) {
            authOverlay.classList.remove('open');
        }
    });
}

function switchAuth(mode) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (mode === 'signup') {
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    } else {
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
    }
}

// --- Auth Logic (Firebase) ---

function handleGoogleLogin() {
    console.log("Attempting Google Login...");
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            console.log("Logged in:", result.user);
            document.getElementById('auth-overlay').classList.remove('open');
            showToast(`Welcome back, ${result.user.displayName} Pookie! 🍪`);
        })
        .catch((error) => {
            console.error("Login Error:", error);

            let msg = "Login Failed: " + error.message;
            if (error.code === 'auth/operation-not-allowed') {
                msg = "Login Failed: Google Sign-In is not enabled in Firebase Console.";
            } else if (error.code === 'auth/unauthorized-domain') {
                msg = "Login Failed: Domain not authorized in Firebase Console.";
            } else if (window.location.protocol === 'file:') {
                msg = "Login Failed: Cannot run from file://. Use a local server.";
            }

            showToast(msg);
        });
}

function handleLogin() {
    showToast("Please use 'Sign in with Google' for now.");
}

function handleSignup() {
    showToast("Please use 'Sign in with Google' for now.");
}

function handleLogout() {
    auth.signOut().then(() => {
        showToast("Signed out successfully. See you soon Pookie!");
    });
}

function setupAuthListeners() {
    auth.onAuthStateChanged((user) => {
        const navLinks = document.querySelector('.nav-links');
        const loginBtn = document.getElementById('login-nav-btn');
        const existingProfile = document.querySelector('.user-profile');

        if (user) {
            // User is signed in
            if (loginBtn) loginBtn.style.display = 'none';
            if (existingProfile) existingProfile.remove(); // Clean up

            const profileHtml = `
                <div class="user-profile-container">
                    <div class="user-profile" onclick="toggleProfileMenu()">
                        <img src="${user.photoURL}" alt="Profile" class="user-avatar">
                        <span class="user-name">Hi Pookie <i data-lucide="chevron-down" style="width: 14px; margin-left: 4px;"></i></span>
                    </div>
                    
                    <div class="profile-dropdown" id="profile-dropdown">
                        <div class="dropdown-header">
                            <p>Welcome, <strong>${user.displayName.split(' ')[0]} Pookie!</strong> 🍪</p>
                        </div>
                        <button class="dropdown-item" onclick="handleLogout()">
                            Sign Out
                        </button>
                    </div>
                </div>
            `;
            navLinks.insertAdjacentHTML('beforeend', profileHtml);
            lucide.createIcons(); // Re-render icons for chevron
        } else {
            // User is signed out
            if (loginBtn) loginBtn.style.display = 'block';
            if (existingProfile) document.querySelector('.user-profile-container')?.remove();
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const container = document.querySelector('.user-profile-container');
        if (container && !container.contains(e.target)) {
            document.getElementById('profile-dropdown')?.classList.remove('active');
        }
    });
}

function toggleProfileMenu() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.toggle('active');
}

// Toast Notification System
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 4000);
}

// --- End Auth Logic ---

// Custom Cursor
function setupCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Event Delegation for Hover Effects (Works on dynamic elements too)
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .product-card, input, .user-profile, .dropdown-item, .click-trigger')) {
            cursor.classList.add('hover');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest('a, button, .product-card, input, .user-profile, .dropdown-item, .click-trigger')) {
            cursor.classList.remove('hover');
        }
    });
}

// Render Products
function renderProducts(filter) {
    const grid = document.getElementById('product-grid');
    const filtered = filter === 'all'
        ? products
        : products.filter(p => p.category === filter);

    grid.innerHTML = filtered.map(product => `
        <div class="product-card fade-in-up">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">₹${product.price.toFixed(0)}</p>
                <button class="btn btn-add" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Cart Logic
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    openCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    // Update Count
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalCount;

    // Update Items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
        cartTotalEl.textContent = '₹0';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; align-items: center;">
            <img src="${item.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
            <div style="flex: 1;">
                <h4 style="font-size: 1rem; color: var(--color-text-main); margin-bottom: 0.2rem;">${item.name}</h4>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button onclick="updateQuantity(${item.id}, -1)" style="background: rgba(255,255,255,0.1); border: none; color: white; width: 24px; height: 24px; border-radius: 4px; cursor: pointer;">-</button>
                    <span style="color: var(--color-gold); font-weight: bold;">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" style="background: rgba(255,255,255,0.1); border: none; color: white; width: 24px; height: 24px; border-radius: 4px; cursor: pointer;">+</button>
                    <span style="color: var(--color-text-muted); font-size: 0.9rem; margin-left: 0.5rem;">x ₹${item.price.toFixed(0)}</span>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: var(--color-accent); cursor: pointer; text-transform: uppercase; font-size: 0.8rem; font-weight: bold; letter-spacing: 1px;">
                <i data-lucide="trash-2" style="width: 18px;"></i>
            </button>
        </div>
    `).join('');
    lucide.createIcons(); // For trash icon

    // Update Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalEl.textContent = '₹' + total.toFixed(0);
}

function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
}

function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
}

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.switchAuth = switchAuth;
window.handleGoogleLogin = handleGoogleLogin;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleLogout = handleLogout;
// Checkout Logic
function checkout() {
    if (cart.length === 0) {
        showToast("Your cart is empty Pookie! Add some cookies first. 🍪");
        return;
    }

    let message = "Hi Pookie Cookie! 🍪\nI'd like to place an order:\n\n";
    let total = 0;

    cart.forEach(item => {
        message += `- ${item.name} x${item.quantity} (₹${item.price * item.quantity})\n`;
        total += item.price * item.quantity;
    });

    message += `\n*Total Order Value: ₹${total}*`;
    message += "\n\nPlease confirm my order!";

    // Encode for URL
    const encodedMessage = encodeURIComponent(message);

    // Replace this with your actual business phone number
    const phoneNumber = "919876543210";

    // Open WhatsApp
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

// Attach checkout listener
document.addEventListener('DOMContentLoaded', () => {
    // ... existing init ...
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
});
