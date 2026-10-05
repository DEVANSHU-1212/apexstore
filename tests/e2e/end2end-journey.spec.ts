import { test, expect } from '../../src/fixtures/testBase';
import { DataGenerator } from '../../src/utils/dataGenerator';
import usersData from '../../src/fixtures/users.json';
import couponsData from '../../src/fixtures/coupons.json';
import { Logger } from '../../src/utils/logger';

test.describe('End-to-End Customer Journey', () => {
  test('E2E-01: Full User Lifecycle - Login -> Search -> PDP -> Cart -> Coupon -> Checkout -> Receipt', async ({
    loginPage,
    catalogPage,
    productDetailsPage,
    cartPage,
    checkoutPage,
    confirmationPage
  }) => {
    const user = usersData.validUsers[0];
    const customer = DataGenerator.generateCustomer({ email: user.email, firstName: 'Alex', lastName: 'Johnson' });
    const coupon = couponsData.validCoupons[1]; // FLASH20 (20%)

    Logger.step('JOURNEY-1', 'Step 1: User authenticates into ApexStore');
    await loginPage.navigate();
    await loginPage.login(user.email, user.password);
    await expect(loginPage.userGreeting).toBeVisible();

    Logger.step('JOURNEY-2', 'Step 2: Customer searches for "Titan Watch"');
    await catalogPage.searchProduct('Titan Watch');
    const titles = await catalogPage.getAllProductTitles();
    expect(titles.length).toBeGreaterThan(0);

    Logger.step('JOURNEY-3', 'Step 3: Customer opens Product Details Page');
    await catalogPage.openProductDetails(titles[0]);
    await expect(productDetailsPage.title).toBeVisible();
    await productDetailsPage.setQuantity(2);
    await productDetailsPage.addToCart();

    Logger.step('JOURNEY-4', 'Step 4: Customer views cart and applies FLASH20 coupon');
    await catalogPage.openCart();
    expect(await cartPage.getCartItemsCount()).toBe(1);
    
    await cartPage.applyCoupon(coupon.code);
    const feedback = await cartPage.getCouponFeedbackMessage();
    expect(feedback).toContain('20% discount applied');

    Logger.step('JOURNEY-5', 'Step 5: Customer proceeds to checkout and fills payment');
    await cartPage.proceedToCheckout();
    await checkoutPage.completeOrderFlow(customer, 'card');

    Logger.step('JOURNEY-6', 'Step 6: Customer receives verified order confirmation');
    expect(await confirmationPage.isOrderConfirmed()).toBeTruthy();
    const orderId = await confirmationPage.getOrderId();
    expect(orderId).toContain('ORD-');
    Logger.pass(`Customer journey complete! Order reference: ${orderId}`);
  });
});
