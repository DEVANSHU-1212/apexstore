import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';
import { ProductApiService } from '../api/ProductApiService';
import { OrderApiService } from '../api/OrderApiService';
import { ENV_CONFIG } from '../config/environment';

export interface TestFixtures {
  loginPage: LoginPage;
  catalogPage: CatalogPage;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  confirmationPage: OrderConfirmationPage;
  productApi: ProductApiService;
  orderApi: OrderApiService;
}

export const test = baseTest.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  catalogPage: async ({ page }, use) => {
    const catalogPage = new CatalogPage(page);
    await use(catalogPage);
  },
  productDetailsPage: async ({ page }, use) => {
    const productDetailsPage = new ProductDetailsPage(page);
    await use(productDetailsPage);
  },
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
  confirmationPage: async ({ page }, use) => {
    const confirmationPage = new OrderConfirmationPage(page);
    await use(confirmationPage);
  },
  productApi: async ({ request }, use) => {
    const productApi = new ProductApiService(request);
    await use(productApi);
  },
  orderApi: async ({ request }, use) => {
    const orderApi = new OrderApiService(request);
    await use(orderApi);
  },
});

export { expect };
