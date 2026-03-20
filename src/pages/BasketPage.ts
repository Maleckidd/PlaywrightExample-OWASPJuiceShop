import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class BasketPage extends BasePage {
  readonly basketItems: Locator;
  readonly itemName: Locator;
  readonly itemPrice: Locator;
  readonly itemQuantity: Locator;
  readonly deleteButton: Locator;
  readonly checkoutButton: Locator;
  readonly emptyBasketMessage: Locator;
  readonly totalPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.basketItems = page.locator('[class*="basket"]');
    this.itemName = page.locator('[class*="item-name"]');
    this.itemPrice = page.locator('[class*="item-price"]');
    this.itemQuantity = page.locator('[class*="quantity"]');
    this.deleteButton = page.locator('[aria-label*="Delete"]');
    this.checkoutButton = page.locator('[routerlink*="checkout"]');
    this.emptyBasketMessage = page.locator('text=Basket is empty');
    this.totalPrice = page.locator('[class*="total"]');
  }

  async getBasketItemsCount(): Promise<number> {
    const items = await this.basketItems.locator('[class*="item"]').count();
    return items;
  }

  async deleteItem(index: number): Promise<void> {
    const deleteButtons = this.page.locator('[aria-label*="Delete"]');
    await deleteButtons.nth(index).click();
  }

  async deleteAllItems(): Promise<void> {
    const deleteButtons = this.page.locator('[aria-label*="Delete"]');
    const count = await deleteButtons.count();
    
    for (let i = count - 1; i >= 0; i--) {
      await deleteButtons.nth(i).click();
    }
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async isBasketEmpty(): Promise<boolean> {
    return await this.emptyBasketMessage.isVisible();
  }

  async getTotalPrice(): Promise<string> {
    return await this.totalPrice.textContent() || '';
  }

  async navigateTo(): Promise<void> {
    await this.goto('basket');
  }
}
