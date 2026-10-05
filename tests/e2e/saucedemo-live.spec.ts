import { test, expect } from '@playwright/test';
import { ENV_CONFIG } from '../../src/config/environment';
import { Logger } from '../../src/utils/logger';

test.describe('External Live Benchmark - SauceDemo E-Commerce Store', () => {
  test('SAUCE-01: Login, add backpack to cart, and complete full checkout on SauceDemo', async ({ page }) => {
    Logger.info(`Navigating to external live demo site: ${ENV_CONFIG.sauceDemo.url}`);
    await page.goto(ENV_CONFIG.sauceDemo.url, { waitUntil: 'domcontentloaded' });

    // Login
    await page.fill('[data-test="username"]', ENV_CONFIG.sauceDemo.standardUser);
    await page.fill('[data-test="password"]', ENV_CONFIG.sauceDemo.password);
    await page.click('[data-test="login-button"]');

    // Verify inventory page
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');

    // Add item to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // Navigate to cart
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item .inventory_item_name')).toHaveText('Sauce Labs Backpack');

    // Checkout step 1
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '90210');
    await page.click('[data-test="continue"]');

    // Checkout step 2 & Finish
    await expect(page.locator('.summary_total_label')).toBeVisible();
    await page.click('[data-test="finish"]');

    // Order Confirmation
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    Logger.pass('SauceDemo E-Commerce test completed successfully!');
  });
});
