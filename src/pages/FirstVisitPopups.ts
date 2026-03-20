import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class FirstVisitPopups extends BasePage {
  readonly cookieMessage: Locator;
  readonly cookieLink: Locator;
  readonly cookieConfirmButton: Locator;
  readonly welcomeDialog: Locator;
  readonly welcomeDismissButton: Locator;
  readonly privacyButton: Locator;
  readonly privacyDialog: Locator;

  constructor(page: Page) {
    super(page);
    this.cookieMessage = page.locator('[class*="cookie"]').filter({ hasText: 'cookie' }).first();
    this.cookieLink = this.cookieMessage.locator('a');
    this.cookieConfirmButton = page.locator('[mat-button]').filter({ hasText: 'Accept' }).first();
    this.welcomeDialog = page.locator('mat-dialog-container');
    this.welcomeDismissButton = page.locator('[mat-dialog-close]');
    this.privacyButton = page.locator('[aria-label*="Privacy"]');
    this.privacyDialog = page.locator('[class*="privacy"]');
  }

  async clickCookieConfirmButton(): Promise<void> {
    await this.cookieConfirmButton.click();
  }

  async clickWelcomeDismissButton(): Promise<void> {
    await this.welcomeDismissButton.click();
  }

  async isCookieMessageVisible(): Promise<boolean> {
    return await this.cookieMessage.isVisible();
  }

  async isWelcomeDialogVisible(): Promise<boolean> {
    return await this.welcomeDialog.isVisible();
  }

  async dismissAllPopups(): Promise<void> {
    if (await this.cookieConfirmButton.isVisible()) {
      await this.clickCookieConfirmButton();
    }
    if (await this.welcomeDismissButton.isVisible()) {
      await this.clickWelcomeDismissButton();
    }
  }

  async getCookieMessageText(): Promise<string> {
    return await this.cookieMessage.textContent() || '';
  }
}
