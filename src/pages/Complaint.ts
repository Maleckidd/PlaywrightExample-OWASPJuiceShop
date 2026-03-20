import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { TestDataGenerator } from '../helpers/testDataGenerator';

export class Complaint extends BasePage {
  readonly complaintMessageInput: Locator;
  readonly uploadFileInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.complaintMessageInput = page.locator('#complaintMessage');
    this.uploadFileInput = page.locator('input[type="file"]');
    this.submitButton = page.locator('#submitButton');
  }

  async fillComplaintMessage(message: string): Promise<void> {
    await this.complaintMessageInput.clear();
    await this.complaintMessageInput.fill(message);
  }

  async uploadFile(filePath: string): Promise<void> {
    await this.uploadFileInput.setInputFiles(filePath).catch(() => {
      // File might not exist or upload might fail
    });
  }

  async clickSubmitButton(): Promise<void> {
    await this.submitButton.click();
  }

  async sendComplaint(message?: string, filePath?: string): Promise<void> {
    const complaintText = message || TestDataGenerator.generateReviewText();
    await this.fillComplaintMessage(complaintText);

    if (filePath) {
      await this.uploadFile(filePath);
    }

    await this.clickSubmitButton();
    await this.page.waitForLoadState('networkidle');
  }
}
