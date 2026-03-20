# Playwright E2E Tests - OWASP Juice Shop

Comprehensive **TypeScript-based E2E test suite** for OWASP Juice Shop, migrated from Cypress to Playwright.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Download browsers
npx playwright install

# Run all tests
npm test

# Run with UI mode
npm run test:ui
```

## 📚 Documentation

- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Complete Cypress → Playwright migration guide with examples
- **[playwright.config.ts](./playwright.config.ts)** - Test configuration with retries, timeouts, viewport settings
- **[src/pages/](./src/pages/)** - Page Object Models for all pages
- **[tests/](./tests/)** - Test suites with comprehensive scenarios

## 📖 Available Scripts

| Command | Purpose |
|---------|---------|
| `npm test` | Run all tests in headless mode |
| `npm run test:headed` | Run tests with visible browser |
| `npm run test:ui` | Run tests with interactive UI |
| `npm run test:debug` | Run tests in debug mode |
| `npm run test:chromium` | Run tests on Chrome only |
| `npm run test:firefox` | Run tests on Firefox only |
| `npm run test:serial` | Run tests sequentially (no parallelization) |
| `npm run report` | View HTML test report |

## 🏗️ Project Structure

```
src/
├── pages/
│   ├── BasePage.ts           # Base class with common methods
│   ├── HeaderBar.ts          # Navigation header
│   ├── LoginPage.ts          # Login functionality
│   ├── RegistrationPage.ts   # User registration
│   ├── ProductsPage.ts       # Product catalog & operations
│   ├── BasketPage.ts         # Shopping basket
│   └── FirstVisitPopups.ts   # Welcome & cookie popups
└── helpers/
    └── testDataGenerator.ts  # Test data utilities

tests/
├── login.spec.ts             # Login scenarios
├── register.spec.ts          # Registration scenarios
├── products.spec.ts          # Products & basket
└── homepage.spec.ts          # Homepage & popups

fixtures/
├── dev.json                  # Dev environment config
└── stag.json                 # Staging environment config
```

## 🎯 Configuration

### playwright.config.ts
- **Retries**: 2 on failure
- **Headless**: true
- **Viewport**: 1280x720
- **Trace**: on-first-retry
- **Timeout**: 30 seconds per test
- **Browsers**: Chromium & Firefox

### Environment Variables

```bash
JUICE_SHOP_URL=http://localhost:3000
JUICE_SHOP_ENV=dev
```

## 🧪 Test Coverage

### Login Tests (8 scenarios)
- ✓ Element visibility checks
- ✓ Input field functionality
- ✓ Form submission
- ✓ Error handling
- ✓ Navigation to registration

### Registration Tests (9 scenarios)
- ✓ Form field validation
- ✓ Email/password entry
- ✓ Password mismatch detection
- ✓ Security question selection
- ✓ Form submission

### Products Tests (7 scenarios)
- ✓ Product page navigation
- ✓ Add to basket functionality
- ✓ Product search
- ✓ Basket management
- ✓ Item deletion

### Homepage Tests (10 scenarios)
- ✓ Page load verification
- ✓ Cookie banner handling
- ✓ Welcome dialog dismissal
- ✓ Navigation functionality
- ✓ Search operations
- ✓ Responsive design
- ✓ Performance metrics

## 💡 Key Features

- ✅ **Type-Safe**: Full TypeScript with strict mode
- ✅ **Async/Await**: All operations properly awaited
- ✅ **Web-First Assertions**: Modern Playwright assertions
- ✅ **Page Objects**: Clean, maintainable test code
- ✅ **Test Data Generation**: Faker-inspired utilities
- ✅ **Auto-Retry**: Automatic retry on failure
- ✅ **Screenshots & Videos**: Captured on failure
- ✅ **Parallel Execution**: Fast test runs
- ✅ **HTML Reports**: Detailed test reports

## 🔧 Advanced Usage

### Run specific test
```bash
npx playwright test tests/login.spec.ts
```

### Run with custom viewport
```bash
npx playwright test --viewport 1920x1080
```

### Run with tags
```bash
npx playwright test --grep @smoke
```

### Debug in VS Code
1. Set breakpoint in test
2. Run: `npm run test:debug`
3. Use VS Code debugger

## 📊 Reports

After test execution, view the HTML report:

```bash
npm run report
```

Report includes:
- Test results by file
- Pass/fail statistics
- Screenshots of failures
- Video recordings
- Trace viewer for debugging

## 🐛 Troubleshooting

### Tests not finding selectors
- Check `ElementNotFound` in report screenshots
- Use `--debug` mode to inspect locators
- Verify test environment is running

### Timeout errors
- Increase `timeout` in `playwright.config.ts`
- Add explicit waits for network requests
- Check if app is responsive

### Flaky tests
- Review `--trace on-first-retry` output
- Add appropriate waits for dynamic content
- Check element visibility before interaction

## 📚 Learning Resources

- [Playwright Docs](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Page Objects Pattern](https://playwright.dev/docs/pom)
- [Test Configuration](https://playwright.dev/docs/test-configuration)

## 👥 Team

**QA Automation Engineer**: Maintaining E2E test suite
**Framework**: Playwright + TypeScript
