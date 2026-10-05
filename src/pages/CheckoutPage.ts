import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { CustomerInfo } from '../utils/dataGenerator';
import { Logger } from '../utils/logger';

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly countrySelect: Locator;

  readonly paymentMethodCreditCard: Locator;
  readonly paymentMethodUPI: Locator;
  readonly paymentMethodCOD: Locator;

  readonly cardNumberInput: Locator;
  readonly cardExpiryInput: Locator;
  readonly cardCvvInput: Locator;

  readonly termsCheckbox: Locator;
  readonly placeOrderButton: Locator;
  readonly checkoutSummaryTotal: Locator;
  readonly validationErrors: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('#checkoutFirstName');
    this.lastNameInput = page.locator('#checkoutLastName');
    this.emailInput = page.locator('#checkoutEmail');
    this.phoneInput = page.locator('#checkoutPhone');
    this.addressInput = page.locator('#checkoutAddress');
    this.cityInput = page.locator('#checkoutCity');
    this.stateInput = page.locator('#checkoutState');
    this.zipCodeInput = page.locator('#checkoutZip');
    this.countrySelect = page.locator('#checkoutCountry');

    this.paymentMethodCreditCard = page.locator('#payMethodCard');
    this.paymentMethodUPI = page.locator('#payMethodUPI');
    this.paymentMethodCOD = page.locator('#payMethodCOD');

    this.cardNumberInput = page.locator('#cardNumber');
    this.cardExpiryInput = page.locator('#cardExpiry');
    this.cardCvvInput = page.locator('#cardCvv');

    this.termsCheckbox = page.locator('#agreeTerms');
    this.placeOrderButton = page.locator('#placeOrderBtn');
    this.checkoutSummaryTotal = page.locator('#checkoutOrderTotal');
    this.validationErrors = page.locator('#checkoutFormError');
  }

  async navigate(): Promise<void> {
    await this.navigateTo('/#checkout');
  }

  async fillShippingDetails(customer: CustomerInfo): Promise<void> {
    Logger.step('CHECKOUT', `Filling shipping details for: ${customer.firstName} ${customer.lastName}`);
    await this.safeFill(this.firstNameInput, customer.firstName, 'First Name');
    await this.safeFill(this.lastNameInput, customer.lastName, 'Last Name');
    await this.safeFill(this.emailInput, customer.email, 'Email Address');
    await this.safeFill(this.phoneInput, customer.phone, 'Phone Number');
    await this.safeFill(this.addressInput, customer.address, 'Street Address');
    await this.safeFill(this.cityInput, customer.city, 'City');
    await this.safeFill(this.stateInput, customer.state, 'State');
    await this.safeFill(this.zipCodeInput, customer.zipCode, 'Zip Code');
    if (await this.countrySelect.isVisible()) {
      await this.countrySelect.selectOption(customer.country);
    }
  }

  async selectPaymentMethod(method: 'card' | 'upi' | 'cod'): Promise<void> {
    Logger.step('CHECKOUT', `Selecting payment method: ${method}`);
    if (method === 'card') {
      await this.safeClick(this.paymentMethodCreditCard, 'Credit Card option');
    } else if (method === 'upi') {
      await this.safeClick(this.paymentMethodUPI, 'UPI option');
    } else {
      await this.safeClick(this.paymentMethodCOD, 'Cash on Delivery option');
    }
  }

  async fillCardDetails(customer: CustomerInfo): Promise<void> {
    if (await this.cardNumberInput.isVisible()) {
      await this.safeFill(this.cardNumberInput, customer.cardNumber, 'Card Number');
      await this.safeFill(this.cardExpiryInput, customer.cardExpiry, 'Card Expiry');
      await this.safeFill(this.cardCvvInput, customer.cardCvv, 'Card CVV');
    }
  }

  async acceptTermsAndConditions(): Promise<void> {
    if (await this.termsCheckbox.isVisible()) {
      const isChecked = await this.termsCheckbox.isChecked();
      if (!isChecked) {
        await this.termsCheckbox.check();
      }
    }
  }

  async placeOrder(): Promise<void> {
    Logger.step('CHECKOUT', 'Submitting order by clicking Place Order');
    await this.safeClick(this.placeOrderButton, 'Place Order Button');
  }

  async completeOrderFlow(customer: CustomerInfo, paymentMethod: 'card' | 'upi' | 'cod' = 'card'): Promise<void> {
    await this.fillShippingDetails(customer);
    await this.selectPaymentMethod(paymentMethod);
    if (paymentMethod === 'card') {
      await this.fillCardDetails(customer);
    }
    await this.acceptTermsAndConditions();
    await this.placeOrder();
  }
}
