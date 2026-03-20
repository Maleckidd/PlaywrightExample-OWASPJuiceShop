export interface TestUser {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  securityQuestion?: string;
  securityAnswer?: string;
}

export class TestDataGenerator {
  static generateRandomEmail(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `testuser_${timestamp}_${random}@test.com`;
  }

  static generatePassword(): string {
    return 'SuperSecret99!';
  }

  static generateTestUser(overrides?: Partial<TestUser>): TestUser {
    return {
      email: this.generateRandomEmail(),
      password: this.generatePassword(),
      firstName: 'Test',
      lastName: 'User',
      country: 'Poland',
      securityQuestion: "What's your favorite place to go hiking?",
      securityAnswer: this.generateSecurityAnswer(),      
      ...overrides,
    };
  }

  static generateMultipleUsers(count: number): TestUser[] {
    return Array.from({ length: count }, () => this.generateTestUser());
  }

  static generateReviewText(): string {
    const reviews = [
      'Great product, highly recommended!',
      'Excellent quality and fast shipping.',
      'Love this item, will buy again.',
      'Perfect for the price!',
      'Best purchase ever made here.',
    ];
    return reviews[Math.floor(Math.random() * reviews.length)];
  }

  static generateCountry(): string {
    const countries = ['Poland', 'Germany', 'France', 'USA', 'UK', 'Spain', 'Italy'];
    return countries[Math.floor(Math.random() * countries.length)];
  }

  static generateSecurityAnswer(): string {
    const answers = ['Mountains', 'Beach', 'Park', 'Forest', 'Lake'];
    return answers[Math.floor(Math.random() * answers.length)];
  }

  static generateProductReview(): { productName: string; reviewText: string } {
    return {
      productName: 'Juice Shop',
      reviewText: this.generateReviewText(),
    };
  }
}
