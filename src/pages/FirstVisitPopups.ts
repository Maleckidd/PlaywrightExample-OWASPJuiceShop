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
    this.cookieConfirmButton = page.locator('a[aria-label="dismiss cookie message"]');
    this.welcomeDialog = page.locator('mat-dialog-container');
    this.welcomeDismissButton = page.locator('button[aria-label="Close Welcome Banner"]');
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
    // The welcome dialog renders asynchronously after load and its overlay backdrop
    // swallows every click until dismissed — wait for it instead of checking instantly
    const welcomeAppeared = await this.welcomeDismissButton
      .waitFor({ state: 'visible', timeout: 3000 })
      .then(() => true)
      .catch(() => false);
    if (welcomeAppeared) {
      await this.clickWelcomeDismissButton();
      await this.page
        .locator('.cdk-overlay-backdrop')
        .waitFor({ state: 'detached', timeout: 5000 })
        .catch(() => {});
    }
    if (await this.cookieConfirmButton.isVisible().catch(() => false)) {
      await this.clickCookieConfirmButton();
    }
  }

  async getCookieMessageText(): Promise<string> {
    return await this.cookieMessage.textContent() || '';
  }
}
