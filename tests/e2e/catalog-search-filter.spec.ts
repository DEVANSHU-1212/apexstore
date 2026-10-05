import { test, expect } from '../../src/fixtures/testBase';
import { Logger } from '../../src/utils/logger';

test.describe('Catalog Search, Filtering & Navigation Suite', () => {
  test.beforeEach(async ({ catalogPage }) => {
    await catalogPage.navigate();
  });

  test('CAT-01: User can search for products by keyword and view matching results', async ({ catalogPage }) => {
    const keyword = 'Headphones';
    Logger.step(1, `Searching for "${keyword}"`);
    await catalogPage.searchProduct(keyword);

    const titles = await catalogPage.getAllProductTitles();
    expect(titles.length).toBeGreaterThan(0);
    titles.forEach(title => {
      expect(title.toLowerCase()).toContain(keyword.toLowerCase());
    });
  });

  test('CAT-02: User can filter products by Category tab', async ({ catalogPage }) => {
    const category = 'Wearables';
    Logger.step(1, `Filtering by category "${category}"`);
    await catalogPage.selectCategory(category);

    const titles = await catalogPage.getAllProductTitles();
    expect(titles.length).toBeGreaterThan(0);
    expect(titles.some(t => t.includes('Watch') || t.includes('Wearables'))).toBeTruthy();
  });

  test('CAT-03: User can sort products by price ascending', async ({ catalogPage }) => {
    Logger.step(1, 'Sorting products by price: Low to High');
    await catalogPage.sortBy('price-asc');

    const pricesText = await catalogPage.productPrices.allTextContents();
    const numericPrices = pricesText.map(p => parseFloat(p.replace(/[^0-9.]/g, '')));
    
    for (let i = 0; i < numericPrices.length - 1; i++) {
      expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i + 1]);
    }
  });

  test('CAT-04: User can click a product to open the Product Details Page (PDP)', async ({ catalogPage, productDetailsPage }) => {
    const productName = 'Apex Wireless Noise-Cancelling Headphones Pro';
    Logger.step(1, `Opening PDP for ${productName}`);
    await catalogPage.openProductDetails(productName);

    await expect(productDetailsPage.title).toHaveText(productName);
    await expect(productDetailsPage.price).toBeVisible();
    await expect(productDetailsPage.addToCartBtn).toBeVisible();
    await expect(productDetailsPage.stockStatus).toBeVisible();
  });
});
