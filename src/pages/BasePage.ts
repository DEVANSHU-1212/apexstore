import { Page, Locator, expect } from '@playwright/test';
import { Logger } from '../utils/logger';

export abstract class BasePage {
  readonly page: Page;
  readonly toastMessage: Locator;
  readonly pageHeader: Locator;
  readonly cartIconBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toastMessage = page.locator('[data-testid="toast-notification"], .toast-message, .alert');
    this.pageHeader = page.locator('header, .navbar, [data-testid="main-header"]');
    this.cartIconBadge = page.locator('[data-testid="cart-badge"], .cart-badge');
  }

  async navigateTo(path: string = '/'): Promise<void> {
    Logger.info(`Navigating to: ${path}`);
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  async safeClick(locator: Locator, description?: string): Promise<void> {
    if (description) Logger.info(`Clicking: ${description}`);
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async safeFill(locator: Locator, text: string, description?: string): Promise<void> {
    if (description) Logger.info(`Filling ${description} with: "${text}"`);
    await locator.waitFor({ state: 'visible' });
    await locator.fill(text);
  }

  async waitForToast(): Promise<string> {
    await this.toastMessage.first().waitFor({ state: 'visible', timeout: 5000 });
    return (await this.toastMessage.first().textContent())?.trim() || '';
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    Logger.info(`Capturing screenshot: ${name}`);
    return await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }

  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
