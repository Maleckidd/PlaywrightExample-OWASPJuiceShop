import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderBar } from './HeaderBar';
import { LoginPage } from './LoginPage';

export interface UserData {
  email: string;
  password: string;
  repeatPassword?: string;
  securityQuestion?: string;
  securityAnswer?: string;
}

export class RegistrationPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly repeatPasswordInput: Locator;
  readonly passwordCheckbox: Locator;
  readonly securityQuestionSelect: Locator;
  readonly securityQuestionOptions: Locator;
  readonly securityAnswerInput: Locator;
  readonly registerButton: Locator;
  readonly loginLink: Locator;
  readonly headerBar: HeaderBar;
  readonly loginPage: LoginPage;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#emailControl');
    this.passwordInput = page.locator('#passwordControl');
    this.repeatPasswordInput = page.locator('#repeatPasswordControl');
    this.passwordCheckbox = page.locator('[class*="mat-slide-toggle-bar"]');
    this.securityQuestionSelect = page.locator('[class*="mat-select-arrow-wrapper"]').first();
    this.securityQuestionOptions = page.locator('mat-option[class*="mat-option"]');
    this.securityAnswerInput = page.locator('#securityAnswerControl');
    this.registerButton = page.locator('[aria-label="Button to complete the registration"]');
    this.loginLink = page.locator('#alreadyACustomerLink');
    this.headerBar = new HeaderBar(page);
    this.loginPage = new LoginPage(page);
    this.successMessage = page.locator('[class*="success"]');
  }

  async goToRegistrationPage(): Promise<void> {
    await this.goto('#/register');
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.clear();
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  async fillRepeatPassword(password: string): Promise<void> {
    await this.repeatPasswordInput.clear();
    await this.repeatPasswordInput.fill(password);
  }

  async selectSecurityQuestion(questionText: string): Promise<void> {
    await this.securityQuestionSelect.click();
    const option = this.page.locator(`mat-option:has-text("${questionText}")`);
    await option.click();
  }

  async fillSecurityAnswer(answer: string): Promise<void> {
    await this.securityAnswerInput.clear();
    await this.securityAnswerInput.fill(answer);
  }

  async clickRegisterButton(): Promise<void> {
    await this.registerButton.click();
  }

  async clickLoginLink(): Promise<void> {
    await this.loginLink.click();
  }

  async togglePasswordCheckbox(): Promise<void> {
    await this.passwordCheckbox.click();
  }

  async register(userData: UserData): Promise<void> {
    await this.goToRegistrationPage()

    await this.fillEmail(userData.email);
    await this.fillPassword(userData.password);
    await this.fillRepeatPassword(userData.repeatPassword || userData.password);

    if (userData.securityQuestion) {
      await this.selectSecurityQuestion(userData.securityQuestion);
    }

    if (userData.securityAnswer) {
      await this.fillSecurityAnswer(userData.securityAnswer);
    }

    await this.clickRegisterButton();
    await this.page.waitForLoadState('networkidle');
  }

  async isRegisterButtonVisible(): Promise<boolean> {
    return await this.registerButton.isVisible();
  }
}
