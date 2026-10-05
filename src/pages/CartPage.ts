import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Helpers } from '../utils/helpers';
import { Logger } from '../utils/logger';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly cartItemRows: Locator;
  readonly subtotalText: Locator;
  readonly discountText: Locator;
  readonly shippingText: Locator;
  readonly taxText: Locator;
  readonly grandTotalText: Locator;
  readonly couponInput: Locator;
  readonly applyCouponBtn: Locator;
  readonly couponFeedback: Locator;
  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;
  readonly continueShoppingBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-testid="cart-item"], .cart-item');
    this.cartItemRows = page.locator('[data-testid="cart-table-row"], .cart-row');
    this.subtotalText = page.locator('[data-testid="cart-subtotal"], #cartSubtotal');
    this.discountText = page.locator('[data-testid="cart-discount"], #cartDiscount');
    this.shippingText = page.locator('[data-testid="cart-shipping"], #cartShipping');
    this.taxText = page.locator('[data-testid="cart-tax"], #cartTax');
    this.grandTotalText = page.locator('[data-testid="cart-grand-total"], #cartGrandTotal');
    this.couponInput = page.locator('[data-testid="coupon-code-input"], #couponInput');
    this.applyCouponBtn = page.locator('[data-testid="apply-coupon-btn"], #applyCouponBtn');
    this.couponFeedback = page.locator('[data-testid="coupon-feedback"], #couponFeedback');
    this.checkoutButton = page.locator('[data-testid="proceed-checkout-btn"], #proceedCheckoutBtn');
    this.emptyCartMessage = page.locator('[data-testid="empty-cart-msg"], .empty-cart-alert');
    this.continueShoppingBtn = page.locator('[data-testid="continue-shopping-btn"], #continueShoppingBtn');
  }

  async navigate(): Promise<void> {
    await this.navigateTo('/#cart');
  }

  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getItemRowByName(productName: string): Promise<Locator> {
    return this.cartItems.filter({ hasText: productName }).first();
  }

  async updateItemQuantity(productName: string, quantity: number): Promise<void> {
    Logger.step('CART', `Updating quantity of "${productName}" to ${quantity}`);
    const row = await this.getItemRowByName(productName);
    const qtyInput = row.locator('[data-testid="item-qty-input"], input.cart-qty');
    await qtyInput.fill(quantity.toString());
    await qtyInput.press('Enter');
    await this.page.waitForTimeout(300);
  }

  async removeItem(productName: string): Promise<void> {
    Logger.step('CART', `Removing "${productName}" from cart`);
    const row = await this.getItemRowByName(productName);
    const removeBtn = row.locator('[data-testid="remove-item-btn"], button.remove-item-btn');
    await this.safeClick(removeBtn, `Remove button for ${productName}`);
    await this.page.waitForTimeout(300);
  }

  async applyCoupon(couponCode: string): Promise<void> {
    Logger.step('CART', `Applying discount coupon: "${couponCode}"`);
    await this.safeFill(this.couponInput, couponCode, 'Coupon input');
    await this.safeClick(this.applyCouponBtn, 'Apply Coupon button');
    await this.page.waitForTimeout(400);
  }

  async getCouponFeedbackMessage(): Promise<string> {
    await this.couponFeedback.waitFor({ state: 'visible', timeout: 5000 });
    return (await this.couponFeedback.textContent())?.trim() || '';
  }

  async getSubtotal(): Promise<number> {
    const text = await this.subtotalText.textContent();
    return Helpers.parsePrice(text || '0');
  }

  async getDiscount(): Promise<number> {
    const text = await this.discountText.textContent();
    return Helpers.parsePrice(text || '0');
  }

  async getGrandTotal(): Promise<number> {
    const text = await this.grandTotalText.textContent();
    return Helpers.parsePrice(text || '0');
  }

  async proceedToCheckout(): Promise<void> {
    Logger.step('CHECKOUT', 'Proceeding from Cart to Checkout page');
    await this.safeClick(this.checkoutButton, 'Proceed to Checkout button');
  }
}
