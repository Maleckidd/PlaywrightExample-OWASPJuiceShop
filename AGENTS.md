# AGENTS.md - Coding Agent Guidelines

This document provides guidelines for AI coding agents working on this Playwright E2E test suite for OWASP Juice Shop.

## Project Overview

- **Framework**: Playwright with TypeScript
- **Target Application**: OWASP Juice Shop (security testing web app)
- **Purpose**: End-to-end test automation with Page Object Model pattern
- **Node.js**: ES2020+ with strict TypeScript

## Build/Test Commands

### Install Dependencies
```bash
npm install
npx playwright install  # Download browser binaries
```

### Run Tests

```bash
# Run all tests (headless)
npm test

# Run a single test file
npx playwright test tests/login.spec.ts

# Run a single test by name (grep)
npx playwright test --grep "Login button should be visible"

# Run tests with visible browser
npm run test:headed

# Run with Playwright UI (interactive debugging)
npm run test:ui

# Run in debug mode (step-through)
npm run test:debug

# Run specific browser only
npm run test:chromium
npm run test:firefox

# Run tests sequentially (no parallelization)
npm run test:serial

# View HTML report after tests
npm run report
```

### Environment Variables
```bash
JUICE_SHOP_URL=http://localhost:3000  # Target app URL
JUICE_SHOP_ENV=dev                     # Environment (dev/stag)
```

## Project Structure

```
src/
├── pages/              # Page Object Models
│   ├── BasePage.ts     # Base class with common methods
│   ├── LoginPage.ts    # Login page interactions
│   ├── ProductsPage.ts # Product catalog operations
│   └── ...
└── helpers/
    ├── testDataGenerator.ts   # Test data utilities
    └── challengeValidator.ts  # OWASP challenge validation

tests/                  # Test specifications
├── login.spec.ts
├── products.spec.ts
├── 1-star-challenges.spec.ts
└── ...

fixtures/               # Environment-specific test data
├── dev.json
└── stag.json
```

## Code Style Guidelines

### TypeScript Conventions

- **Strict mode enabled**: All code must pass `strict: true` TypeScript checks
- **No unused variables**: `noUnusedLocals` and `noUnusedParameters` are enforced
- **ES2020 target**: Use modern JS features (optional chaining, nullish coalescing)

### Imports

- Use named imports from `@playwright/test`: `import { test, expect, Page } from '@playwright/test'`
- Import Page Objects from relative paths: `import { LoginPage } from '../src/pages/LoginPage'`
- Group imports: Playwright imports first, then local imports

```typescript
import { test, expect, Page, Locator } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { TestDataGenerator } from '../src/helpers/testDataGenerator';
```

### Page Object Model Pattern

- All page classes extend `BasePage`
- Locators are `readonly` class properties initialized in constructor
- Methods return `Promise<void>` or `Promise<T>` for getters
- Use explicit return types on all methods

```typescript
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.clear();
    await this.emailInput.fill(email);
  }
}
```

### Naming Conventions

- **Files**: PascalCase for Page Objects (`LoginPage.ts`), kebab-case for test specs (`login.spec.ts`)
- **Classes**: PascalCase (`LoginPage`, `TestDataGenerator`)
- **Methods**: camelCase, verb-first (`fillEmail`, `clickLoginButton`, `navigateToBasket`)
- **Locators**: camelCase, noun-based (`emailInput`, `loginButton`, `productsContainer`)
- **Test descriptions**: Descriptive, action-based ("User can enter email in email field")

### Locator Strategies (Priority Order)

1. ID selectors: `page.locator('#email')`
2. Aria labels: `page.locator('[aria-label="Click to search"]')`
3. Role-based: `page.getByRole('button', { name: 'Login' })`
4. CSS with attributes: `page.locator('[routerlink="/basket"]')`
5. Text content (last resort): `page.locator('text="Submit"')`

### Test Structure

```typescript
let page: Page;
let loginPage: LoginPage;

test.beforeEach(async ({ page: testPage }) => {
  page = testPage;
  loginPage = new LoginPage(page);
  await loginPage.goto();
  
  // Dismiss popups with try-catch
  try {
    await firstVisitPopups.dismissAllPopups();
  } catch (e) {
    // Popups might not be present
  }
});

test.describe('Feature Group', () => {
  test('specific test case', async () => {
    // Arrange, Act, Assert pattern
    await loginPage.fillEmail('test@example.com');
    await expect(loginPage.emailInput).toHaveValue('test@example.com');
  });
});
```

### Assertions

- Use Playwright web-first assertions: `await expect(locator).toBeVisible()`
- Prefer `toHaveURL`, `toHaveValue`, `toBeVisible` over manual checks
- For boolean checks, use `expect(value).toBeTruthy()` or `toBe(true)`

### Async/Await

- **Always await** all Playwright operations
- Use `page.waitForLoadState('networkidle')` after navigation
- Use `page.waitForResponse()` to wait for specific API calls
- Avoid `page.waitForTimeout()` except for edge cases (prefer proper waits)

### Error Handling

- Wrap optional operations in try-catch (e.g., popup dismissal)
- Use `.catch(() => false)` for optional visibility checks
- Throw descriptive errors in helper classes

```typescript
async isErrorMessageVisible(): Promise<boolean> {
  return await this.errorMessage.isVisible();
}

// Usage in test
const errorPresent = await loginPage.isErrorMessageVisible().catch(() => false);
```

### Test Data

- Use `TestDataGenerator` for dynamic test data
- Store static test data in `fixtures/*.json`
- Generate unique emails with timestamps: `testuser_${Date.now()}_${random}@test.com`

## Configuration

Key settings in `playwright.config.ts`:
- **Retries**: 2 on failure
- **Timeout**: 30 seconds per test
- **Action timeout**: 10 seconds
- **Viewport**: 1280x720
- **Trace**: on-first-retry (for debugging failures)
- **Screenshots/Video**: on failure only

## Common Patterns

### Waiting for API Response
```typescript
const responsePromise = page.waitForResponse(response =>
  response.url().includes('/api/BasketItems') && response.status() === 201
);
await addButton.click();
await responsePromise;
```

### API Request Testing
```typescript
const response = await page.request.get('/ftp/acquisitions.md');
expect(response.status()).toBe(200);
```

### Challenge Validation
```typescript
await challengeValidator.assertChallengeSolved('Challenge Name');
```
