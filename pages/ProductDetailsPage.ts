import { expect, type Locator, type Page } from '@playwright/test';
import BasePage from './base/BasePage';
import { normalizeText } from '../utils/helpers/text-helpers';

export default class ProductDetailsPage extends BasePage {
  private readonly productName: Locator;
  private readonly productPrice: Locator;
  private readonly productSpecificationsTitle: Locator;
  private readonly productSpecifications: Locator;
  private readonly mainProductImage: Locator;
  private readonly productImageThumbnails: Locator;
  private readonly productColors: Locator;
  private readonly quantityInput: Locator;
  private readonly decreaseQuantityButton: Locator;
  private readonly increaseQuantityButton: Locator;
  private readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('#Description h1');
    this.productPrice = page.locator('#Description h2').filter({ hasText: '$' }).first();
    this.productSpecificationsTitle = page.locator('.product_specifications');
    this.productSpecifications = page.locator('div[ng-repeat="attr in product_attributes"]');
    this.mainProductImage = page.locator('#mainImg');
    this.productImageThumbnails = page.locator('#coverImages .imageAlias');
    this.productColors = page.locator('.productColor');
    this.quantityInput = page.locator('input[name="quantity"]');
    this.decreaseQuantityButton = page.locator('.e-sec-plus-minus .minus');
    this.increaseQuantityButton = page.locator('.e-sec-plus-minus .plus');
    this.addToCartButton = page.locator('[name="save_to_cart"]');
  }

  async verifyProductDetailsPageIsDisplayed(): Promise<this> {
    await expect(this.page).toHaveURL(/product/i);
    await expect(this.productName).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
    return this;
  }

  async getProductName(): Promise<string> {
    const productName = await this.productName.innerText();
    return normalizeText(productName);
  }

  async verifyProductPriceIsDisplayed(): Promise<this> {
    await expect(this.productPrice).toBeVisible();
    return this;
  }

  async getProductPrice(): Promise<string> {
    const productPrice = await this.productPrice.innerText();
    return normalizeText(productPrice);
  }

  async verifyProductSpecificationsAreDisplayed(): Promise<this> {
    await expect(this.productSpecificationsTitle).toBeVisible();

    const specificationsCount = await this.productSpecifications.count();
    expect(specificationsCount).toBeGreaterThan(0);

    for (let index = 0; index < specificationsCount; index += 1) {
      const specification = this.productSpecifications.nth(index);
      const attributeName = specification.locator('.attr');
      const attributeValue = specification.locator('.value');

      await expect(attributeName).toBeVisible();
      await expect(attributeName).not.toHaveText('');
      await expect(attributeValue).toBeVisible();
      await expect(attributeValue).not.toHaveText('');
    }

    return this;
  }

  async verifyMainProductImageIsDisplayed(): Promise<this> {
    await expect(this.mainProductImage).toBeVisible();
    return this;
  }

  async getProductImageThumbnailsCount(): Promise<number> {
    return this.countElements(this.productImageThumbnails);
  }

  async getMainProductImageSrc(): Promise<string | null> {
    return this.mainProductImage.getAttribute('src');
  }

  async selectProductImageThumbnailByIndex(index: number): Promise<this> {
    await this.clickElement(this.productImageThumbnails.nth(index));
    return this;
  }

  async getProductColorsCount(): Promise<number> {
    return this.countElements(this.productColors);
  }

  async selectProductColor(colorName: string): Promise<this> {
    await this.clickElement(this.productColor(colorName));
    return this;
  }

  async verifyProductColorIsSelected(colorName: string): Promise<this> {
    await expect(this.productColor(colorName)).toHaveClass(/colorSelected/);
    return this;
  }

  async getProductQuantity(): Promise<number> {
    const quantity = await this.quantityInput.inputValue();
    return Number(quantity);
  }

  async increaseProductQuantity(): Promise<this> {
    await this.clickElement(this.increaseQuantityButton);
    return this;
  }

  async decreaseProductQuantity(): Promise<this> {
    await this.clickElement(this.decreaseQuantityButton);
    return this;
  }

  async addToCart(): Promise<this> {
    await this.clickElement(this.addToCartButton);
    return this;
  }

  private productColor(colorName: string): Locator {
    return this.page.locator(`.productColor[title="${colorName}"]:visible`);
  }
}
