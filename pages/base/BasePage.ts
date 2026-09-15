import { type Locator, type Page } from '@playwright/test';

export default abstract class BasePage {
  constructor(protected readonly page: Page) { }

  // Navigation
  protected async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  // Actions
  protected async waitForElementVisibility(locator: Locator, timeout = 5000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  protected async waitForClickability(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });

    if (!(await locator.isEnabled())) {
      throw new Error('Element is not enabled.');
    }
  }

  protected async clickElement(locator: Locator): Promise<void> {
    await this.waitForElementVisibility(locator);
    await this.waitForClickability(locator);
    await locator.click();
  }

  protected async fillText(locator: Locator, text: string): Promise<void> {
    await this.waitForElementVisibility(locator);
    await locator.fill(text);
  }

  protected async checkElement(locator: Locator): Promise<void> {
    await locator.check();
  }

  protected async selectOption(locator: Locator, option: string | { value: string }): Promise<this> {
    await locator.selectOption(option);
    return this;
  }

  protected async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  // Verifications
  protected async isElementVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  protected async getElementInputValue(locator: Locator): Promise<string> {
    return locator.inputValue();
  }

  // Utility
  protected async countElements(locator: Locator): Promise<number> {
    return locator.count();
  }
}
