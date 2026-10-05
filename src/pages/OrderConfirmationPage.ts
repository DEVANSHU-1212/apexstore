import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Helpers } from '../utils/helpers';
import { Logger } from '../utils/logger';

export class OrderConfirmationPage extends BasePage {
  readonly confirmationView: Locator;
  readonly successBanner: Locator;
  readonly orderNumberText: Locator;
  readonly customerNameText: Locator;
  readonly customerEmailText: Locator;
  readonly deliveryAddressText: Locator;
  readonly orderTotalText: Locator;
  readonly continueShoppingBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.confirmationView = page.locator('#confirmationView');
    this.successBanner = page.locator('#confirmationView h1');
    this.orderNumberText = page.locator('#confirmedOrderId');
    this.customerNameText = page.locator('#confirmCustomerName');
    this.customerEmailText = page.locator('#confirmCustomerEmail');
    this.deliveryAddressText = page.locator('#confirmShippingAddress');
    this.orderTotalText = page.locator('#confirmOrderTotal');
    this.continueShoppingBtn = page.locator('#confirmContinueBtn');
  }

  async getOrderId(): Promise<string> {
    await this.orderNumberText.waitFor({ state: 'visible', timeout: 10000 });
    return (await this.orderNumberText.textContent())?.trim() || '';
  }

  async getConfirmedTotal(): Promise<number> {
    const text = await this.orderTotalText.textContent();
    return Helpers.parsePrice(text || '0');
  }

  async isOrderConfirmed(): Promise<boolean> {
    await this.successBanner.waitFor({ state: 'visible', timeout: 10000 });
    return await this.successBanner.isVisible();
  }

  async continueShopping(): Promise<void> {
    Logger.info('Returning to catalog from order confirmation');
    await this.safeClick(this.continueShoppingBtn, 'Continue Shopping button');
  }
}
