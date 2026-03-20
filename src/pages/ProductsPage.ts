import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderBar } from './HeaderBar';

export class ProductsPage extends BasePage {
  readonly productsContainer: Locator;
  readonly productElements: Locator;
  readonly productReviewInput: Locator;
  readonly submitReviewButton: Locator;
  readonly addToBasketButton: Locator;
  readonly headerBar: HeaderBar;

  constructor(page: Page) {
    super(page);
    this.productsContainer = page.locator('[class*="table-container"]');
    this.productElements = page.locator('[class*="product"]');
    this.productReviewInput = page.locator('[aria-label="Text field to review a product"]');
    this.submitReviewButton = page.locator('#submitButton');
    this.addToBasketButton = page.locator('[aria-label*="Add to Basket"]');
    this.headerBar = new HeaderBar(page);
  }

  async sendReview(productName: string, reviewText: string): Promise<void> {
    const productLocator = this.page.locator(`text="${productName}"`);
    await productLocator.click();
    await this.productReviewInput.clear();
    await this.productReviewInput.fill(reviewText);
    await this.submitReviewButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async addToBasket(): Promise<void> {
    await this.headerBar.clickBackToHomePage();
    await this.page.waitForLoadState('networkidle');
    const responsePromise = this.page.waitForResponse(response =>
      response.url().includes('/api/BasketItems') && response.status() === 200
    );
    const addButton = this.page.locator('mat-card')
  .filter({ hasText: 'Apple Juice (1000ml) 1.99¤Add' })
  .getByLabel('Add to Basket')
    await addButton.click();
    await responsePromise;
  }

  async addToBasketByCategory(category: string): Promise<void> {
    const categoryButton = this.page.locator(`text="${category}"`);
    await categoryButton.click();
    await this.addToBasket();
  }

  async getProductPrice(productName: string): Promise<string> {
    const priceLocator = this.page.locator(`text="${productName}"`)
      .locator('..')
      .locator('[class*="price"]');
    return await priceLocator.textContent() || '';
  }
}
