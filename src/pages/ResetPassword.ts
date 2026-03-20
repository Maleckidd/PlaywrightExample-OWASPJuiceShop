import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ResetPassword extends BasePage {
  readonly emailInput: Locator;
  readonly securityAnswerInput: Locator;
  readonly newPasswordInput: Locator;
  readonly newPasswordRepeatInput: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#email');
    this.securityAnswerInput = page.locator('#securityAnswer');
    this.newPasswordInput = page.locator('#newPassword');
    this.newPasswordRepeatInput = page.locator('#newPasswordRepeat');
    this.resetButton = page.locator('#resetButton');
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.clear();
    await this.emailInput.fill(email);
  }

  async fillSecurityAnswer(answer: string): Promise<void> {
    await this.securityAnswerInput.clear();
    await this.securityAnswerInput.fill(answer);
  }

  async fillNewPassword(password: string): Promise<void> {
    await this.newPasswordInput.clear();
    await this.newPasswordInput.fill(password);
  }

  async fillNewPasswordRepeat(password: string): Promise<void> {
    await this.newPasswordRepeatInput.clear();
    await this.newPasswordRepeatInput.fill(password);
  }

  async clickResetButton(): Promise<void> {
    await this.resetButton.click();
  }

  async resetPassword(
    email: string,
    newPassword: string,
    securityAnswer: string
  ): Promise<void> {
    await this.goto('#/forgot-password');
    await this.fillEmail(email);
    await this.fillSecurityAnswer(securityAnswer);
    await this.fillNewPassword(newPassword);
    await this.fillNewPasswordRepeat(newPassword);
    await this.clickResetButton();
    await this.page.waitForLoadState('networkidle');
  }
}
