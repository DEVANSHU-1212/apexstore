import { test, expect } from '../../src/fixtures/testBase';
import { DataGenerator } from '../../src/utils/dataGenerator';
import { Logger } from '../../src/utils/logger';

test.describe('Checkout & Order Placement Suite', () => {
  test.beforeEach(async ({ catalogPage }) => {
    await catalogPage.navigate();
  });

  test('CHK-01: Customer can complete checkout with Credit Card and receive valid Order ID', async ({ catalogPage, cartPage, checkoutPage, confirmationPage }) => {
    const customer = DataGenerator.generateCustomer();
    
    Logger.step(1, 'Adding product to cart');
    await catalogPage.addProductToCartByName('QuantumBook Pro M3 Max Laptop');
    await catalogPage.openCart();

    Logger.step(2, 'Proceeding to checkout');
    await cartPage.proceedToCheckout();

    Logger.step(3, 'Filling shipping and payment details');
    await checkoutPage.fillShippingDetails(customer);
    await checkoutPage.selectPaymentMethod('card');
    await checkoutPage.fillCardDetails(customer);
    await checkoutPage.acceptTermsAndConditions();

    Logger.step(4, 'Placing order');
    await checkoutPage.placeOrder();

    Logger.step(5, 'Verifying order confirmation receipt');
    expect(await confirmationPage.isOrderConfirmed()).toBeTruthy();
    const orderId = await confirmationPage.getOrderId();
    expect(orderId).toMatch(/^ORD-/);

    await expect(confirmationPage.customerNameText).toContainText(customer.firstName);
    await expect(confirmationPage.customerEmailText).toHaveText(customer.email);
  });

  test('CHK-02: Customer can place an order using Cash on Delivery (COD)', async ({ catalogPage, cartPage, checkoutPage, confirmationPage }) => {
    const customer = DataGenerator.generateCustomer();

    await catalogPage.addProductToCartByName('Lumix Prime Cinema 4K Camera');
    await catalogPage.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingDetails(customer);
    await checkoutPage.selectPaymentMethod('cod');
    await checkoutPage.acceptTermsAndConditions();
    await checkoutPage.placeOrder();

    expect(await confirmationPage.isOrderConfirmed()).toBeTruthy();
    const orderId = await confirmationPage.getOrderId();
    expect(orderId).toBeTruthy();
  });
});
