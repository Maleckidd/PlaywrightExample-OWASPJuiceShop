import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { RegistrationPage } from '../src/pages/RegistrationPage';
import { HeaderBar } from '../src/pages/HeaderBar';
import { SideNav } from '../src/pages/SideNav';
import { FirstVisitPopups } from '../src/pages/FirstVisitPopups';
import { ChallengeValidator } from '../src/helpers/challengeValidator';
import { TestDataGenerator } from '../src/helpers/testDataGenerator';

let page: Page;
let loginPage: LoginPage;
let registrationPage: RegistrationPage;
let headerBar: HeaderBar;
let sideNav: SideNav;
let firstVisitPopups: FirstVisitPopups;
let challengeValidator: ChallengeValidator;

test.beforeEach(async ({ page: testPage }) => {
  page = testPage;
  loginPage = new LoginPage(page);
  registrationPage = new RegistrationPage(page);
  headerBar = new HeaderBar(page);
  sideNav = new SideNav(page);
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
 * OWASP JuiceShop - 1 Star Challenges (Vulnerability Level: Low)
 * These are basic security vulnerabilities
 */
test.describe('1-Star Security Challenges', () => {
  test('1 - Visit Score Board', async () => {
    await page.goto('/#/score-board');
    await expect(page).toHaveURL(/.*score-board/);
    
    // Verify challenges are loaded
    const challengeElements = page.locator('[class*="challenge"]');
    const count = await challengeElements.count();
    expect(count).toBeGreaterThan(0);
  });

  test('2 - Bonus Payload - Search Trick', async () => {
    const payloads = JSON.parse(
      require('fs').readFileSync('/Users/damianmalecki/Projects/Playwright-OWASPJuiceShop/fixtures/challengesPayloads.json', 'utf8')
    );

    await headerBar.fillInSearchInput(payloads.BonusPayload);
    await page.waitForTimeout(1000);

    await challengeValidator.assertChallengeSolved('Bonus Payload');
  });

  test('3 - Confidential Document - FTP Access', async () => {
    const response = await page.request.get('/ftp/acquisitions.md');
    expect(response.status()).toBe(200);

    await challengeValidator.assertChallengeSolved('Confidential Document');
  });

  test('4 - Error Handling - SQL Injection', async () => {
    await loginPage.login("'", 'asd');
    await page.waitForTimeout(1000);

    await challengeValidator.assertChallengeSolved('Error Handling');
  });

  test('5 - Missing Encoding - File Access', async () => {
    const response = await page.request.get(
      '/assets/public/images/uploads/%F0%9F%98%BC-%23zatschi-%23whoneedsfourlegs-1572600969477.jpg'
    );
    expect(response.status()).toBe(200);

    await page.goto('/');
    await challengeValidator.assertChallengeSolved('Missing Encoding');
  });

  test('6 - Exposed Metrics - API Endpoint', async () => {
    const response = await page.request.get('/metrics');
    expect(response.status()).toBe(200);

    await challengeValidator.assertChallengeSolved('Exposed Metrics');
  });

  test('7 - Outdated Allowlist - Redirect', async () => {
    const response = await page.request.get(
      '/redirect?to=https://blockchain.info/address/1AbKfgvw9psQ41NbLi8kufDQTezwG8DRZm'
    );
    expect(response.status()).toBe(200);

    await challengeValidator.assertChallengeSolved('Outdated Allowlist');
  });

  test('8 - Privacy Policy', async () => {
    await page.goto('/#/privacy-security/privacy-policy');
    await expect(page).toHaveURL(/.*privacy-policy/);

    await challengeValidator.assertChallengeSolved('Privacy Policy');
  });

  test('9 - Zero Stars - Complaint with Rating 0', async () => {
    await sideNav.navigateToCustomerFeedback();

    // Get CAPTCHA response
    let captchaData: any;
    await page.route('**/api/Feedbacks/', async (route) => {
      if (route.request().method() === 'GET') {
        const response = await route.fetch();
        captchaData = await response.json();
      }
      await route.continue();
    });

    // Wait for captcha intercept
    const captchaResponse = await page.request.get('/rest/captcha/');
    const captchaBody = await captchaResponse.json();

    // Submit feedback with 0 stars
    await page.request.post('/api/Feedbacks/', {
      data: {
        captchaId: captchaBody.captchaId,
        captcha: captchaBody.answer,
        comment: 'rte (anonymous)',
        rating: 0
      }
    });

    await challengeValidator.assertChallengeSolved('Zero Stars');
  });

  test('10 - Repetitive Registration - Multiple Users', async () => {
    await headerBar.clickAccountButton();
    await headerBar.clickLoginButton();
    await loginPage.clickRegistrationLink();

    for (let i = 0; i < 3; i++) {
      const userData = TestDataGenerator.generateTestUser();
      
      await registrationPage.fillEmail(userData.email);
      await registrationPage.fillPassword(userData.password);
      await registrationPage.fillRepeatPassword(userData.password);
      
      //if (i === 0) {
        // Only select question on first iteration
        await registrationPage.selectSecurityQuestion("What's your favorite place to go hiking?");
      //}
      
      await registrationPage.fillSecurityAnswer(TestDataGenerator.generateSecurityAnswer());
      await registrationPage.clickRegisterButton();
      await page.waitForTimeout(500);

      // Restart for next iteration
      if (i < 2) {
        await page.goto('/');
        await headerBar.clickAccountButton();
        await headerBar.clickLoginButton();
        await loginPage.clickRegistrationLink();
      }
    }

    await challengeValidator.assertChallengeSolved('Repetitive Registration');
  });

  test('11 - Bully Chatbot - Spam Messages', async () => {
    // Register and login
    const userData = TestDataGenerator.generateTestUser();
    await registrationPage.register(userData);

    await loginPage.login(userData.email, userData.password);

    // Navigate to chat
    await headerBar.clickSideNavButton();
    const chatButton = page.locator('a[routerlink="/chatbot"]');
    await chatButton.click();

    // Send multiple messages to bully chatbot
    const messageInput = page.locator('#message-input');
    
    for (let i = 0; i < 30; i++) {
      await messageInput.fill('code');
      await messageInput.press('Enter');
      await page.waitForTimeout(100);
    }

    await challengeValidator.assertChallengeSolved('Bully Chatbot');
  });
});
