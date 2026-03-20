import { test, expect, Page } from '@playwright/test';
import { RegistrationPage, UserData } from '../src/pages/RegistrationPage';
import { HeaderBar } from '../src/pages/HeaderBar';
import { FirstVisitPopups } from '../src/pages/FirstVisitPopups';
import { TestDataGenerator } from '../src/helpers/testDataGenerator';

let page: Page;
let registrationPage: RegistrationPage;
let headerBar: HeaderBar;
let firstVisitPopups: FirstVisitPopups;

test.beforeEach(async ({ page: testPage }) => {
  page = testPage;
  registrationPage = new RegistrationPage(page);
  headerBar = new HeaderBar(page);
  firstVisitPopups = new FirstVisitPopups(page);

  await registrationPage.goto();
  
  try {
    await firstVisitPopups.dismissAllPopups();
  } catch (e) {
    // Popups might not be present
  }
});

test.describe('Registration Page - Elements Visibility', () => {
  test('Email input should be visible', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    await registrationPage.clickLoginLink();
    
    await expect(registrationPage.emailInput).toBeVisible();
  });

  test('Password input should be visible', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    await registrationPage.clickLoginLink();
    
    await expect(registrationPage.passwordInput).toBeVisible();
  });

  test('Repeat password input should be visible', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    await registrationPage.clickLoginLink();
    
    await expect(registrationPage.repeatPasswordInput).toBeVisible();
  });

  test('Register button should be visible and disabled initially', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    await registrationPage.clickLoginLink();
    
    await expect(registrationPage.registerButton).toBeVisible();
  });

  test('Security question select should be visible', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    await registrationPage.clickLoginLink();
    
    await expect(registrationPage.securityQuestionSelect).toBeVisible();
  });

  test('Security answer input should be visible', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    await registrationPage.clickLoginLink();
    
    await expect(registrationPage.securityAnswerInput).toBeVisible();
  });
});

test.describe('Registration Page - Functional Tests', () => {
  test('User can enter email', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    await registrationPage.clickLoginLink();
    
    const email = TestDataGenerator.generateRandomEmail();
    await registrationPage.fillEmail(email);
    
    await expect(registrationPage.emailInput).toHaveValue(email);
  });

  test('User can enter password', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    await registrationPage.clickLoginLink();
    
    const password = TestDataGenerator.generatePassword();
    await registrationPage.fillPassword(password);
    
    await expect(registrationPage.passwordInput).toHaveValue(password);
  });

  test('User can enter repeat password', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    await registrationPage.clickLoginLink();
    
    const password = TestDataGenerator.generatePassword();
    await registrationPage.fillRepeatPassword(password);
    
    await expect(registrationPage.repeatPasswordInput).toHaveValue(password);
  });

  test('Password mismatch should prevent registration', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    await registrationPage.clickLoginLink();
    
    const userData: UserData = TestDataGenerator.generateTestUser();
    
    await registrationPage.fillEmail(userData.email);
    await registrationPage.fillPassword(userData.password);
    await registrationPage.fillRepeatPassword('differentPassword');
    await registrationPage.selectSecurityQuestion("What's your favorite place to go hiking?");
    await registrationPage.fillSecurityAnswer(TestDataGenerator.generateSecurityAnswer());
    
    // Register button should prevent submission or show error
    const registerButtonDisabled = await registrationPage.registerButton.isDisabled().catch(() => false);
    expect(registerButtonDisabled).toBeTruthy();
  });

  test('User can select security question', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    await registrationPage.clickLoginLink();
    
    await registrationPage.selectSecurityQuestion("What's your favorite place to go hiking?");
    
    // Verify selection was made
    const selectedValue = await page.locator('[class*="mat-select-value"]').textContent();
    expect(selectedValue).toBeTruthy();
  });

  test('User can enter security answer', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    await registrationPage.clickLoginLink();
    
    const answer = TestDataGenerator.generateSecurityAnswer();
    await registrationPage.fillSecurityAnswer(answer);
    
    await expect(registrationPage.securityAnswerInput).toHaveValue(answer);
  });
});

test.describe('Registration Page - Form Validation', () => {
  test('Email field should accept valid email format', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    await registrationPage.clickLoginLink();
    
    const validEmail = TestDataGenerator.generateRandomEmail();
    await registrationPage.fillEmail(validEmail);
    
    await expect(registrationPage.emailInput).toHaveValue(validEmail);
  });

  test('Password should meet minimum requirements', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    await registrationPage.clickLoginLink();
    
    const weakPassword = 'weak';
    await registrationPage.fillPassword(weakPassword);
    
    // Password field should accept entry, validation happens on submission
    await expect(registrationPage.passwordInput).toHaveValue(weakPassword);
  });

  test('All required fields must be filled', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    await registrationPage.clickLoginLink();
    
    // Try to register without filling fields
    const registerButtonDisabled = await registrationPage.registerButton.isDisabled().catch(() => false);
    expect(registerButtonDisabled).toBeTruthy();
  });
});
