import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HeaderBar extends BasePage {
  readonly searchButton: Locator;
  readonly searchInput: Locator;
  readonly accountButton: Locator;
  readonly loginButton: Locator;
  readonly sideNavButton: Locator;
  readonly basketButton: Locator;
  readonly ordersPaymentButton: Locator;
  readonly mySavedAddressesButton: Locator;
  readonly backToHomePageButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchButton = page.locator('[aria-label="Click to search"]');
    this.searchInput = page.locator('#mat-input-0');
    this.accountButton = page.locator('[aria-label="Show/hide account menu"]');
    this.loginButton = page.locator('button[aria-label="Go to login page"]');
    this.sideNavButton = page.locator('[aria-label="Open Sidenav"]');
    this.basketButton = page.locator('[routerlink="/basket"]');
    this.ordersPaymentButton = page.locator('[aria-label*="Show Orders and Payment Menu"]').last();
    this.mySavedAddressesButton = page.locator('[routerlink="/address/saved"]');
    this.backToHomePageButton = page.locator('[aria-label="Back to homepage"]');
  }

  async clickAccountButton(): Promise<void> {
    await this.accountButton.click();
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async clickSearchButton(): Promise<void> {
    await this.searchButton.click();
  }

  async fillInSearchInput(text: string): Promise<void> {
    await this.searchButton.click()
    await this.searchInput.clear();
    await this.searchInput.fill(text);
    await this.searchInput.press('Enter');
  }

  async clickSideNavButton(): Promise<void> {
    await this.sideNavButton.click();
  }

  async navigateToBasket(): Promise<void> {
    await this.page.waitForResponse(response =>
      response.url().includes('/rest/basket') && response.status() === 200
    );
    await this.basketButton.click();
  }

  async navigateToMySavedAddresses(): Promise<void> {
    await this.accountButton.click();
    await this.ordersPaymentButton.hover();
    await this.mySavedAddressesButton.click();
  }

  async clickBackToHomePage(): Promise<void> {
    await this.backToHomePageButton.click();
  }

  async logout(): Promise<void> {
    await this.accountButton.click();
    const logoutButton = this.page.locator('[id*="logout"]');
    await logoutButton.click();
  }
}
