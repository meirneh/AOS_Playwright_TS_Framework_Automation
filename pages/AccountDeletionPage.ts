import type { Locator, Page } from '@playwright/test';
import BasePage from './base/BasePage';

export default class AccountDeletionPage extends BasePage {
  private readonly deleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.deleteButton = page.getByRole('button', { name: /delete/i });
  }

  async startAccountDeletion(): Promise<this> {
    await this.clickElement(this.deleteButton);
    return this;
  }
}
