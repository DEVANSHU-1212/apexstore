import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class CatalogPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly categoryFilterBtns: Locator;
  readonly sortSelect: Locator;
  readonly productCards: Locator;
  readonly productTitles: Locator;
  readonly productPrices: Locator;
  readonly cartNavButton: Locator;
  readonly cartCountBadge: Locator;
  readonly noProductsMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('[data-testid="search-input"], #searchInput, input[placeholder*="Search"]');
    this.searchButton = page.locator('[data-testid="search-btn"], #searchBtn');
    this.categoryFilterBtns = page.locator('[data-testid="category-filter"], .category-tab, .filter-chip');
    this.sortSelect = page.locator('[data-testid="sort-select"], #sortSelect, select[name="sort"]');
    this.productCards = page.locator('[data-testid="product-card"], .product-card');
    this.productTitles = page.locator('[data-testid="product-title"], .product-title, h3.prod-name');
    this.productPrices = page.locator('[data-testid="product-price"], .product-price, .price-tag');
    this.cartNavButton = page.locator('[data-testid="nav-cart-btn"], #navCartBtn, a[href="#cart"]');
    this.cartCountBadge = page.locator('[data-testid="cart-badge"], .cart-badge-count, #cartCount');
    this.noProductsMessage = page.locator('[data-testid="no-products-msg"], .no-products-alert');
  }

  async navigate(): Promise<void> {
    await this.navigateTo('/#catalog');
  }

  async searchProduct(keyword: string): Promise<void> {
    Logger.step('CATALOG', `Searching for product with keyword: "${keyword}"`);
    await this.safeFill(this.searchInput, keyword, 'Search input');
    if (await this.searchButton.isVisible()) {
      await this.safeClick(this.searchButton, 'Search button');
    } else {
      await this.searchInput.press('Enter');
    }
    await this.page.waitForTimeout(300);
  }

  async selectCategory(category: string): Promise<void> {
    Logger.step('CATALOG', `Selecting category filter: ${category}`);
    const categoryBtn = this.page.locator(`[data-category="${category}"], button:has-text("${category}")`).first();
    await this.safeClick(categoryBtn, `Category ${category}`);
    await this.page.waitForTimeout(300);
  }

  async sortBy(sortOption: string): Promise<void> {
    Logger.step('CATALOG', `Sorting catalog by: ${sortOption}`);
    await this.sortSelect.selectOption(sortOption);
    await this.page.waitForTimeout(300);
  }

  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  async getAllProductTitles(): Promise<string[]> {
    return await this.productTitles.allTextContents();
  }

  async getProductCardByName(productName: string): Promise<Locator> {
    return this.productCards.filter({ hasText: productName }).first();
  }

  async addProductToCartByName(productName: string): Promise<void> {
    Logger.step('CART', `Adding "${productName}" to shopping cart`);
    const card = await this.getProductCardByName(productName);
    const addToCartBtn = card.locator('[data-testid="add-to-cart-btn"], button:has-text("Add to Cart")');
    await this.safeClick(addToCartBtn, `Add to cart button for ${productName}`);
  }

  async openProductDetails(productName: string): Promise<void> {
    Logger.info(`Opening details page for: ${productName}`);
    const card = await this.getProductCardByName(productName);
    const titleLink = card.locator('[data-testid="product-title"], h3, img').first();
    await this.safeClick(titleLink, `Product card: ${productName}`);
  }

  async getCartCount(): Promise<number> {
    if (!(await this.cartCountBadge.isVisible())) return 0;
    const text = await this.cartCountBadge.textContent();
    return parseInt(text || '0', 10);
  }

  async openCart(): Promise<void> {
    Logger.info('Opening Shopping Cart view');
    await this.safeClick(this.cartNavButton, 'Navigation Cart Button');
  }
}
