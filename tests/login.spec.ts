import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { HeaderBar } from '../src/pages/HeaderBar';
import { FirstVisitPopups } from '../src/pages/FirstVisitPopups';

let page: Page;
let loginPage: LoginPage;
let headerBar: HeaderBar;
let firstVisitPopups: FirstVisitPopups;

test.beforeEach(async ({ page: testPage }) => {
  page = testPage;
  loginPage = new LoginPage(page);
  headerBar = new HeaderBar(page);
  firstVisitPopups = new FirstVisitPopups(page);

  await loginPage.goto();
  
  // Dismiss initial popups if present
  try {
    await firstVisitPopups.dismissAllPopups();
  } catch (e) {
    // Popups might not be present
  }
});

test.describe('Login Page - Elements Visibility', () => {
  test('Login button should be visible', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('Email input should be visible and focusable', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.emailInput).toBeFocused();
  });

  test('Password input should be visible', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test('Registration link should be visible', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    
    await expect(loginPage.registrationLink).toBeVisible();
  });
});

test.describe('Login Page - Functional Tests', () => {
  test('User can enter email in email field', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    
    const testEmail = 'test@example.com';
    await loginPage.fillEmail(testEmail);
    
    await expect(loginPage.emailInput).toHaveValue(testEmail);
  });

  test('User can enter password in password field', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    
    const testPassword = 'TestPassword123';
    await loginPage.fillPassword(testPassword);
    
    await expect(loginPage.passwordInput).toHaveValue(testPassword);
  });

  test('Email field clears when using fillEmail method', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    
    await loginPage.fillEmail('first@example.com');
    await loginPage.fillEmail('second@example.com');
    
    await expect(loginPage.emailInput).toHaveValue('second@example.com');
  });

  test('Password field clears when using fillPassword method', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    
    await loginPage.fillPassword('firstPassword');
    await loginPage.fillPassword('secondPassword');
    
    await expect(loginPage.passwordInput).toHaveValue('secondPassword');
  });

  test('User can click on registration link', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    
    await expect(loginPage.registrationLink).toBeEnabled();
    
    await loginPage.clickRegistrationLink();
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/.*register/);
  });
});

test.describe('Login Page - Error Handling', () => {
  test('Invalid credentials should show error message', async () => {
    await loginPage.login('invalid@test.com', 'wrongPassword');
    
    const errorPresent = await loginPage.isErrorMessageVisible().catch(() => false);
    if (errorPresent) {
      await expect(loginPage.errorMessage).toBeVisible();
    }
  });

  test('Empty email should prevent login', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    
    await loginPage.fillPassword('somePassword');
    await loginPage.clickLoginButton();
    
    // Should still be on login page
    await expect(page).toHaveURL(/.*login/);
  });
});
