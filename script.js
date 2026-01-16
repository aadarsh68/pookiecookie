// Product Data
const products = [
    {
        id: 1,
        name: "Chocho Almond Nankhatai",
        price: 190,
        category: "nutty",
        description: "Rich chocolate nankhatai topped with crunchy almonds.",
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=800",
        rating: 4.8,
        ingredients: ["Whole Wheat Flour", "Pure Desi Ghee", "Cocoa Powder", "Roasted Almonds", "Sugar", "Cardamom"]
    },
    {
        id: 2,
        name: "Sprinkler Cookie",
        price: 150,
        category: "classic",
        description: "Fun and festive cookies covered in rainbow sprinkles.",
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800",
        rating: 4.5,
        ingredients: ["Refined Flour", "Butter", "Sugar", "Vanilla Extract", "Rainbow Sprinkles", "Milk Solids"]
    },
    {
        id: 3,
        name: "Pista Cookie",
        price: 150,
        category: "nutty",
        description: "Buttery cookies loaded with premium pistachios.",
        image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc3605d?auto=format&fit=crop&q=80&w=800",
        rating: 4.9,
        ingredients: ["Refined Flour", "Butter", "Sugar", "Iranian Pistachios", "Saffron", "Rose Water"]
    },
    {
        id: 4,
        name: "Choco Chip",
        price: 170,
        category: "classic",
        description: "Classic golden cookies packed with chocolate chips.",
        image: "https://images.unsplash.com/photo-1605807646983-377bc5a76493?auto=format&fit=crop&q=80&w=800",
        rating: 4.7,
        ingredients: ["Refined Flour", "Brown Sugar", "Butter", "Dark Chocolate Chips", "Vanilla Extract", "Sea Salt"]
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
    // 1. Pre-loader Logic
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => preloader.style.display = 'none', 1200);
            initScrollReveal();
        }, 1000); // Minimum load time for branding
    });

    // Only verify icons if lucide is available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    renderProducts('all');
    setupEventListeners();
    setupCursor();
    setupAuthListeners(); // Initialize Auth Listeners
    setupIngredientsModal(); // Ingredients Modal

    // Checkout listener (redirect to delivery page)
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            window.location.href = "delivery.html";
    });
}


function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section, .testimonial-card, .product-card, .section-title, .reveal').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

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

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle Icon
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Review Modal
    setupReviewModal();

    // Address Modal
    setupAddressModal();

    // Infinite Testimonials Scroll
    duplicateTestimonials();
}

function duplicateTestimonials() {
    const grid = document.querySelector('.testimonials-grid');
    if (grid) {
        const items = grid.innerHTML;
        grid.innerHTML = items + items; // Double for perfect loop at -50%
    }
}

function setupReviewModal() {
    const btn = document.getElementById('write-review-btn');
    const overlay = document.getElementById('review-overlay');
    const closeBtn = document.getElementById('close-review');

    if (btn) {
        btn.addEventListener('click', () => {
            overlay.classList.add('open');
            vibrate(10);
            if (window.lucide) lucide.createIcons(); // Ensure icons in modal are rendered
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('open');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('open');
        });
    }
}

function setupAddressModal() {
    const overlay = document.getElementById('address-overlay');
    const closeBtn = document.getElementById('close-address');
    const form = document.getElementById('address-form');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('open');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('open');
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const address = document.getElementById('delivery-address').value;
            finalizeCheckout(address);
        });
    }
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

        // Subtle magnetic effect/lag for trail (handled by transition in CSS)
    });

    // Event Delegation for Hover Effects
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, .product-card, input, .user-profile, .dropdown-item, .ingredients-link');
        if (target) {
            cursor.classList.add('hover');

            // Dynamic Cursor Text
            if (target.classList.contains('btn-add')) {
                cursor.textContent = 'ADD';
                cursor.style.fontSize = '12px';
            } else if (target.classList.contains('ingredients-link')) {
                cursor.textContent = 'INFO';
                cursor.style.fontSize = '12px';
            } else if (target.closest('.product-card')) {
                cursor.textContent = 'VIEW';
                cursor.style.fontSize = '12px';
            } else {
                cursor.textContent = '';
            }
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('a, button, .product-card, input, .user-profile, .dropdown-item, .ingredients-link');
        if (target) {
            cursor.classList.remove('hover');
            cursor.textContent = '';
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
                <div class="product-rating">
                   ${getStars(product.rating)} <span>(${product.rating})</span>
                </div>
                <h3 class="product-title">${product.name}</h3>
                <span class="ingredients-link" onclick="openIngredients(${product.id})">View Ingredients</span>
                <p class="product-price">₹${product.price.toFixed(0)}</p>
                <button class="btn btn-add" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');

    // Re-create icons if any new ones were added (like stars if we used icons, but here we used text/svg)
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function getStars(rating) {
    // Simple star generation
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < fullStars; i++) stars += '<i data-lucide="star" fill="currentColor" size="14"></i>';
    // if (hasHalf) stars += '½'; // Lucide doesn't have half star easily, skipping for simplicity or just filling
    return stars;
}

// Ingredients Modal Logic
function openIngredients(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const modalTitle = document.getElementById('modal-product-title');
    const modalList = document.getElementById('modal-ingredients-list');
    const overlay = document.getElementById('ingredients-overlay');

    modalTitle.textContent = product.name;
    modalList.innerHTML = product.ingredients.map(ing => `<div style="margin-bottom: 0.5rem;">• ${ing}</div>`).join('');

    overlay.classList.add('open');
}

function setupIngredientsModal() {
    const overlay = document.getElementById('ingredients-overlay');
    const closeBtn = document.getElementById('close-ingredients');

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('open');
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('open');
        }
    });
}
window.openIngredients = openIngredients; // Global for onclick

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
    flyToCart(id);
    vibrate(15); // Stronger haptic for adding item
}

function flyToCart(id) {
    const productCard = document.querySelector(`[onclick="addToCart(${id})"]`).closest('.product-card');
    if (!productCard) return;

    const img = productCard.querySelector('img');
    const cartBtn = document.getElementById('cart-btn');

    const clone = img.cloneNode(true);
    const rect = img.getBoundingClientRect();
    const cartRect = cartBtn.getBoundingClientRect();

    clone.classList.add('flying-cookie');
    clone.style.position = 'fixed';
    clone.style.top = rect.top + 'px';
    clone.style.left = rect.left + 'px';
    clone.style.width = rect.width + 'px';
    clone.style.height = rect.height + 'px';
    clone.style.zIndex = '10001';
    clone.style.borderRadius = '50%';
    clone.style.pointerEvents = 'none';
    clone.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)';

    document.body.appendChild(clone);

    setTimeout(() => {
        clone.style.top = cartRect.top + 'px';
        clone.style.left = cartRect.left + 'px';
        clone.style.width = '20px';
        clone.style.height = '20px';
        clone.style.opacity = '0.5';
        clone.style.transform = 'scale(0.5) rotate(720deg)';
    }, 10);

    setTimeout(() => {
        clone.remove();
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
    }, 810);
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

    // Calculate Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalEl.textContent = '₹' + total.toFixed(0);

    // Free Shipping Progress
    const shippingThreshold = 399;
    const progressContainer = document.getElementById('shipping-progress-container');
    const progressBar = document.getElementById('shipping-bar');
    const shippingText = document.getElementById('shipping-text');

    if (cart.length > 0) {
        progressContainer.style.display = 'block';
        const percentage = Math.min((total / shippingThreshold) * 100, 100);
        progressBar.style.width = percentage + '%';

        if (total >= shippingThreshold) {
            shippingText.innerHTML = '🎉 <b>Free Shipping Unlocked!</b>';
            shippingText.style.color = '#4CAF50'; // Green
        } else {
            const remaining = shippingThreshold - total;
            shippingText.innerHTML = `Add <b>₹${remaining.toFixed(0)}</b> for Free Shipping`;
            shippingText.style.color = 'var(--color-text-main)';
        }
    } else {
        progressContainer.style.display = 'none';
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
        return;
    }

    // Update Items
    cartItemsContainer.innerHTML = '';
    // Re-append progress container (since we clear innerHTML, we need to manage structure or just append items after)
    // Actually, in index.html, shipping-progress-container is INSIDE cart-items. 
    // So clearing cartItemsContainer wipes it.
    // Let's fix that structure in JS:

    cartItemsContainer.appendChild(progressContainer); // Keep it at top

    const itemsHtml = cart.map(item => `
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

    const itemsWrapper = document.createElement('div');
    itemsWrapper.innerHTML = itemsHtml;
    cartItemsContainer.appendChild(itemsWrapper);


    lucide.createIcons(); // For trash icon

    // Sticky Bar Logic
    updateStickyBar(total, totalCount);
}

function updateStickyBar(total, count) {
    const bar = document.getElementById('sticky-checkout-bar');
    if (!bar) return;

    if (count > 0) {
        bar.classList.add('visible');
        bar.querySelector('.sticky-items').textContent = `${count} item${count > 1 ? 's' : ''}`;
        bar.querySelector('.sticky-total').textContent = `₹${total.toFixed(0)}`;
    } else {
        bar.classList.remove('visible');
    }
}

function openCart() {
    vibrate(10); // Haptic
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
// function checkout() {
//     if (cart.length === 0) {
//         showToast("Your cart is empty Pookie! Add some cookies first. 🍪");
//         return;
//     }
//
//     const overlay = document.getElementById('address-overlay');
//     if (overlay) {
//         overlay.classList.add('open');
//         vibrate(10);
//         if (window.lucide) lucide.createIcons();
//     }
// }

// function finalizeCheckout(address) {
//     let message = "Hi Pookie Cookie! 🍪\nI'd like to place an order:\n\n";
//     let total = 0;

//     cart.forEach(item => {
//         message += `- ${item.name} x${item.quantity} (₹${item.price * item.quantity})\n`;
//         total += item.price * item.quantity;
//     });

//     const shippingThreshold = 399;
//     let shippingStatus = "Shipping Charges Apply";
//     if (total >= shippingThreshold) {
//         shippingStatus = "Free Shipping Applied 🎉";
//     }

//     message += `\n*Total Order Value: ₹${total}*`;
//     message += `\n(${shippingStatus})`;
//     message += `\n\n📍 *Delivery Address:* \n${address}`;
//     message += "\n\nPlease confirm my order!";

//     // Encode for URL
//     const encodedMessage = encodeURIComponent(message);

//     // Phone Numbers
//     const phone1 = "918260636417";
//     const phone2 = "919871162218";

//     // Close Address Modal
//     document.getElementById('address-overlay').classList.remove('open');

//     // Open WhatsApp for First Number
//     window.open(`https://wa.me/${phone1}?text=${encodedMessage}`, '_blank');

//     // Prompt for Second Number
//     setTimeout(() => {
//         if (confirm("Would you like to send the order confirmation to the second number as well?")) {
//             window.open(`https://wa.me/${phone2}?text=${encodedMessage}`, '_blank');
//         }
//     }, 1000);
// }

// Haptic Feedback Utility
function vibrate(ms) {
    if (navigator.vibrate) {
        navigator.vibrate(ms);
    }
}



