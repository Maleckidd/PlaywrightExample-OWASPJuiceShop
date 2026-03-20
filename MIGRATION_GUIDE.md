# Cypress → Playwright Migration Guide

## 📋 Overview

Complete migration of E2E tests from **Cypress (JavaScript)** to **Playwright (TypeScript)** for OWASP Juice Shop.

**Source:** `/Users/damianmalecki/Projects/CypressExample-OWASPJuiceShop`
**Target:** `/Users/damianmalecki/Projects/Playwright-OWASPJuiceShop`

## 🎯 Key Changes

### Configuration
- ✅ Retries: **2** (matches Cypress config)
- ✅ Headless: **true**
- ✅ Viewport: **1280x720**
- ✅ Trace: **on-first-retry**
- ✅ Screenshots: **only-on-failure**
- ✅ Video: **retain-on-failure**

### Project Structure

```
Playwright-OWASPJuiceShop/
├── src/
│   ├── pages/
│   │   ├── BasePage.ts           # Base class for all pages
│   │   ├── HeaderBar.ts          # Header navigation component
│   │   ├── LoginPage.ts          # Login page object
│   │   ├── RegistrationPage.ts   # Registration page object
│   │   ├── ProductsPage.ts       # Products listing and operations
│   │   ├── BasketPage.ts         # Shopping basket operations
│   │   └── FirstVisitPopups.ts   # Welcome & cookie popups
│   └── helpers/
│       └── testDataGenerator.ts  # Test data generation utilities
├── tests/
│   ├── login.spec.ts             # Login test scenarios
│   ├── register.spec.ts          # Registration test scenarios
│   ├── products.spec.ts          # Products & basket tests
│   └── homepage.spec.ts          # Homepage & popup tests
├── fixtures/
│   ├── dev.json                  # Development environment config
│   └── stag.json                 # Staging environment config
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # NPM dependencies & scripts
```

## 🔄 Selector Migration Examples

### Cypress → Playwright

```javascript
// ❌ Cypress
cy.get('[id="email"]')

// ✅ Playwright
page.locator('#email')
// or
page.getByPlaceholder('email')
```

```javascript
// ❌ Cypress
cy.get('[aria-label="Add to Basket"]')

// ✅ Playwright
page.getByRole('button', { name: /add to basket/i })
// or
page.locator('[aria-label*="Add to Basket"]')
```

```javascript
// ❌ Cypress
cy.get('button').contains('Login').click()

// ✅ Playwright
await page.getByRole('button', { name: 'Login' }).click()
```

## 🧪 Test Pattern Changes

### Async/Await Pattern

```javascript
// ❌ Cypress (synchronous, chained)
cy.get('#email').fill('test@example.com')
cy.get('#password').fill('password123')
cy.get('#loginButton').click()

// ✅ Playwright (asynchronous, awaited)
await page.locator('#email').fill('test@example.com')
await page.locator('#password').fill('password123')
await page.locator('#loginButton').click()
```

### Assertions

```javascript
// ❌ Cypress
cy.get('#email').should('be.visible')
cy.get('#loginButton').should('not.be.disabled')

// ✅ Playwright (Web-First Assertions)
await expect(page.locator('#email')).toBeVisible()
await expect(page.locator('#loginButton')).toBeEnabled()
```

### Page Object Pattern

```typescript
// ❌ Cypress
const loginPage = {
  emailInputSelector: '[id="email"]',
  emailInput() {
    return cy.get(this.emailInputSelector)
  },
  fillEmail(email) {
    this.emailInput().clear().fill(email)
  }
}

// ✅ Playwright
export class LoginPage extends BasePage {
  readonly emailInput: Locator

  constructor(page: Page) {
    super(page)
    this.emailInput = page.locator('#email')
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.clear()
    await this.emailInput.fill(email)
  }
}
```

## 📦 Installation & Setup

```bash
# Navigate to project
cd /Users/damianmalecki/Projects/Playwright-OWASPJuiceShop

# Install dependencies
npm install

# Download browsers
npx playwright install
```

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run with UI mode
npm run test:ui

# Run in headed mode (see browser)
npm run test:headed

# Run single test file
npx playwright test tests/login.spec.ts

# Run specific browser
npm run test:chromium
npm run test:firefox

# Debug mode
npm run test:debug

# Run tests serially (no parallelization)
npm run test:serial

# View HTML report
npm run report
```

## 🔧 Configuration

### Environment Variables

```bash
# Set custom base URL
JUICE_SHOP_URL=http://localhost:3000 npm test

# Set environment
JUICE_SHOP_ENV=stag npm test
```

### playwright.config.ts Settings

- **timeout**: 30000ms per test
- **expect.timeout**: 5000ms per assertion
- **actionTimeout**: 10000ms for page actions
- **navigationTimeout**: 30000ms for page navigation
- **viewport**: 1280x720 (adjustable per test)
- **retries**: 2 on failure

## 🎯 Page Objects Overview

### LoginPage
- `fillEmail(email: string)`
- `fillPassword(password: string)`
- `clickLoginButton()`
- `clickRegistrationLink()`
- `login(email: string, password: string)` - Complete flow
- `isErrorMessageVisible()`

### RegistrationPage
- `fillEmail(email: string)`
- `fillPassword(password: string)`
- `typeRepeatPassword(password: string)`
- `selectSecurityQuestion(questionText: string)`
- `typeSecurityAnswer(answer: string)`
- `clickRegisterButton()`
- `register(userData: UserData)` - Complete flow

### HeaderBar
- `clickAccountButton()`
- `clickLoginButton()`
- `clickSearchButton()`
- `typeInSearchInput(text: string)`
- `navigateToBasket()`
- `navigateToMySavedAddresses()`
- `logout()`

### ProductsPage
- `sendReview(productName: string, reviewText: string)`
- `addToBasket(productName: string)`
- `getProductPrice(productName: string)`

### BasketPage
- `getBasketItemsCount(): number`
- `deleteItem(index: number)`
- `deleteAllItems()`
- `clickCheckout()`
- `isBasketEmpty()`
- `getTotalPrice()`

### FirstVisitPopups
- `clickCookieConfirmButton()`
- `clickWelcomeDismissButton()`
- `dismissAllPopups()`
- `isCookieMessageVisible()`
- `isWelcomeDialogVisible()`

## 📊 Test Suites

### login.spec.ts
- ✓ Login button visibility
- ✓ Email/Password input fields visibility
- ✓ User can enter email/password
- ✓ Field clearing behavior
- ✓ Registration link navigation
- ✓ Invalid credentials error handling
- ✓ Empty field validation

### register.spec.ts
- ✓ All input fields visibility
- ✓ User can enter email/password
- ✓ Password mismatch validation
- ✓ Security question selection
- ✓ Form validation
- ✓ Required fields validation

### products.spec.ts
- ✓ Products page accessibility
- ✓ Add single product to basket
- ✓ Add multiple products
- ✓ Product search functionality
- ✓ Delete items from basket
- ✓ Empty basket state

### homepage.spec.ts
- ✓ Homepage loads successfully
- ✓ Cookie banner appears & dismissible
- ✓ Welcome dialog appears & dismissible
- ✓ Header navigation elements
- ✓ Search functionality
- ✓ Responsive design tests
- ✓ Page load performance

## 🐛 Debugging

### Run specific test with debugging
```bash
npx playwright test tests/login.spec.ts --debug
```

### Run with traces enabled
```bash
npx playwright test --trace on
```

### View traces
```bash
npx playwright show-trace trace.zip
```

### Generate report
```bash
npm run report
```

## 📈 Best Practices Implemented

✅ **TypeScript**: Full type safety with strict mode
✅ **Async/Await**: All actions properly awaited
✅ **Web-First Assertions**: Uses modern locator-based assertions
✅ **Page Objects**: Encapsulated page interactions
✅ **Test Data**: Centralized test data generation
✅ **Error Handling**: Graceful error handling in tests
✅ **Fixtures**: Environment-specific configuration
✅ **Retries**: Auto-retry failed tests
✅ **Reporting**: Comprehensive HTML reports
✅ **Parallel Execution**: Tests run in parallel by default

## 🔗 Useful Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Test Configuration](https://playwright.dev/docs/test-configuration)
- [Page Object Model](https://playwright.dev/docs/pom)

## ✋ TODO / Future Enhancements

- [ ] Add API testing with Playwright Request Context
- [ ] Implement visual regression testing
- [ ] Add performance testing hooks
- [ ] Create test data builders for complex scenarios
- [ ] Implement custom reporters
- [ ] Add integration with CI/CD pipelines
- [ ] Create test environment setup scripts
- [ ] Add accessibility testing