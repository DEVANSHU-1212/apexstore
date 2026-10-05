import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Logger } from '../utils/logger';

export class ProductDetailsPage extends BasePage {
  readonly title: Locator;
  readonly price: Locator;
  readonly description: Locator;
  readonly quantityInput: Locator;
  readonly increaseQtyBtn: Locator;
  readonly decreaseQtyBtn: Locator;
  readonly addToCartBtn: Locator;
  readonly buyNowBtn: Locator;
  readonly categoryTag: Locator;
  readonly backToCatalogBtn: Locator;
  readonly stockStatus: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-testid="pdp-title"], #pdpTitle, .pdp-title');
    this.price = page.locator('[data-testid="pdp-price"], #pdpPrice, .pdp-price');
    this.description = page.locator('[data-testid="pdp-desc"], #pdpDescription, .pdp-description');
    this.quantityInput = page.locator('[data-testid="pdp-qty-input"], #pdpQuantity');
    this.increaseQtyBtn = page.locator('[data-testid="pdp-qty-plus"], #pdpQtyPlus');
    this.decreaseQtyBtn = page.locator('[data-testid="pdp-qty-minus"], #pdpQtyMinus');
    this.addToCartBtn = page.locator('[data-testid="pdp-add-to-cart"], #pdpAddToCartBtn');
    this.buyNowBtn = page.locator('[data-testid="pdp-buy-now"], #pdpBuyNowBtn');
    this.categoryTag = page.locator('[data-testid="pdp-category"], .pdp-badge');
    this.backToCatalogBtn = page.locator('[data-testid="pdp-back-btn"], #pdpBackBtn');
    this.stockStatus = page.locator('[data-testid="pdp-stock"], .stock-status');
  }

  async setQuantity(qty: number): Promise<void> {
    Logger.info(`Setting quantity on PDP: ${qty}`);
    await this.quantityInput.fill(qty.toString());
  }

  async increaseQuantity(): Promise<void> {
    await this.safeClick(this.increaseQtyBtn, 'Increase quantity button');
  }

  async decreaseQuantity(): Promise<void> {
    await this.safeClick(this.decreaseQtyBtn, 'Decrease quantity button');
  }

  async addToCart(): Promise<void> {
    Logger.step('PDP', 'Clicking Add to Cart on PDP');
    await this.safeClick(this.addToCartBtn, 'Add to Cart button');
  }

  async buyNow(): Promise<void> {
    Logger.step('PDP', 'Clicking Buy Now on PDP');
    await this.safeClick(this.buyNowBtn, 'Buy Now button');
  }

  async goBack(): Promise<void> {
    await this.safeClick(this.backToCatalogBtn, 'Back to Catalog button');
  }
}
