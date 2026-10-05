import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENV_CONFIG } from '../config/environment';
import { Logger } from '../utils/logger';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly userGreeting: Locator;
  readonly logoutButton: Locator;
  readonly navLoginLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#loginEmail');
    this.passwordInput = page.locator('#loginPassword');
    this.loginButton = page.locator('#loginBtn');
    this.errorMessage = page.locator('#loginErrorMessage');
    this.userGreeting = page.locator('#userProfileName');
    this.logoutButton = page.locator('#logoutBtn');
    this.navLoginLink = page.locator('#navLoginBtn');
  }

  async navigate(): Promise<void> {
    await this.navigateTo('/#login');
  }

  async openLoginModalOrPage(): Promise<void> {
    if (await this.navLoginLink.isVisible()) {
      await this.safeClick(this.navLoginLink, 'Navigation Sign In Link');
    }
  }

  async login(email: string, password: string): Promise<void> {
    Logger.step('AUTH', `Logging in with user: ${email}`);
    await this.safeFill(this.emailInput, email, 'Email Address');
    await this.safeFill(this.passwordInput, password, 'Password');
    await this.safeClick(this.loginButton, 'Login Submit Button');
  }

  async loginAsStandardUser(): Promise<void> {
    const { email, password } = ENV_CONFIG.users.standard;
    await this.login(email, password);
  }

  async loginAsAdmin(): Promise<void> {
    const { email, password } = ENV_CONFIG.users.admin;
    await this.login(email, password);
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return (await this.errorMessage.textContent())?.trim() || '';
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.logoutButton.isVisible();
  }

  async logout(): Promise<void> {
    Logger.info('Logging out user');
    await this.safeClick(this.logoutButton, 'Logout Button');
  }
}
