import { test, expect } from '../../src/fixtures/testBase';
import { Logger } from '../../src/utils/logger';

test.describe('Smoke Test Suite - E-Commerce Health Sanity', () => {
  test.beforeEach(async ({ catalogPage }) => {
    await catalogPage.navigate();
  });

  test('SMOKE-01: Storefront loads with valid title and header elements', async ({ catalogPage }) => {
    Logger.info('Verifying homepage storefront availability');
    const title = await catalogPage.getPageTitle();
    expect(title).toContain('ApexStore');
    await expect(catalogPage.pageHeader).toBeVisible();
  });

  test('SMOKE-02: Product catalog displays initial item list', async ({ catalogPage }) => {
    const productCount = await catalogPage.getProductCount();
    Logger.info(`Found ${productCount} active products on storefront`);
    expect(productCount).toBeGreaterThan(0);
  });

  test('SMOKE-03: Shopping cart icon is interactive and visible', async ({ catalogPage }) => {
    await expect(catalogPage.cartNavButton).toBeVisible();
    const count = await catalogPage.getCartCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
