const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Load seed data
const testData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/fixtures/test-data.json'), 'utf8'));
const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/fixtures/users.json'), 'utf8'));
const couponsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/fixtures/coupons.json'), 'utf8'));

let products = [...testData.products];
let orders = [];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// GET /api/products
app.get('/api/products', (req, res) => {
  const { search, category, sort } = req.query;
  let result = [...products];

  if (category && category !== 'All') {
    result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  if (sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating-desc') {
    result.sort((a, b) => b.rating - a.rating);
  }

  res.json({ success: true, count: result.length, data: result });
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

// POST /api/products (Admin create)
app.post('/api/products', (req, res) => {
  const { name, category, price, inStock } = req.body;
  if (!name || !price) {
    return res.status(400).json({ success: false, message: 'Name and price are required' });
  }
  const newProduct = {
    id: `prod-${Date.now()}`,
    name,
    category: category || 'General',
    price: parseFloat(price),
    rating: 5.0,
    inStock: inStock !== undefined ? inStock : true
  };
  products.push(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  if (email === usersData.adminUser.email && password === usersData.adminUser.password) {
    return res.json({
      success: true,
      token: 'jwt-admin-token-xyz',
      user: { name: usersData.adminUser.name, email: usersData.adminUser.email, role: 'admin' }
    });
  }

  const validUser = usersData.validUsers.find(u => u.email === email && u.password === password);
  if (validUser) {
    return res.json({
      success: true,
      token: 'jwt-customer-token-abc',
      user: { name: validUser.name, email: validUser.email, role: 'customer' }
    });
  }

  res.status(401).json({ success: false, message: 'Invalid email or password' });
});

// POST /api/coupons/validate
app.post('/api/coupons/validate', (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ valid: false, message: 'Coupon code is required' });
  }

  const coupon = couponsData.validCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
  if (coupon) {
    return res.json({
      valid: true,
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      message: `${coupon.discountPercent}% discount applied!`
    });
  }

  const invalid = couponsData.invalidCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
  if (invalid) {
    return res.status(400).json({ valid: false, message: invalid.expectedMessage });
  }

  res.status(404).json({ valid: false, message: 'Coupon code not found' });
});

// POST /api/orders
app.post('/api/orders', (req, res) => {
  const { customer, items, couponCode, paymentMethod } = req.body;
  if (!customer || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Customer and items are required' });
  }

  let subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  let discountPercent = 0;
  if (couponCode) {
    const coupon = couponsData.validCoupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    if (coupon) discountPercent = coupon.discountPercent;
  }
  const discount = Math.round(subtotal * (discountPercent / 100) * 100) / 100;
  const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
  const shipping = subtotal > 500 ? 0 : 15.00;
  const total = Math.round((subtotal - discount + tax + shipping) * 100) / 100;

  const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const newOrder = {
    orderId,
    createdAt: new Date().toISOString(),
    customer,
    items,
    subtotal,
    discount,
    tax,
    shipping,
    total,
    paymentMethod: paymentMethod || 'card',
    status: 'CONFIRMED'
  };

  orders.push(newOrder);
  res.status(201).json({ success: true, order: newOrder });
});

// GET /api/orders/:id
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.orderId === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }
  res.json({ success: true, order });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 ApexStore Mock E-Commerce Application is running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already running, tests can proceed.`);
  } else {
    console.error('Server error', err);
  }
});
