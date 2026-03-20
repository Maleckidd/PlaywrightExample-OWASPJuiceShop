# 🚀 Playwright Quick Reference - OWASP Juice Shop

## 📋 Common Test Patterns

### Page Navigation
```typescript
// Go to home page
await page.goto('/')

// Go to specific path
await page.goto('/basket')

// Wait for navigation
await page.waitForNavigation({ waitUntil: 'networkidle' })
```

### Element Selection

| Need | Playwright |
|------|-----------|
| By ID | `page.locator('#email')` |
| By Class | `page.locator('.button')` |
| By Selector | `page.locator('[data-id="123"]')` |
| By Role (Recommended) | `page.getByRole('button', { name: 'Login' })` |
| By Label | `page.getByLabel('Email')` |
| By Placeholder | `page.getByPlaceholder('Enter email')` |
| By Text | `page.getByText('Welcome')` |

### Element Interactions

```typescript
// Click
await element.click()

// Type text
await element.fill('test@example.com')
// or
await element.fill('t') // character by character

// Clear field
await element.clear()

// Select option
await element.selectOption('option-value')

// Check checkbox
await checkbox.check()
await checkbox.uncheck()

// Hover
await element.hover()

// Focus
await element.focus()

// Right-click
await element.click({ button: 'right' })

// Double-click
await element.dblclick()

// Drag and drop
await source.dragTo(target)
```

### Assertions (Web-First)

```typescript
// Visibility
await expect(element).toBeVisible()
await expect(element).toBeHidden()

// State
await expect(element).toBeEnabled()
await expect(element).toBeDisabled()
await expect(element).toBeChecked()

// Content
await expect(element).toHaveText('exact text')
await expect(element).toContainText('partial text')
await expect(element).toHaveValue('value')

// Attribute
await expect(element).toHaveAttribute('href', 'https://...')
await expect(element).toHaveClass('active')
await expect(element).toHaveCount(3)

// URL & Title
await expect(page).toHaveURL(/.*login/)
await expect(page).toHaveTitle('Login')

// Page content
await expect(page.locator('body')).toContainText('Welcome')
```

### Waiter Patterns

```typescript
// Wait for element
await page.locator('#loader').waitFor({ state: 'hidden' })

// Wait for response
const response = await page.waitForResponse(r => 
  r.url().includes('/api/users') && r.status() === 200
)

// Wait for request
const request = await page.waitForRequest(r => 
  r.url().includes('/api/login')
)

// Custom wait
await page.waitForTimeout(1000)

// Wait for function
await page.waitForFunction(() => {
  return document.querySelectorAll('.item').length > 5
})
```

## 🎯 Creating Tests

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should do something', async ({ page }) => {
    // Arrange
    const element = page.locator('#button')
    
    // Act
    await element.click()
    
    // Assert
    await expect(page).toHaveURL('/success')
  })
})
```

### Using Page Objects
```typescript
import { test, expect } from '@playwright/test'
import { LoginPage } from '../src/pages/LoginPage'

test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page)
  
  await loginPage.goto()
  await loginPage.login('user@example.com', 'password123')
  
  await expect(page).toHaveURL(/.*dashboard/)
})
```

### Test Groups
```typescript
test.describe('Login', () => {
  test('valid credentials', async ({ page }) => {
    // ...
  })

  test('invalid email', async ({ page }) => {
    // ...
  })

  test.skip('skip this test', async ({ page }) => {
    // ...
  })

  test.only('run only this test', async ({ page }) => {
    // ...
  })
})
```

## 📦 Page Object Example

```typescript
import { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator

  constructor(page: Page) {
    super(page)
    this.emailInput = page.locator('#email')
    this.passwordInput = page.locator('#password')
    this.submitButton = page.locator('button[type="submit"]')
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
    await this.page.waitForNavigation()
  }
}
```

## 🧪 Test Execution

### Run All Tests
```bash
npm test
```

### Run Specific Test
```bash
npx playwright test tests/login.spec.ts
```

### Run With Options
```bash
# Headed mode (see browser)
npx playwright test --headed

# UI mode (interactive)
npx playwright test --ui

# Debug mode
npx playwright test --debug

# Specific browser
npx playwright test --project=chromium

# Serial execution
npx playwright test --workers=1

# Retry failed tests
npx playwright test --repeat-each=2
```

### View Results
```bash
npm run report
```

## 🔍 Debugging

### Debug Mode
```bash
npx playwright test --debug
```

### Pause Test
```typescript
test('my test', async ({ page }) => {
  await page.goto('/')
  await page.pause() // Opens inspector
})
```

### Log Information
```typescript
console.log('Current URL:', page.url())
console.log('Page title:', await page.title())
console.log('Element text:', await element.textContent())
```

### Take Screenshot
```typescript
await page.screenshot({ path: 'screenshot.png' })
```

### Trace Viewer
```bash
npx playwright show-trace trace.zip
```

## 🎛️ Configuration Tips

### Custom Timeouts
```typescript
// Test-level
test('slow test', async ({ page }) => {
  test.setTimeout(60000) // 60 seconds
  // ...
})

// Per-action
await element.click({ timeout: 10000 })
```

### Retries
```typescript
// In config
retries: 2

// For specific test
test.describe('flaky tests', () => {
  test.describe.configure({ retries: 3 })
  
  test('test that might fail', async ({ page }) => {
    // ...
  })
})
```

### Skip Tests
```typescript
test.skip(process.env.SKIP_SLOW === 'true', 'skipped', async ({ page }) => {
  // ...
})
```

## 📱 Multi-Browser Testing

```typescript
// All browsers (chromium, firefox)
npm test

// Chrome only
npm run test:chromium

// Firefox only
npm run test:firefox

// Custom browser in config
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
]
```

## 🚨 Common Errors & Solutions

### ElementNotFound
```typescript
// ❌ Problem
await page.locator('#non-existent').click()

// ✅ Solution
const element = page.locator('#exists')
await element.waitFor({ state: 'attached' })
await element.click()
```

### Timeout
```typescript
// ✅ Increase timeout
await element.click({ timeout: 10000 })

// ✅ Or wait explicitly
await page.locator('.loader').waitFor({ state: 'hidden' })
```

### Stale Element
```typescript
// ❌ Problem
const element = page.locator('.item')
await page.goto('/other')
await element.click() // Element no longer attached

// ✅ Solution
const element = page.locator('.item')
await element.click()
// Fresh reference after navigation
const newElement = page.locator('.item')
```

## 🔗 Useful Links

- [Playwright Docs](https://playwright.dev/)
- [API Reference](https://playwright.dev/docs/api/class-page)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [Configuration](https://playwright.dev/docs/test-configuration)

---

**Pro Tips:**
- ✅ Use `getByRole()` for accessibility-first selectors
- ✅ Use `getByLabel()` for form fields
- ✅ Avoid hardcoded waits, use proper waits
- ✅ Use `test.describe()` for test organization
- ✅ Keep Page Objects simple and focused
- ✅ Use fixtures for reusable setup/teardown
