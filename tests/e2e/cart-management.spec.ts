import { test, expect } from '../../src/fixtures/testBase';
import couponsData from '../../src/fixtures/coupons.json';
import { Logger } from '../../src/utils/logger';

test.describe('Shopping Cart & Coupon Management Suite', () => {
  test.beforeEach(async ({ catalogPage }) => {
    await catalogPage.navigate();
  });

  test('CART-01: User can add multiple products to cart and verify cart badge counter', async ({ catalogPage, cartPage }) => {
    Logger.step(1, 'Adding product 1 to cart');
    await catalogPage.addProductToCartByName('Apex Wireless Noise-Cancelling Headphones Pro');
    expect(await catalogPage.getCartCount()).toBe(1);

    Logger.step(2, 'Adding product 2 to cart');
    await catalogPage.addProductToCartByName('UltraSmart Titan Watch Series 8');
    expect(await catalogPage.getCartCount()).toBe(2);

    Logger.step(3, 'Opening Cart View');
    await catalogPage.openCart();
    expect(await cartPage.getCartItemsCount()).toBe(2);
  });

  test('CART-02: User can update item quantity and verify subtotal changes', async ({ catalogPage, cartPage }) => {
    const productName = 'CyberPad RGB Mechanical Keyboard';
    await catalogPage.addProductToCartByName(productName);
    await catalogPage.openCart();

    const initialSubtotal = await cartPage.getSubtotal();
    Logger.step(1, `Initial Subtotal: $${initialSubtotal}`);

    Logger.step(2, 'Updating item quantity to 3');
    await cartPage.updateItemQuantity(productName, 3);

    const updatedSubtotal = await cartPage.getSubtotal();
    Logger.step(3, `Updated Subtotal: $${updatedSubtotal}`);
    expect(updatedSubtotal).toBeCloseTo(initialSubtotal * 3, 2);
  });

  test('CART-03: User can remove an item from the cart', async ({ catalogPage, cartPage }) => {
    const productName = 'AeroStream Ergonomic Mesh Chair';
    await catalogPage.addProductToCartByName(productName);
    await catalogPage.openCart();
    expect(await cartPage.getCartItemsCount()).toBe(1);

    Logger.step(1, 'Removing item from cart');
    await cartPage.removeItem(productName);

    await expect(cartPage.emptyCartMessage).toBeVisible();
  });

  test('CART-04: User can apply a valid discount coupon and verify total reduction', async ({ catalogPage, cartPage }) => {
    await catalogPage.addProductToCartByName('Apex Wireless Noise-Cancelling Headphones Pro');
    await catalogPage.openCart();

    const initialSubtotal = await cartPage.getSubtotal();
    const coupon = couponsData.validCoupons[0]; // SAVE10 -> 10%
    Logger.step(1, `Applying coupon: ${coupon.code}`);
    await cartPage.applyCoupon(coupon.code);

    const discountMsg = await cartPage.getCouponFeedbackMessage();
    expect(discountMsg).toContain('discount applied');

    const discountAmount = await cartPage.getDiscount();
    const expectedDiscount = Math.round(initialSubtotal * 0.10 * 100) / 100;
    expect(discountAmount).toBeCloseTo(expectedDiscount, 2);
  });

  test('CART-05: User receives clear error when applying an invalid coupon', async ({ catalogPage, cartPage }) => {
    await catalogPage.addProductToCartByName('Apex Wireless Noise-Cancelling Headphones Pro');
    await catalogPage.openCart();

    const invalidCoupon = couponsData.invalidCoupons[1]; // INVALID_CODE_XYZ
    Logger.step(1, `Applying invalid coupon: ${invalidCoupon.code}`);
    await cartPage.applyCoupon(invalidCoupon.code);

    const errorMsg = await cartPage.getCouponFeedbackMessage();
    expect(errorMsg.toLowerCase()).toContain('not found');
  });
});
