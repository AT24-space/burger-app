// Cart state
let cart = [];
let selectedRestaurant = '';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Initialize category buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterMenuItems(button.dataset.category);
        });
    });

    // Initialize add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.menu-item');
            addToCart(menuItem);
        });
    });

    // Initialize restaurant select
    const restaurantSelect = document.querySelector('#restaurant-select');
    if (restaurantSelect) {
        restaurantSelect.addEventListener('change', (e) => {
            selectedRestaurant = e.target.value;
            showToast('Restaurant selected: ' + selectedRestaurant, 'success');
        });
    }

    // Initialize quantity controls
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('qty-btn')) {
            const itemId = e.target.closest('.cart-item').dataset.id;
            const action = e.target.dataset.action;
            updateQuantity(itemId, action);
        }
    });

    // Initialize cart actions
    const submitOrderBtn = document.querySelector('.submit-order');
    if (submitOrderBtn) {
        submitOrderBtn.addEventListener('click', submitOrder);
    }

    const backToMenuBtn = document.querySelector('.back-to-menu');
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', () => {
            document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// Filter menu items by category
function filterMenuItems(category) {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Add item to cart
function addToCart(menuItem) {
    if (!selectedRestaurant) {
        showToast('Please select a restaurant first!', 'error');
        return;
    }

    const itemId = menuItem.dataset.id;
    const itemName = menuItem.querySelector('h3').textContent;
    const itemPrice = parseFloat(menuItem.querySelector('.price').textContent.replace('$', ''));
    const itemImage = menuItem.querySelector('img').src;

    const existingItem = cart.find(item => item.id === itemId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: itemId,
            name: itemName,
            price: itemPrice,
            image: itemImage,
            quantity: 1
        });
    }

    updateCartUI();
    showToast('Item added to cart!', 'success');
}

// Update cart UI
function updateCartUI() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemHTML = `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="price">$${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="qty-btn" data-action="decrease">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn" data-action="increase">+</button>
                    </div>
                </div>
            </div>
        `;
        cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
    });

    // Update cart summary
    const subtotal = total;
    const tax = total * 0.1; // 10% tax
    const delivery = 5.00; // Fixed delivery fee
    const finalTotal = subtotal + tax + delivery;

    const summaryContainer = document.querySelector('.cart-summary');
    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <div class="subtotal">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="tax">
                <span>Tax (10%):</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="delivery">
                <span>Delivery Fee:</span>
                <span>$${delivery.toFixed(2)}</span>
            </div>
            <div class="total">
                <span>Total:</span>
                <span>$${finalTotal.toFixed(2)}</span>
            </div>
        `;
    }

    // Update cart badge
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Update item quantity in cart
function updateQuantity(itemId, action) {
    const cartItem = cart.find(item => item.id === itemId);
    if (!cartItem) return;

    if (action === 'increase') {
        cartItem.quantity++;
    } else if (action === 'decrease') {
        cartItem.quantity--;
        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.id !== itemId);
        }
    }

    updateCartUI();
}

// Submit order
function submitOrder() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }

    if (!selectedRestaurant) {
        showToast('Please select a restaurant!', 'error');
        return;
    }

    // Here you would typically send the order to a backend server
    const order = {
        restaurant: selectedRestaurant,
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    console.log('Order submitted:', order);
    showToast('Order submitted successfully!', 'success');

    // Clear cart
    cart = [];
    updateCartUI();
}

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger reflow
    toast.offsetHeight;

    // Show toast
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Loading animation
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}
