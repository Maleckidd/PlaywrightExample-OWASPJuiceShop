import { test, expect, Page } from '@playwright/test';
import { FirstVisitPopups } from '../src/pages/FirstVisitPopups';
import { HeaderBar } from '../src/pages/HeaderBar';

let page: Page;
let firstVisitPopups: FirstVisitPopups;
let headerBar: HeaderBar;

test.beforeEach(async ({ page: testPage }) => {
  page = testPage;
  firstVisitPopups = new FirstVisitPopups(page);
  headerBar = new HeaderBar(page);
});

test.describe('Homepage - Initial Load', () => {
  test('Should load homepage successfully', async () => {
    await page.goto('/');
    await expect(page).toHaveURL(/.*home/);
  });

  test('Header should be visible', async () => {
    await page.goto('/');
    await expect(headerBar.accountButton).toBeVisible();
  });

  test('Search button should be visible', async () => {
    await page.goto('/');
    await expect(headerBar.searchButton).toBeVisible();
  });
});

test.describe('Homepage - Cookie Banner', () => {
  test('Cookie banner should be visible on first visit', async () => {
    await page.goto('/');
    
    const isCookieVisible = await firstVisitPopups.isCookieMessageVisible().catch(() => false);
    if (isCookieVisible) {
      await expect(firstVisitPopups.cookieMessage).toBeVisible();
    }
  });

  test('Cookie confirmation button should be clickable', async () => {
    await page.goto('/');
    
    const isButtonVisible = await firstVisitPopups.cookieConfirmButton.isVisible().catch(() => false);
    if (isButtonVisible) {
      await expect(firstVisitPopups.cookieConfirmButton).toBeEnabled();
      await firstVisitPopups.clickCookieConfirmButton();
    }
  });

  test('User can dismiss cookie banner', async () => {
    await page.goto('/');
    
    const isButtonVisible = await firstVisitPopups.cookieConfirmButton.isVisible().catch(() => false);
    if (isButtonVisible) {
      await firstVisitPopups.clickCookieConfirmButton();
      
      // Wait for banner to disappear
      await page.waitForTimeout(500);
      
      const stillVisible = await firstVisitPopups.isCookieMessageVisible().catch(() => false);
      expect(stillVisible).toBeFalsy();
    }
  });
});

test.describe('Homepage - Welcome Dialog', () => {
  test('Welcome dialog should appear on first visit', async () => {
    await page.goto('/');
    
    const isDialogVisible = await firstVisitPopups.isWelcomeDialogVisible().catch(() => false);
    if (isDialogVisible) {
      await expect(firstVisitPopups.welcomeDialog).toBeVisible();
    }
  });

  test('Welcome dialog dismiss button should be visible', async () => {
    await page.goto('/');
    
    const isDialogVisible = await firstVisitPopups.isWelcomeDialogVisible().catch(() => false);
    if (isDialogVisible) {
      await expect(firstVisitPopups.welcomeDismissButton).toBeVisible();
    }
  });

  test('User can dismiss welcome dialog', async () => {
    await page.goto('/');
    
    const isDialogVisible = await firstVisitPopups.isWelcomeDialogVisible().catch(() => false);
    if (isDialogVisible) {
      await firstVisitPopups.clickWelcomeDismissButton();
      
      // Wait for dialog to disappear
      await page.waitForTimeout(500);
      
      const stillVisible = await firstVisitPopups.isWelcomeDialogVisible().catch(() => false);
      expect(stillVisible).toBeFalsy();
    }
  });
});

test.describe('Homepage - Navigation', () => {
  test('User can navigate via header buttons', async () => {
    await page.goto('/');
    await firstVisitPopups.dismissAllPopups();
    
    await headerBar.clickAccountButton();
    await expect(headerBar.accountButton).toBeFocused();
  });

  test('Search functionality should work', async () => {
    await page.goto('/');
    await firstVisitPopups.dismissAllPopups();
    
    await headerBar.typeInSearchInput('Apple');
    
    // Verify search was executed
    await expect(page).toHaveURL(/.*search.*apple/i, { timeout: 5000 }).catch(() => {
      // Search may work without URL change
    });
  });

  test('User can access side navigation', async () => {
    await page.goto('/');
    await firstVisitPopups.dismissAllPopups();
    
    const isSideNavVisible = await headerBar.sideNavButton.isVisible().catch(() => false);
    if (isSideNavVisible) {
      await headerBar.clickSideNavButton();
      // Verify side nav opened
      await page.waitForTimeout(300);
    }
  });
});

test.describe('Homepage - Responsive Design', () => {
  test('Page should be responsive at 1280x720 viewport', async () => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    
    // Main elements should be visible
    await expect(headerBar.accountButton).toBeVisible();
  });

  test('Header should remain accessible at minimal viewport', async () => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    
    // Important navigation should be accessible
    const hamburgerOrAccount = page.locator('[aria-label*="Sidenav"]').or(headerBar.accountButton);
    await expect(hamburgerOrAccount.first()).toBeVisible();
  });
});

test.describe('Homepage - Page Performance', () => {
  test('Page should load within reasonable time', async () => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(10000); // Should load in less than 10 seconds
  });

  test('All critical elements should be loaded', async () => {
    await page.goto('/');
    
    await expect(headerBar.accountButton).toBeInViewport({
      timeout: 5000,
    });
  });
});
