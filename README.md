# ⚡ Apex E-Commerce Test Automation Framework

An enterprise-grade, modern End-to-End (E2E) Test Automation Framework for E-Commerce web applications built with **Playwright**, **TypeScript**, **Page Object Model (POM)**, **REST API Testing**, **Data-Driven Testing (Faker.js)**, **Visual Regression**, and an **Interactive Test Dashboard Runner**.

---

## 🌟 Key Highlights & Architecture

- **Page Object Model (POM)**: Strictly encapsulated page locators, actions, and assertions for clean maintenance.
- **Dual Application Target**:
  1. **ApexStore Local Sandbox**: Instant offline testing, 0% flakiness, fully instrumented with `data-testid` selectors, mock REST APIs, dynamic cart calculations, coupon discount engine, and simulated checkout.
  2. **SauceDemo Benchmark**: External live benchmark (`https://www.saucedemo.com`) to demonstrate real-world e-commerce testing.
- **REST API Automation**: Built-in API client validating status codes, JSON response schemas, price calculations, and coupon redemption.
- **Data-Driven Testing (DDT)**: Integrated with `@faker-js/faker` for randomized customer profiles, addresses, phone numbers, and payment details.
- **Multi-Browser & Cross-Platform**: Chromium, Firefox, WebKit (Safari), Mobile Chrome (Pixel 7), and Mobile Safari (iPhone 14).
- **Interactive Web Dashboard**: Live web-based test control center with real-time log streaming, one-click execution triggers, and metrics display.
- **Rich HTML Reporting**: Step-by-step traces, video recordings on failure, full-page screenshots, and retry execution logs.
- **CI/CD Ready**: Pre-configured GitHub Actions workflow (`.github/workflows/playwright.yml`).

---

## 📁 Repository Structure

```text
ecommerce-automation-framework/
├── .github/workflows/
│   └── playwright.yml              # CI/CD automated pipeline
├── src/
│   ├── api/                        # API Services (Products, Orders, Auth)
│   │   ├── ApiClient.ts
│   │   ├── ProductApiService.ts
│   │   └── OrderApiService.ts
│   ├── config/                     # Environment configuration & credentials
│   │   └── environment.ts
│   ├── fixtures/                   # Test fixtures & test base
│   │   ├── testBase.ts             # Custom Playwright fixture injection
│   │   ├── users.json              # Auth credentials dataset
│   │   ├── coupons.json            # Discount codes dataset
│   │   └── test-data.json          # Seed catalog data
│   ├── pages/                      # Page Object Model (POM) Layer
│   │   ├── BasePage.ts             # Base actions, waits, screenshots
│   │   ├── LoginPage.ts            # Authentication & session state
│   │   ├── CatalogPage.ts          # Search, filters, sort, product cards
│   │   ├── ProductDetailsPage.ts   # Product quantity & PDP actions
│   │   ├── CartPage.ts             # Cart table, quantities, coupons, math
│   │   ├── CheckoutPage.ts         # Shipping forms & payment options
│   │   └── OrderConfirmationPage.ts# Receipt & order reference verification
│   └── utils/                      # Helper utilities
│       ├── dataGenerator.ts        # Faker.js randomized data generator
│       ├── helpers.ts              # Price parser & math calculations
│       └── logger.ts               # Terminal colored logging utility
├── tests/
│   ├── smoke/                      # Quick sanity health checks
│   │   └── smoke-suite.spec.ts
│   ├── e2e/                        # End-to-End User Journey tests
│   │   ├── auth.spec.ts
│   │   ├── catalog-search-filter.spec.ts
│   │   ├── cart-management.spec.ts
│   │   ├── checkout-order.spec.ts
│   │   ├── end2end-journey.spec.ts
│   │   └── saucedemo-live.spec.ts
│   ├── api/                        # REST API Integration tests
│   │   └── products-orders-api.spec.ts
│   └── visual/                     # Layout & Visual Snapshot tests
│       └── visual-regression.spec.ts
├── mock-store/                     # Embedded High-Performance E-Commerce App
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── server.js                   # Express server + Mock REST APIs
├── dashboard/                      # Interactive Test Runner Control Center
│   ├── index.html
│   ├── dashboard.css
│   ├── dashboard.js
│   └── server.js                   # Runner trigger & log streaming backend
├── playwright.config.ts            # Playwright multi-project runner configuration
├── tsconfig.json                   # TypeScript compiler configuration
├── package.json                    # Dependencies and run scripts
└── .env                            # Environment variables
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
npx playwright install chromium
```

### 2. Run Tests via CLI

| Command | Description |
| :--- | :--- |
| `npm test` | Run all automated test suites |
| `npm run test:smoke` | Run quick smoke sanity tests |
| `npm run test:e2e` | Run end-to-end customer journey tests |
| `npm run test:api` | Run REST API integration tests |
| `npm run test:visual` | Run visual component layout checks |
| `npm run test:headed` | Run tests in headed browser mode |
| `npm run test:ui` | Open Playwright Interactive UI Mode |
| `npm run report` | Open Playwright HTML Report |

---

## 📊 Interactive Web Dashboard

Launch the Visual Test Control Center:
```bash
npm run dashboard
```
Open **`http://localhost:8080`** in your browser to:
- Trigger test suites with one click (Smoke, E2E, API, SauceDemo, Full Suite).
- Stream live colored execution logs in real-time.
- View test architecture diagrams and the full coverage matrix.
- View the generated Playwright HTML report.

---

## 🛍 Launch Local E-Commerce Storefront

To inspect or interact with the demo store manually:
```bash
npm run mock-store
```
Open **`http://localhost:3000`** in your browser.

- **Test Customer Login**: `customer@apexstore.com` / `Password123!`
- **Test Admin Login**: `admin@apexstore.com` / `AdminPass456!`
- **Discount Promo Codes**: `SAVE10` (10% off), `FLASH20` (20% off), `WELCOME50` (50% off)

---

## 🧪 Test Coverage Matrix

| Test ID | Module | Type | Verification |
| :--- | :--- | :--- | :--- |
| **SMOKE-01-03** | Storefront | Smoke | Page load, catalog grid render, cart navigation |
| **AUTH-01-03** | Authentication | E2E | Valid sign in, invalid password error, user logout |
| **CAT-01-04** | Catalog | E2E | Keyword search, category filters, price sorting, PDP |
| **CART-01-05** | Cart | E2E | Add items, update quantities, delete items, coupons |
| **CHK-01-02** | Checkout | E2E | Credit Card, Cash on Delivery, Order ID verification |
| **E2E-01** | Journey | E2E | Full customer journey from login to confirmed receipt |
| **API-01-05** | REST API | API | Product schemas, coupon validation, order calculation |
| **SAUCE-01** | External | E2E | Live benchmark run on SauceDemo.com |
