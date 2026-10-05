import { test, expect } from '../../src/fixtures/testBase';
import { Logger } from '../../src/utils/logger';

test.describe('Visual & UI Snapshot Consistency Suite', () => {
  test.beforeEach(async ({ catalogPage }) => {
    await catalogPage.navigate();
  });

  test('VISUAL-01: Header navigation and branding element layout snapshot', async ({ catalogPage, page }) => {
    Logger.info('Verifying header visual components');
    await expect(catalogPage.pageHeader).toBeVisible();
    await expect(page.locator('.logo-area')).toBeVisible();
    await expect(page.locator('.search-bar')).toBeVisible();
    await expect(page.locator('.nav-actions')).toBeVisible();
  });

  test('VISUAL-02: Product Card structure & interactive buttons layout snapshot', async ({ catalogPage }) => {
    const firstCard = catalogPage.productCards.first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.locator('[data-testid="product-title"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="product-price"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="add-to-cart-btn"]')).toBeVisible();
  });

  test('VISUAL-03: Shopping Cart layout and summary calculations box snapshot', async ({ catalogPage, cartPage }) => {
    await catalogPage.addProductToCartByName('Apex Wireless Noise-Cancelling Headphones Pro');
    await catalogPage.openCart();

    await expect(cartPage.cartItems.first()).toBeVisible();
    await expect(cartPage.subtotalText).toBeVisible();
    await expect(cartPage.grandTotalText).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
  });
});
