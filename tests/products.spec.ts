import { test, expect, Page } from '@playwright/test';
import { ProductsPage } from '../src/pages/ProductsPage';
import { HeaderBar } from '../src/pages/HeaderBar';
import { BasketPage } from '../src/pages/BasketPage';
import { FirstVisitPopups } from '../src/pages/FirstVisitPopups';
import { TestDataGenerator } from '../src/helpers/testDataGenerator';

let page: Page;
let productsPage: ProductsPage;
let headerBar: HeaderBar;
let basketPage: BasketPage;
let firstVisitPopups: FirstVisitPopups;

test.beforeEach(async ({ page: testPage }) => {
  page = testPage;
  productsPage = new ProductsPage(page);
  headerBar = new HeaderBar(page);
  basketPage = new BasketPage(page);
  firstVisitPopups = new FirstVisitPopups(page);

  await productsPage.goto();
  
  try {
    await firstVisitPopups.dismissAllPopups();
  } catch (e) {
    // Popups might not be present
  }
});

test.describe('Products Page - Navigation', () => {
  test('Products page should be accessible', async () => {
    await expect(page).toHaveURL(/.*home/);
  });

  test('Products container should be visible', async () => {
    await expect(productsPage.productsContainer).toBeVisible();
  });

  test('Product elements should be displayed', async () => {
    const productCount = await productsPage.productElements.count();
    expect(productCount).toBeGreaterThan(0);
  });
});

test.describe('Products Page - Add to Basket', () => {
  test('User can add product to basket', async () => {
    const responsePromise = page.waitForResponse(response =>
      response.url().includes('/api/BasketItems') && response.status() === 201
    );
    
    // Click first add to basket button
    const firstAddButton = page.locator('[aria-label*="Add to Basket"]').first();
    await firstAddButton.click();
    
    await responsePromise;
    
    // Verify product was added
    const basketNotification = page.locator('[class*="success"]', { hasText: 'added' });
    const isVisible = await basketNotification.isVisible().catch(() => false);
    expect(isVisible).toBeTruthy();
  });

  test('Multiple products can be added to basket', async () => {
    const addButtons = page.locator('[aria-label*="Add to Basket"]');
    const buttonCount = await addButtons.count();
    
    if (buttonCount >= 2) {
      await addButtons.first().click();
      await page.waitForTimeout(500);
      
      await addButtons.nth(1).click();
      await page.waitForTimeout(500);
      
      // Navigate to basket and verify items
      await headerBar.navigateToBasket();
      
      const itemsCount = await basketPage.getBasketItemsCount();
      expect(itemsCount).toBeGreaterThanOrEqual(2);
    }
  });

  test('User can navigate to basket after adding product', async () => {
    const firstAddButton = page.locator('[aria-label*="Add to Basket"]').first();
    await firstAddButton.click();
    
    await page.waitForTimeout(500);
    
    await headerBar.navigateToBasket();
    await expect(page).toHaveURL(/.*basket/);
  });
});

test.describe('Products Page - Search', () => {
  test('User can search for products', async () => {
    const searchTerm = 'Juice';
    await headerBar.fillInSearchInput(searchTerm);
    
    // Wait for search results
    await page.waitForTimeout(1000);
    
    // Verify page still contains products
    const productsVisible = await productsPage.productsContainer.isVisible();
    expect(productsVisible).toBeTruthy();
  });

  test('Search with no results should show appropriate message', async () => {
    const searchTerm = 'NonexistentProduct12345';
    await headerBar.fillInSearchInput(searchTerm);
    
    await page.waitForTimeout(1000);
    
    // Check if no products found message appears or products container is empty
    const emptyState = page.locator('text=not found').or(page.locator('text=No results'));
    const isEmptyVisible = await emptyState.isVisible().catch(() => false);
    
    // Either message appears or products list is empty
    expect(isEmptyVisible || (await productsPage.productElements.count()) === 0).toBeTruthy();
  });
});

test.describe('Basket Operations', () => {
  test('Basket page shows added items', async () => {
    const firstAddButton = page.locator('[aria-label*="Add to Basket"]').first();
    await firstAddButton.click();
    
    await page.waitForTimeout(500);
    
    await headerBar.navigateToBasket();
    
    const itemsCount = await basketPage.getBasketItemsCount();
    expect(itemsCount).toBeGreaterThan(0);
  });

  test('User can delete item from basket', async () => {
    const firstAddButton = page.locator('[aria-label*="Add to Basket"]').first();
    await firstAddButton.click();
    
    await page.waitForTimeout(500);
    
    await headerBar.navigateToBasket();
    
    const initialCount = await basketPage.getBasketItemsCount();
    
    await basketPage.deleteItem(0);
    
    await page.waitForTimeout(500);
    
    const finalCount = await basketPage.getBasketItemsCount();
    expect(finalCount).toBeLessThan(initialCount);
  });

  test('Empty basket displays appropriate message', async () => {
    await basketPage.navigateTo();
    
    // Delete all items if any
    await basketPage.deleteAllItems();
    
    const isEmpty = await basketPage.isBasketEmpty();
    expect(isEmpty).toBeTruthy();
  });
});
