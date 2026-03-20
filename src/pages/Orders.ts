import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderBar } from './HeaderBar';
import { TestDataGenerator } from '../helpers/testDataGenerator';

export class Orders extends BasePage {
  readonly addNewAddressButton: Locator;
  readonly countryInput: Locator;
  readonly nameInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly zipCodeInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly submitButton: Locator;
  readonly checkoutBasketButton: Locator;
  readonly tableRow: Locator;
  readonly proceedToPaymentButton: Locator;
  readonly proceedToDeliveryButton: Locator;
  readonly completeYourPurchaseButton: Locator;
  readonly payUsingWalletButton: Locator;
  readonly headerBar: HeaderBar;

  constructor(page: Page) {
    super(page);
    this.headerBar = new HeaderBar(page);
    this.addNewAddressButton = page.locator('[routerlink="/address/create"]');
    this.countryInput = page.locator('[data-placeholder="Please provide a country."]');
    this.nameInput = page.locator('[data-placeholder="Please provide a name."]');
    this.mobileNumberInput = page.locator('[data-placeholder="Please provide a mobile number."]');
    this.zipCodeInput = page.locator('[data-placeholder="Please provide a ZIP code."]');
    this.addressInput = page.locator('[data-placeholder="Please provide an address."]');
    this.cityInput = page.locator('[data-placeholder="Please provide a city."]');
    this.stateInput = page.locator('[data-placeholder="Please provide a state."]');
    this.submitButton = page.locator('#submitButton');
    this.checkoutBasketButton = page.locator('#checkoutButton');
    this.tableRow = page.locator('mat-table > mat-row');
    this.proceedToPaymentButton = page.locator('[aria-label="Proceed to payment selection"]');
    this.proceedToDeliveryButton = page.locator('[aria-label="Proceed to delivery method selection"]');
    this.completeYourPurchaseButton = page.locator('[aria-label="Complete your purchase"]');
    this.payUsingWalletButton = page.locator('[class*="custom-card"] > div > div > button');
  }

  async addNewAddress(
    country?: string,
    name?: string,
    mobileNumber?: string,
    zipCode?: string,
    address?: string,
    city?: string,
    state?: string
  ): Promise<void> {
    await this.headerBar.navigateToMySavedAddresses();
    await this.addNewAddressButton.click();

    await this.countryInput.fill(country || TestDataGenerator.generateCountry());
    await this.nameInput.fill(name || 'Test User');
    await this.mobileNumberInput.fill(mobileNumber || '10000000');
    await this.zipCodeInput.fill(zipCode || '33333');
    await this.addressInput.fill(address || '123 Test Street');
    await this.cityInput.fill(city || 'Test City');
    await this.stateInput.fill(state || 'Test State');

    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async placeOrder(): Promise<void> {
    await this.headerBar.navigateToBasket();

    await this.checkoutBasketButton.click();
    await this.page.waitForTimeout(300);

    // Select first address
    const firstRow = this.tableRow.first();
    await firstRow.click();
    await this.page.waitForTimeout(300);

    await this.proceedToPaymentButton.click();
    await this.page.waitForTimeout(300);

    // Select payment method
    const paymentRow = this.tableRow.first();
    await paymentRow.click();
    await this.page.waitForTimeout(300);

    await this.proceedToDeliveryButton.click();
    await this.page.waitForTimeout(300);

    // Select delivery/payment wallet
    await this.payUsingWalletButton.click();
    await this.page.waitForTimeout(300);

    await this.completeYourPurchaseButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
