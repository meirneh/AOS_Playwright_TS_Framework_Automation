import { expect, type Locator, type Page } from '@playwright/test';

export default class SearchComponent {
  readonly input: Locator;
  private readonly searchOutput: Locator;
  private readonly categoriesSection: Locator;
  private readonly topResultsSection: Locator;
  private readonly categoryTitle: Locator;
  private readonly categoryItems: Locator;
  private readonly topResultsTitle: Locator;
  private readonly viewAllLink: Locator;
  private readonly productSuggestions: Locator;

  constructor(protected readonly page: Page) {
    this.input = page.locator('#autoComplete');
    this.searchOutput = page.locator('#output');
    this.categoriesSection = this.searchOutput.locator('.categories');
    this.topResultsSection = this.searchOutput.locator('.top6Products');
    this.categoryTitle = this.categoriesSection.locator('h3');
    this.categoryItems = this.categoriesSection.locator('a');
    this.topResultsTitle = this.topResultsSection.locator('h3');
    this.viewAllLink = this.topResultsSection.locator('a[translate="View_All"]');
    this.productSuggestions = this.topResultsSection.locator('img');
  }

  async fillSearchBox(text: string): Promise<void> {
    await this.input.fill(text);
  }

  async typeSearchBox(text: string): Promise<void> {
    await this.input.clear();
    await this.input.pressSequentially(text);
  }

  async clearSearchBoxWithBackspace(): Promise<void> {
    await this.input.focus();
    const currentValue = await this.input.inputValue();

    for (let index = 0; index < currentValue.length; index += 1) {
      await this.input.press('Backspace');
    }
  }

  async verifySearchBoxValue(text: string): Promise<void> {
    await expect(this.input).toHaveValue(text);
  }

  async submitSearch(): Promise<void> {
    await this.input.press('Enter');
  }

  async verifySuggestionsPanelIsVisible(searchTerm: string): Promise<void> {
    await expect(this.topResultsTitle).toContainText(`TOP RESULTS FOR: "${searchTerm}"`);
  }

  async verifySuggestionsPanelIsNotVisible(): Promise<void> {
    await expect(this.categoryTitle).toBeHidden();
    await expect(this.topResultsTitle).toBeHidden();
    await expect(this.productSuggestions.first()).toBeHidden();
  }

  async verifyProductSuggestionsAreVisible(): Promise<void> {
    await expect(this.productSuggestions.first()).toBeVisible();
  }

  async verifySuggestedCategoriesAreVisible(): Promise<void> {
    await expect(this.categoryTitle).toHaveText('CATEGORIES');
  }

  async verifyTopResultsTitleIsVisible(searchTerm: string): Promise<void> {
    await expect(this.topResultsTitle).toContainText(`TOP RESULTS FOR: "${searchTerm}"`);
  }

  async verifyViewAllIsVisible(): Promise<void> {
    await expect(this.viewAllLink).toBeVisible();
  }

  async verifySuggestionsContain(searchTerm: string): Promise<void> {
    await this.verifyTopResultsTitleIsVisible(searchTerm);
    await this.verifySuggestedCategoriesAreVisible();
    await this.verifyProductSuggestionsAreVisible();
    await this.verifyViewAllIsVisible();
  }
}
