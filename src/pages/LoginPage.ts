import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderBar } from './HeaderBar';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registrationLink: Locator;
  readonly headerBar: HeaderBar;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#loginButton');
    this.registrationLink = page.locator('#newCustomerLink a');
    this.headerBar = new HeaderBar(page);
    this.errorMessage = page.locator('[class*="error"]');
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.clear();
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async clickRegistrationLink(): Promise<void> {
    await this.registrationLink.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.goto();
    await this.headerBar.clickAccountButton();
    await this.headerBar.clickLoginButton();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLoginButton();
    await this.page.waitForLoadState('networkidle');
  }

  async isLoginButtonVisible(): Promise<boolean> {
    return await this.loginButton.isVisible();
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}
