import { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string = ''): Promise<void> {
    await this.page.goto(path ? `/${path}` : '/');
  }

  async waitForLoadState(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async delay(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }
}
