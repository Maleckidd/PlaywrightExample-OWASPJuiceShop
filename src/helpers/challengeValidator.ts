import { Page } from '@playwright/test';

/**
 * Validates if OWASP JuiceShop challenge was solved
 * Equivalent to Cypress custom command: cy.checkIsAchivSolvedXHR()
 */
export class ChallengeValidator {
  constructor(private page: Page) {}

  async checkChallengeSolved(challengeName: string): Promise<boolean> {
    try {
      // Intercept the API call to get challenges
      let challengeData: any = null;

      await this.page.route('**/api/Challenges/**', async (route) => {
        const response = await route.fetch();
        challengeData = await response.json();
        await route.continue();
      });

      // Navigate to scoreboard which triggers the API call
      await this.page.goto('/#/score-board');

      // Wait for the data to be captured
      await this.page.waitForTimeout(1000);

      // Find the specific challenge
      if (challengeData?.data) {
        const challenge = challengeData.data.find((c: any) => c.name === challengeName);
        
        if (challenge) {
          console.log(`✅ Challenge '${challenge.name}' - Solved: ${challenge.solved}`);
          return challenge.solved === true;
        } else {
          console.log(`❌ Challenge '${challengeName}' not found in scoreboard`);
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error(`Error checking challenge ${challengeName}:`, error);
      return false;
    }
  }

  async assertChallengeSolved(challengeName: string): Promise<void> {
    const isSolved = await this.checkChallengeSolved(challengeName);
    if (!isSolved) {
      throw new Error(`Challenge '${challengeName}' was not solved`);
    }
  }

  /**
   * Get all solved challenges from scoreboard
   */
  async getSolvedChallenges(): Promise<string[]> {
    try {
      let challenges: any[] = [];

      await this.page.route('**/api/Challenges/**', async (route) => {
        const response = await route.fetch();
        const data = await response.json();
        challenges = data.data || [];
        await route.continue();
      });

      await this.page.goto('/#/score-board');
      await this.page.waitForTimeout(1000);

      return challenges
        .filter((c: any) => c.solved === true)
        .map((c: any) => c.name);
    } catch (error) {
      console.error('Error getting solved challenges:', error);
      return [];
    }
  }
}
