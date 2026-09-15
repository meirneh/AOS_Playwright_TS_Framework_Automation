import { expect, type Locator, type Page } from '@playwright/test';
import BasePage from './base/BasePage';
import { normalizeText } from '../utils/helpers/text-helpers';

export default class SearchResultsPage extends BasePage {
  private readonly searchPage: Locator;
  private readonly searchResultsTitle: Locator;
  private readonly noResultsMessage: Locator;
  private readonly resultCards: Locator;

  constructor(page: Page) {
    super(page);
    this.searchPage = page.locator('#searchPage');
    this.searchResultsTitle = page.getByText(/SEARCH RESULT/i).first();
    this.noResultsMessage = this.searchPage.locator('.noProducts');
    this.resultCards = this.searchPage.locator('ul li').filter({
      has: page.locator('img'),
      hasText: /\$/i,
    });
  }

  async getResultCount(): Promise<number> {
    return this.countElements(this.resultCards);
  }

  async getProductNames(): Promise<string[]> {
    const resultCount = await this.resultCards.count();
    const productNames: string[] = [];

    for (let index = 0; index < resultCount; index += 1) {
      productNames.push(await this.getProductName(index));
    }

    return productNames;
  }

  async getProductName(index = 0): Promise<string> {
    const resultCard = this.resultCards.nth(index);
    await expect(resultCard).toBeVisible();
    return this.getProductNameFromCard(resultCard);
  }

  async applyCategoryFilter(categoryName: string): Promise<this> {
    const initialResultCount = await this.getResultCount();
    // AOS uses a custom-styled checkbox, so the underlying input requires a forced check.
    await this.categoryFilterCheckbox(categoryName).check({ force: true });
    await this.waitForResultsCountToChange(initialResultCount);
    return this;
  }

  async isCategoryFilterSelected(categoryName: string): Promise<boolean> {
    return this.categoryFilterCheckbox(categoryName).isChecked();
  }

  async openProduct(index = 0): Promise<this> {
    const resultCard = this.resultCards.nth(index);
    await expect(resultCard).toBeVisible();
    await this.clickElement(resultCard.locator('a').first());
    return this;
  }

  async verifySearchResultsPageIsDisplayed(): Promise<this> {
    await expect(this.page).toHaveURL(/search/i);
    await expect(this.searchResultsTitle).toBeVisible();
    return this;
  }

  async verifyAtLeastOneResultIsDisplayed(): Promise<this> {
    await expect(this.resultCards.first()).toBeVisible();
    return this;
  }

  async verifyNoResultsMessageIsDisplayed(searchTerm: string): Promise<this> {
    await expect(this.noResultsMessage).toBeVisible();
    await expect(this.noResultsMessage).toContainText(`No results for "${searchTerm}"`);
    return this;
  }

  async verifyResultsMatchSearchTerm(searchTerm: string): Promise<this> {
    const resultCount = await this.resultCards.count();
    const normalizedSearchTerm = normalizeText(searchTerm).toLowerCase();

    expect(resultCount).toBeGreaterThan(0);

    for (let index = 0; index < resultCount; index += 1) {
      const productName = await this.getProductNameFromCard(this.resultCards.nth(index));
      expect(productName.toLowerCase()).toContain(normalizedSearchTerm);
    }

    return this;
  }

  async verifyEachResultContainsBasicProductInformation(): Promise<this> {
    const resultCount = await this.resultCards.count();

    expect(resultCount).toBeGreaterThan(0);

    for (let index = 0; index < resultCount; index += 1) {
      const resultCard = this.resultCards.nth(index);
      const productName = await this.getProductNameFromCard(resultCard);
      const productPrice = await this.getProductPrice(resultCard);

      expect(productName.length).toBeGreaterThan(0);
      await expect(resultCard.locator('img').first()).toBeVisible();
      expect(productPrice.length).toBeGreaterThan(0);
    }

    return this;
  }

  private async getProductNameFromCard(resultCard: Locator): Promise<string> {
    const productName = await resultCard.locator('p').filter({ hasNotText: /\$/ }).first().innerText();
    return normalizeText(productName);
  }

  private async getProductPrice(resultCard: Locator): Promise<string> {
    const productPrice = await resultCard.getByText(/\$\s*\d/i).first().innerText();
    return normalizeText(productPrice);
  }

  private categoryFilterCheckbox(categoryName: string): Locator {
    return this.searchPage
      .locator('[ng-repeat="categ in categoriesFilter"]')
      .filter({ hasText: categoryName })
      .locator('input[name="category"]')
      .first();
  }

  private async waitForResultsCountToChange(initialResultCount: number): Promise<void> {
    await expect
      .poll(async () => this.getResultCount())
      .not.toBe(initialResultCount);
  }
}
