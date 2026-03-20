import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderBar } from './HeaderBar';

export class SideNav extends BasePage {
  readonly customerFeedbackButton: Locator;
  readonly supportChatButton: Locator;
  readonly complaintButton: Locator;
  readonly headerBar: HeaderBar;

  constructor(page: Page) {
    super(page);
    this.headerBar = new HeaderBar(page);
    this.customerFeedbackButton = page.locator('a[routerlink="/contact"]');
    this.supportChatButton = page.locator('a[routerlink="/chatbot"]');
    this.complaintButton = page.locator('a[routerlink="/complain"]');
  }

  async navigateToComplaint(): Promise<void> {
    await this.headerBar.clickSideNavButton();
    await this.complaintButton.click();
  }

  async navigateToCustomerFeedback(): Promise<void> {
    // Wait for captcha API call
    await this.page.waitForResponse(response =>
      response.url().includes('/rest/captcha/') && response.status() === 200
    ).catch(() => {
      // Captcha might not always be called
    });
    
    await this.headerBar.clickSideNavButton();
    await this.customerFeedbackButton.click();
  }

  async navigateToSupportChat(): Promise<void> {
    await this.headerBar.clickSideNavButton();
    await this.supportChatButton.click();
  }
}
