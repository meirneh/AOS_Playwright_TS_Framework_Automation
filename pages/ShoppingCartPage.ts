import { expect, type Locator, type Page } from '@playwright/test';
import BasePage from './base/BasePage';
import MiniCartComponent from './components/MiniCartComponent';

export default class ShoppingCartPage extends BasePage {
  private readonly emptyCartMessage: Locator;
  private readonly productRows: Locator;
  private readonly checkoutButton: Locator;
  private readonly homeLink: Locator;
  private readonly miniCartComponent: MiniCartComponent;

  constructor(page: Page) {
    super(page);
    this.emptyCartMessage = page.locator('#shoppingCart [translate="Your_shopping_cart_is_empty"]');
    this.productRows = page.locator('#shoppingCart tr[ng-repeat="product in cart.productsInCart track by $index"]');
    this.checkoutButton = page.locator('#checkOutButton');
    this.homeLink = page.locator('[translate="HOME"]');
    this.miniCartComponent = new MiniCartComponent(page);
  }

  async verifyShoppingCartPageIsDisplayed(): Promise<this> {
    await expect(this.page).toHaveURL(/\/#\/shoppingCart$/);
    return this;
  }

  async verifyEmptyCartMessageIsDisplayed(): Promise<this> {
    await expect(this.emptyCartMessage).toBeVisible();
    return this;
  }

  async verifyCartHasNoProducts(): Promise<this> {
    await expect(this.productRows).toHaveCount(0);
    return this;
  }

  async verifyCheckoutIsNotAvailable(): Promise<this> {
    await expect(this.checkoutButton).not.toBeVisible();
    return this;
  }

  async verifyProductName(expectedProductName: string): Promise<this> {
    const productName = await this.productRows.first().locator('.productName').innerText();
    expect(productName.trim().toLowerCase()).toBe(expectedProductName.trim().toLowerCase());
    return this;
  }

  async verifyProductColor(expectedColor: string): Promise<this> {
    await expect(this.productRows.first().locator('.productColor')).toHaveAttribute('title', expectedColor);
    return this;
  }

  async verifyProductQuantity(expectedQuantity: number): Promise<this> {
    await expect(this.productRows.first().locator('.quantityMobile .ng-binding')).toHaveText(String(expectedQuantity));
    return this;
  }

  async getProductPrice(): Promise<string> {
    const productPrice = await this.productRows.first().locator('.price').innerText();
    return productPrice.trim();
  }

  async navigateToHome(): Promise<this> {
    await this.homeLink.click();
    return this;
  }

  async checkout(): Promise<this> {
    await this.clickElement(this.checkoutButton);
    return this;
  }

  async editProduct(): Promise<this> {
    await this.productRows.first().locator('a.edit').click();
    return this;
  }

  async removeProduct(): Promise<this> {
    await this.productRows.first().locator('a.remove').click();
    return this;
  }

  async removeAllProducts(): Promise<this> {
    await expect.poll(async () => {
      const productCount = await this.productRows.count();
      const isEmptyCartVisible = await this.emptyCartMessage.isVisible();

      return productCount > 0 || isEmptyCartVisible;
    }).toBe(true);

    if (await this.productRows.count() > 0) {
      await this.miniCartComponent.hideMiniCart();
    }

    while (await this.productRows.count() > 0) {
      const currentProductCount = await this.productRows.count();
      const removeButton = this.productRows.first().locator('a.remove');
      const deleteResponsePromise = this.page.waitForResponse((response) =>
        response.request().method() === 'DELETE' &&
        response.url().includes('/order/api/v1/carts/'),
      );

      await removeButton.evaluate((element) => {
        element.scrollIntoView({ block: 'center' });
      });
      await removeButton.click();

      const deleteResponse = await deleteResponsePromise;
      expect(deleteResponse.ok()).toBeTruthy();

      if (currentProductCount === 1) {
        const responseBody = await deleteResponse.json() as { productsInCart?: unknown[] };
        expect(responseBody.productsInCart).toHaveLength(0);
        await expect(this.emptyCartMessage).toBeVisible();
        await expect(this.productRows).toHaveCount(0);
        break;
      }

      await expect(this.productRows).toHaveCount(currentProductCount - 1);
    }

    return this;
  }

  async getCartTotal(): Promise<string> {
    const cartTotal = await this.page.locator('#shoppingCart tfoot span').filter({ hasText: '$' }).first().innerText();
    return cartTotal.trim();
  }
}
