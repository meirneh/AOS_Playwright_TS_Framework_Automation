import { expect, type Locator, type Page } from '@playwright/test';

export default class MiniCartComponent {
  readonly root: Locator;
  private readonly cartBadge: Locator;
  private readonly miniCart: Locator;
  private readonly addedProductRow: Locator;

  constructor(protected readonly page: Page) {
    this.root = page.locator('#shoppingCartLink');
    this.cartBadge = this.root.locator('span.cart');
    this.miniCart = page.locator('header #toolTipCart');
    this.addedProductRow = this.miniCart.locator('tr#product');
  }

  async openShoppingCart(): Promise<this> {
    await this.root.click();
    return this;
  }

  async showMiniCart(): Promise<this> {
    await this.root.hover();
    return this;
  }

  async hideMiniCart(): Promise<this> {
    await this.page.mouse.move(0, 0);
    await expect(this.miniCart).not.toBeVisible();
    return this;
  }

  async verifyCartBadgeQuantity(expectedQuantity: number): Promise<this> {
    await expect(this.cartBadge).toHaveText(String(expectedQuantity));
    return this;
  }

  async verifyCartBadgeIsNotDisplayed(): Promise<this> {
    await expect(this.cartBadge).not.toBeVisible();
    return this;
  }

  async verifyMiniCartIsDisplayed(): Promise<this> {
    await expect(this.miniCart).toBeVisible();
    return this;
  }

  async removeProduct(): Promise<this> {
    await this.miniCart.locator('.removeProduct').click();
    return this;
  }

  async verifyEmptyCartStateIsDisplayed(): Promise<this> {
    await expect(this.miniCart.getByText('Your shopping cart is empty', { exact: true })).toBeVisible();
    return this;
  }

  async verifyAddedProductName(expectedProductName: string): Promise<this> {
    await expect(this.addedProductRow.getByRole('heading', { name: expectedProductName, exact: false })).toBeVisible();
    return this;
  }

  async verifyAddedProductQuantity(expectedQuantity: number): Promise<this> {
    await expect(this.addedProductRow.getByText(`QTY: ${expectedQuantity}`, { exact: true })).toBeVisible();
    return this;
  }

  async verifyAddedProductColor(expectedColor: string): Promise<this> {
    await expect(this.addedProductRow).toContainText('Color:');
    await expect(this.addedProductRow.getByText(expectedColor, { exact: true })).toBeVisible();
    return this;
  }
}
