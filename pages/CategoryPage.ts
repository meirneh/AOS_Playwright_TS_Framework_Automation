import { expect, type Locator, type Page } from '@playwright/test';
import BasePage from './base/BasePage';
import { normalizeText } from '../utils/helpers/text-helpers';

export default class CategoryPage extends BasePage {
  private readonly categoryTitle: Locator;
  private readonly products: Locator;

  constructor(page: Page) {
    super(page);
    this.categoryTitle = page.locator('.categoryTitle');
    this.products = page.locator('li[ng-repeat^="product in [] | productsFilterForCategoriesProduct"]');
  }

  async verifyCategoryTitleIsDisplayed(categoryName: string): Promise<this> {
    await expect(this.categoryTitle).toBeVisible();
    await expect(this.categoryTitle).toHaveText(categoryName);
    return this;
  }

  async getProductCount(): Promise<number> {
    return this.countElements(this.products);
  }

  async getProductNameByIndex(index: number): Promise<string> {
    return this.getProductName(this.products.nth(index));
  }

  async verifyAtLeastOneProductIsDisplayed(): Promise<this> {
    await expect(this.products.first()).toBeVisible();
    return this;
  }

  async verifyEachProductContainsBasicInformation(): Promise<this> {
    const productCount = await this.products.count();

    expect(productCount).toBeGreaterThan(0);

    for (let index = 0; index < productCount; index += 1) {
      const product = this.products.nth(index);
      const productName = await this.getProductName(product);
      const productPrice = await this.getProductPrice(product);

      expect(productName.length).toBeGreaterThan(0);
      await expect(product.locator('img').first()).toBeVisible();
      expect(productPrice.length).toBeGreaterThan(0);
    }

    return this;
  }

  async selectProductByIndex(index: number): Promise<this> {
    await this.clickElement(this.products.nth(index));
    return this;
  }

  private async getProductName(product: Locator): Promise<string> {
    const productName = await product.locator('p').filter({ hasNotText: /\$/ }).first().innerText();
    return normalizeText(productName);
  }

  private async getProductPrice(product: Locator): Promise<string> {
    const productPrice = await product.getByText(/\$\s*\d/i).first().innerText();
    return normalizeText(productPrice);
  }
}
