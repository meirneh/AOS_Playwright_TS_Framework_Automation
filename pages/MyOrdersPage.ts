import { expect, type Locator, type Page } from '@playwright/test';
import BasePage from './base/BasePage';

export default class MyOrdersPage extends BasePage {
  private readonly orders: Locator;
  private readonly myOrdersTitle: Locator;
  private readonly emptyOrdersMessage: Locator;
  private readonly continueShoppingLink: Locator;
  private readonly deleteOrderConfirmation: Locator;
  private readonly confirmOrderRemovalButton: Locator;
  private readonly cancelOrderRemovalButton: Locator;

  constructor(page: Page) {
    super(page);
    this.orders = page.locator('tr[data-ng-repeat-start="order in myOrdersCtrl.orders track by $index"]');
    this.myOrdersTitle = page.getByRole('heading', { name: 'MY ORDERS', exact: true });
    this.emptyOrdersMessage = page.getByText('- No orders -', { exact: true });
    this.continueShoppingLink = page.getByRole('link', { name: 'CONTINUE SHOPPING', exact: true });
    this.deleteOrderConfirmation = page.locator('#delete-order-confirmation');
    this.confirmOrderRemovalButton = this.deleteOrderConfirmation.getByText('YES, CANCEL', { exact: true });
    this.cancelOrderRemovalButton = this.deleteOrderConfirmation.getByText('NO, KEEP MY ORDER', { exact: true });
  }

  async verifyMyOrdersPageIsDisplayed(): Promise<this> {
    await expect(this.myOrdersTitle).toBeVisible();
    return this;
  }

  async verifyEmptyOrdersStateIsDisplayed(): Promise<this> {
    await expect(this.emptyOrdersMessage).toBeVisible();
    await expect(this.continueShoppingLink).toBeVisible();
    return this;
  }

  async getOrderCount(): Promise<number> {
    return this.countElements(this.orders);
  }

  async verifyCompletedOrdersAreDisplayed(): Promise<this> {
    await expect.poll(() => this.getOrderCount()).toBeGreaterThan(0);
    await expect(this.orders.first()).toBeVisible();
    return this;
  }

  async verifyFirstCompletedOrderHasIdentifiableInformation(): Promise<this> {
    const cells = this.orders.first().locator(':scope > td');
    const fields = [
      { name: 'Order Number', index: 0 },
      { name: 'Order Date', index: 1 },
      { name: 'Order Time', index: 2 },
      { name: 'Product Name', index: 3 },
      { name: 'Quantity', index: 5 },
      { name: 'Total Price', index: 6 },
    ];

    for (const { name, index } of fields) {
      const cell = cells.nth(index);
      await expect(cell, `${name} should be visible`).toBeVisible();
      await expect(cell, `${name} should contain a value`).toHaveText(/\S/);
      if (name === 'Total Price') {
        await expect(cell).toContainText(/\$\d/);
      }
    }

    return this;
  }

  async verifyFirstCompletedOrderDetails(): Promise<this> {
    await this.verifyFirstCompletedOrderHasIdentifiableInformation();
    const cells = this.orders.first().locator(':scope > td');

    await expect(cells.nth(0), 'Order Number should be numeric').toHaveText(/^\s*\d+\s*$/);
    await expect(cells.nth(1), 'Order Date should use DD/MM/YYYY format').toHaveText(
      /^\s*(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}\s*$/,
    );
    await expect(cells.nth(2), 'Order Time should use H:MM:SS AM/PM or HH:MM:SS AM/PM format').toHaveText(
      /^\s*(0?[1-9]|1[0-2]):[0-5]\d:[0-5]\d\s+(AM|PM)\s*$/,
    );
    await expect(cells.nth(5), 'Quantity should be a positive integer').toHaveText(/^\s*[1-9]\d*\s*$/);
    return this;
  }

  async getFirstOrderNumber(): Promise<string> {
    const orderNumber = this.orders.first().locator(':scope > td').first();
    await expect(orderNumber).toHaveText(/^\s*\d+\s*$/);
    return (await orderNumber.innerText()).trim();
  }

  async removeFirstOrder(): Promise<this> {
    await this.clickElement(this.orders.first().locator('a.remove'));
    return this;
  }

  async verifyDeleteOrderConfirmationIsDisplayed(): Promise<this> {
    await expect(this.deleteOrderConfirmation).toBeVisible();
    return this;
  }

  async confirmOrderRemoval(): Promise<this> {
    await this.clickElement(this.confirmOrderRemovalButton);
    return this;
  }

  async cancelOrderRemoval(): Promise<this> {
    await this.clickElement(this.cancelOrderRemovalButton);
    return this;
  }

  async verifyDeleteOrderConfirmationIsHidden(): Promise<this> {
    await expect(this.deleteOrderConfirmation).toBeHidden();
    return this;
  }

  async verifyOrderIsNotDisplayed(orderNumber: string): Promise<this> {
    await expect.poll(async () => {
      const orderNumbers = await this.orders.locator(':scope > td:first-child').allTextContents();
      return orderNumbers.map((value) => value.trim());
    }).not.toContain(orderNumber);
    return this;
  }

  async verifyOrderIsDisplayed(orderNumber: string): Promise<this> {
    await expect.poll(async () => {
      const orderNumbers = await this.orders.locator(':scope > td:first-child').allTextContents();
      return orderNumbers.map((value) => value.trim());
    }).toContain(orderNumber);
    return this;
  }
}
