// State Management
let products = [];
let cart = [];
let appliedCoupon = null;
let currentProduct = null;
let currentUser = null;
let currentCategory = 'All';

// Icons for categories/products
const categoryIcons = {
  Audio: '🎧',
  Wearables: '⌚',
  Computers: '💻',
  Photography: '📷',
  Furniture: '🪑',
  Accessories: '⌨️',
  General: '📦'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  await fetchProducts();
  loadCartFromStorage();
  loadUserFromStorage();
  handleHashNavigation();
  window.addEventListener('hashchange', handleHashNavigation);

  // Search input enter listener
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') triggerSearch();
    });
  }
});

// Hash Routing
function handleHashNavigation() {
  const hash = window.location.hash.replace('#', '') || 'catalog';
  const parts = hash.split('/');
  const route = parts[0];

  if (route === 'product' && parts[1]) {
    showProductDetails(parts[1]);
  } else {
    navigateTo(route, false);
  }
}

function navigateTo(viewId, updateHash = true) {
  const views = ['catalog', 'pdp', 'cart', 'checkout', 'confirmation', 'login'];
  views.forEach(v => {
    const el = document.getElementById(`${v}View`);
    if (el) el.classList.remove('active', 'hidden');
    if (el && v !== viewId) el.classList.add('hidden');
    if (el && v === viewId) el.classList.add('active');
  });

  if (updateHash) {
    window.location.hash = viewId;
  }

  if (viewId === 'cart') renderCart();
  if (viewId === 'checkout') renderCheckoutPreview();
}

// Fetch Products from Mock Server
async function fetchProducts(search = '', category = 'All', sort = 'featured') {
  try {
    let url = `/api/products?sort=${sort}`;
    if (category !== 'All') url += `&category=${encodeURIComponent(category)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const res = await fetch(url);
    const data = await res.json();
    products = data.data || [];
    renderProductGrid(products);
  } catch (err) {
    console.error('Failed to load products from API, falling back', err);
  }
}

// Render Products Grid
function renderProductGrid(items) {
  const grid = document.getElementById('productGrid');
  const alertEl = document.getElementById('noProductsAlert');

  if (!grid) return;
  grid.innerHTML = '';

  if (items.length === 0) {
    if (alertEl) alertEl.classList.remove('hidden');
    return;
  }
  if (alertEl) alertEl.classList.add('hidden');

  items.forEach(product => {
    const icon = categoryIcons[product.category] || '📦';
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-testid', 'product-card');
    card.innerHTML = `
      <div class="card-img-placeholder" onclick="openPdp('${product.id}')">${icon}</div>
      <span class="card-category">${product.category}</span>
      <h3 class="product-title" data-testid="product-title" onclick="openPdp('${product.id}')">${product.name}</h3>
      <div class="card-rating">⭐ ${product.rating || '4.8'} / 5.0</div>
      <div class="card-footer">
        <span class="product-price" data-testid="product-price">$${product.price.toFixed(2)}</span>
        <button class="btn btn-primary" data-testid="add-to-cart-btn" onclick="addToCart('${product.id}')">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Category and Search Filtering
function filterCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll('.category-tab').forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-category') === cat);
  });
  const search = document.getElementById('searchInput').value;
  const sort = document.getElementById('sortSelect').value;
  fetchProducts(search, currentCategory, sort);
}

function triggerSearch() {
  const search = document.getElementById('searchInput').value;
  const sort = document.getElementById('sortSelect').value;
  fetchProducts(search, currentCategory, sort);
}

function handleSort(sortVal) {
  const search = document.getElementById('searchInput').value;
  fetchProducts(search, currentCategory, sortVal);
}

// Product Details (PDP)
function openPdp(productId) {
  window.location.hash = `product/${productId}`;
}

async function showProductDetails(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) {
    try {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      currentProduct = data.data;
    } catch (e) {
      navigateTo('catalog');
      return;
    }
  } else {
    currentProduct = product;
  }

  if (!currentProduct) return;

  document.getElementById('pdpTitle').textContent = currentProduct.name;
  document.getElementById('pdpCategory').textContent = currentProduct.category;
  document.getElementById('pdpPrice').textContent = `$${currentProduct.price.toFixed(2)}`;
  document.getElementById('pdpDescription').textContent = `${currentProduct.name} features state-of-the-art technology, industry-leading performance, premium build quality, and comes with a 2-year full manufacturer warranty.`;
  document.getElementById('pdpImage').textContent = categoryIcons[currentProduct.category] || '📦';
  document.getElementById('pdpQuantity').value = 1;

  navigateTo('pdp', false);
}

function adjustPdpQty(delta) {
  const input = document.getElementById('pdpQuantity');
  let val = parseInt(input.value) + delta;
  if (val < 1) val = 1;
  if (val > 10) val = 10;
  input.value = val;
}

function addCurrentPdpToCart() {
  if (!currentProduct) return;
  const qty = parseInt(document.getElementById('pdpQuantity').value) || 1;
  addToCart(currentProduct.id, qty);
}

function buyNowPdp() {
  addCurrentPdpToCart();
  navigateTo('checkout');
}

// Cart Functionality
function addToCart(productId, quantity = 1) {
  const product = products.find(p => p.id === productId) || currentProduct;
  if (!product) return;

  const existingIndex = cart.findIndex(item => item.id === productId);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity
    });
  }

  saveCartToStorage();
  updateCartBadge();
  showToast(`✔ Added "${product.name}" to cart!`);
}

function updateCartBadge() {
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = totalCount.toString();
}

function renderCart() {
  const container = document.getElementById('cartItemsList');
  const emptyAlert = document.getElementById('emptyCartAlert');
  const summaryPanel = document.getElementById('cartSummaryPanel');

  if (!container) return;
  container.innerHTML = '';

  if (cart.length === 0) {
    if (emptyAlert) emptyAlert.classList.remove('hidden');
    if (summaryPanel) summaryPanel.classList.add('hidden');
    return;
  }

  if (emptyAlert) emptyAlert.classList.add('hidden');
  if (summaryPanel) summaryPanel.classList.remove('hidden');

  cart.forEach((item, index) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.setAttribute('data-testid', 'cart-item');
    itemEl.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-unit-price">$${item.price.toFixed(2)} each</div>
      </div>
      <div class="cart-item-actions">
        <input type="number" class="cart-qty" data-testid="item-qty-input" value="${item.quantity}" min="1" max="20" onchange="updateItemQty(${index}, this.value)" />
        <span class="cart-item-total-price"><strong>$${(item.price * item.quantity).toFixed(2)}</strong></span>
        <button class="remove-item-btn" data-testid="remove-item-btn" onclick="removeFromCart(${index})">🗑</button>
      </div>
    `;
    container.appendChild(itemEl);
  });

  recalculateTotals();
}

function updateItemQty(index, qty) {
  const val = parseInt(qty);
  if (val <= 0) {
    removeFromCart(index);
    return;
  }
  cart[index].quantity = val;
  saveCartToStorage();
  updateCartBadge();
  renderCart();
}

function removeFromCart(index) {
  const item = cart[index];
  cart.splice(index, 1);
  saveCartToStorage();
  updateCartBadge();
  renderCart();
  showToast(`Removed "${item.name}" from cart`);
}

function recalculateTotals() {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  let discount = 0;
  if (appliedCoupon) {
    discount = (subtotal * appliedCoupon.discountPercent) / 100;
  }
  const tax = (subtotal - discount) * 0.08;
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 15.00;
  const grandTotal = Math.max(0, subtotal - discount + tax + shipping);

  document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('cartDiscount').textContent = `-$${discount.toFixed(2)}`;
  document.getElementById('cartShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
  document.getElementById('cartTax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('cartGrandTotal').textContent = `$${grandTotal.toFixed(2)}`;

  return { subtotal, discount, tax, shipping, grandTotal };
}

// Coupon Handling
async function applyCouponCode() {
  const input = document.getElementById('couponInput');
  const feedback = document.getElementById('couponFeedback');
  const code = input.value.trim();

  if (!code) {
    feedback.className = 'coupon-feedback error';
    feedback.textContent = 'Please enter a promo code';
    return;
  }

  try {
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    const result = await res.json();

    if (result.valid) {
      appliedCoupon = result;
      feedback.className = 'coupon-feedback success';
      feedback.textContent = result.message;
      recalculateTotals();
      showToast(`🎉 Coupon ${code} applied successfully!`);
    } else {
      appliedCoupon = null;
      feedback.className = 'coupon-feedback error';
      feedback.textContent = result.message || 'Invalid coupon code';
      recalculateTotals();
    }
  } catch (e) {
    feedback.className = 'coupon-feedback error';
    feedback.textContent = 'Failed to validate coupon';
  }
}

// Checkout and Order Handling
function renderCheckoutPreview() {
  const preview = document.getElementById('checkoutItemsPreview');
  const totalEl = document.getElementById('checkoutOrderTotal');
  if (!preview) return;

  preview.innerHTML = '';
  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'summary-line';
    row.innerHTML = `
      <span>${item.name} (x${item.quantity})</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    `;
    preview.appendChild(row);
  });

  const totals = recalculateTotals();
  totalEl.textContent = `$${totals.grandTotal.toFixed(2)}`;
}

function togglePaymentInputs() {
  const cardSelected = document.getElementById('payMethodCard').checked;
  const cardFields = document.getElementById('cardFields');
  if (cardFields) {
    cardFields.style.display = cardSelected ? 'grid' : 'none';
  }
}

async function handlePlaceOrder(event) {
  event.preventDefault();
  const form = document.getElementById('checkoutForm');
  const errorEl = document.getElementById('checkoutFormError');

  if (cart.length === 0) {
    errorEl.textContent = 'Your cart is empty. Add items before placing an order.';
    errorEl.classList.remove('hidden');
    return;
  }

  const formData = new FormData(form);
  const customer = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    city: formData.get('city'),
    state: formData.get('state'),
    zipCode: formData.get('zipCode'),
    country: formData.get('country')
  };

  const paymentMethod = formData.get('payMethod') || 'card';

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer,
        items: cart.map(i => ({ productId: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        couponCode: appliedCoupon ? appliedCoupon.code : null,
        paymentMethod
      })
    });

    const data = await res.json();
    if (data.success) {
      // Clear Cart
      cart = [];
      appliedCoupon = null;
      saveCartToStorage();
      updateCartBadge();

      // Populate Confirmation View
      document.getElementById('confirmedOrderId').textContent = data.order.orderId;
      document.getElementById('confirmCustomerName').textContent = `${customer.firstName} ${customer.lastName}`;
      document.getElementById('confirmCustomerEmail').textContent = customer.email;
      document.getElementById('confirmShippingAddress').textContent = `${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`;
      document.getElementById('confirmOrderTotal').textContent = `$${data.order.total.toFixed(2)}`;

      navigateTo('confirmation');
      showToast('🎉 Order placed successfully!');
    } else {
      errorEl.textContent = data.message || 'Error processing order';
      errorEl.classList.remove('hidden');
    }
  } catch (e) {
    errorEl.textContent = 'Server error during checkout';
    errorEl.classList.remove('hidden');
  }
}

// Authentication
async function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginErrorMessage');

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.success) {
      currentUser = data.user;
      localStorage.setItem('apex_user', JSON.stringify(currentUser));
      errorEl.classList.add('hidden');
      updateUserUI();
      showToast(`Welcome back, ${currentUser.name}!`);
      navigateTo('catalog');
    } else {
      errorEl.textContent = data.message || 'Invalid credentials';
      errorEl.classList.remove('hidden');
    }
  } catch (e) {
    errorEl.textContent = 'Authentication network error';
    errorEl.classList.remove('hidden');
  }
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem('apex_user');
  updateUserUI();
  showToast('Logged out successfully');
  navigateTo('catalog');
}

function updateUserUI() {
  const profileBadge = document.getElementById('userProfile');
  const loginNavBtn = document.getElementById('navLoginBtn');
  const greeting = document.getElementById('userProfileName');

  if (currentUser) {
    if (profileBadge) profileBadge.classList.remove('hidden');
    if (loginNavBtn) loginNavBtn.classList.add('hidden');
    if (greeting) greeting.textContent = currentUser.name;
  } else {
    if (profileBadge) profileBadge.classList.add('hidden');
    if (loginNavBtn) loginNavBtn.classList.remove('hidden');
  }
}

// Local Storage helpers
function saveCartToStorage() {
  localStorage.setItem('apex_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
  const stored = localStorage.getItem('apex_cart');
  if (stored) {
    try { cart = JSON.parse(stored); } catch (e) { cart = []; }
  }
  updateCartBadge();
}

function loadUserFromStorage() {
  const stored = localStorage.getItem('apex_user');
  if (stored) {
    try { currentUser = JSON.parse(stored); } catch (e) { currentUser = null; }
  }
  updateUserUI();
}

// Toast Notification
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}
