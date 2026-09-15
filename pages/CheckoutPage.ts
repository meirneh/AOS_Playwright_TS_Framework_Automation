import { expect, type Locator, type Page } from '@playwright/test';
import BasePage from './base/BasePage';

export default class CheckoutPage extends BasePage {
  private readonly checkoutContent: Locator;
  private readonly orderPaymentTitle: Locator;
  private readonly orderSummary: Locator;
  private readonly orderSummaryProductName: Locator;
  private readonly orderSummaryQuantity: Locator;
  private readonly orderSummaryColor: Locator;
  private readonly orderSummaryProductPrice: Locator;
  private readonly orderSummaryTotal: Locator;
  private readonly shippingDetailsTab: Locator;
  private readonly paymentMethodTab: Locator;
  private readonly shippingDetailsSection: Locator;
  private readonly editShippingDetailsLink: Locator;
  private readonly nextButton: Locator;
  private readonly paymentMethods: Locator;
  private readonly safePayOption: Locator;
  private readonly masterCreditOption: Locator;
  private readonly safePayUsernameInput: Locator;
  private readonly safePayPasswordInput: Locator;
  private readonly saveSafePayDetailsCheckbox: Locator;
  private readonly safePayNowButton: Locator;
  private readonly masterCreditRadioButton: Locator;
  private readonly masterCreditRadioWrapper: Locator;
  private readonly masterCreditEditButton: Locator;
  private readonly masterCreditCardNumberInput: Locator;
  private readonly masterCreditCvvInput: Locator;
  private readonly masterCreditCvvRequiredError: Locator;
  private readonly masterCreditExpirationMonthSelect: Locator;
  private readonly masterCreditExpirationYearSelect: Locator;
  private readonly masterCreditCardholderNameInput: Locator;
  private readonly saveMasterCreditDetailsCheckbox: Locator;
  private readonly masterCreditPayNowButton: Locator;
  private readonly masterCreditSection: Locator;
  private readonly savedMasterCreditName: Locator;
  private readonly savedMasterCreditEditButton: Locator;
  private readonly orderConfirmationMessage: Locator;
  private readonly trackingNumber: Locator;
  private readonly orderNumber: Locator;
  private readonly confirmationPaymentMethodSection: Locator;
  private readonly confirmationPaymentMethod: Locator;
  private readonly confirmationShippingToSection: Locator;
  private readonly confirmationOrderSummarySection: Locator;
  private readonly confirmationShippingTo: Locator;
  private readonly confirmationSubtotal: Locator;
  private readonly confirmationShipping: Locator;
  private readonly confirmationTotal: Locator;
  private readonly shippingCityInput: Locator;
  private readonly shippingAddressInput: Locator;
  private readonly shippingCountrySelect: Locator;
  private readonly shippingCountry: Locator;
  private readonly shippingDetailsEditMode: Locator;
  private readonly editModeNextButton: Locator;
  private readonly backToShippingDetailsLink: Locator;
  private readonly checkoutUsernameInput: Locator;
  private readonly checkoutPasswordInput: Locator;
  private readonly checkoutLoginButton: Locator;
  private readonly checkoutRegistrationButton: Locator;
  private readonly saveShippingDetailsCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutContent = page.locator('article');
    this.orderPaymentTitle = page.locator('h3[translate="ORDER_PAYMENT"]');
    this.orderSummary = page.locator('#userCart');
    this.orderSummaryProductName = this.orderSummary.locator('h3.ng-binding').first();
    this.orderSummaryQuantity = this.orderSummary.locator('label').filter({ hasText: /QTY:/ }).first();
    this.orderSummaryColor = this.orderSummary.locator('label').filter({ hasText: /Color:/ }).locator('span.ng-binding').first();
    this.orderSummaryProductPrice = this.orderSummary.locator('p.price').first();
    this.orderSummaryTotal = this.orderSummary.locator('.totalValue').first();
    this.shippingDetailsTab = page.locator('#detailslink').locator('label').filter({ hasText: '1. SHIPPING DETAILS' }).first();
    this.paymentMethodTab = page.locator('#detailslink').locator('label').filter({ hasText: '2. PAYMENT METHOD' }).first();
    this.shippingDetailsSection = page.locator('#userSection');
    this.editShippingDetailsLink = page.locator('a[translate="Edit_shipping_Details"]');
    this.nextButton = page.locator('#next_btn[data-ng-click="shippingDetails_next()"]');
    this.paymentMethods = page.locator('.paymentMethods');
    this.safePayOption = this.paymentMethods.locator('img[alt="Safepay"]');
    this.masterCreditOption = this.paymentMethods.locator('img[alt="Master credit"]');
    this.safePayUsernameInput = page.locator('input[name="safepay_username"]');
    this.safePayPasswordInput = page.locator('input[name="safepay_password"]');
    this.saveSafePayDetailsCheckbox = page.locator('input[name="save_safepay"]');
    this.safePayNowButton = page.locator('#pay_now_btn_SAFEPAY');
    this.masterCreditRadioButton = page.locator('input[name="masterCredit"]');
    this.masterCreditRadioWrapper = page.locator('.imgRadioButton').filter({
      has: page.locator('input[name="masterCredit"]'),
    });
    this.masterCreditEditButton = page.locator('label[translate="Edit"][data-ng-click="toggleShowMasterCart()"]');
    this.masterCreditCardNumberInput = page.locator('#creditCard');
    this.masterCreditCvvInput = page.locator('input[name="cvv_number"]');
    this.masterCreditCvvRequiredError = page.locator('input[name="cvv_number"] + label.invalid');
    this.masterCreditExpirationMonthSelect = page.locator('select[name="mmListbox"]');
    this.masterCreditExpirationYearSelect = page.locator('select[name="yyyyListbox"]');
    this.masterCreditCardholderNameInput = page.locator('input[name="cardholder_name"]');
    this.saveMasterCreditDetailsCheckbox = page.locator('input[name="save_master_credit"]');
    this.masterCreditPayNowButton = page.locator('#pay_now_btn_ManualPayment');
    this.masterCreditSection = page.locator('.masterCreditSeccion');
    this.savedMasterCreditName = this.masterCreditSection.locator('.MasterCredit');
    this.savedMasterCreditEditButton = this.masterCreditSection.locator('label[translate="Edit"][data-ng-click="toggleShowMasterCart()"]');
    this.orderConfirmationMessage = page.locator('[translate="Thank_you_for_buying_with_Advantage"]');
    this.trackingNumber = page.locator('#trackingNumberLabel');
    this.orderNumber = page.locator('#orderNumberLabel');
    this.confirmationPaymentMethodSection = page.locator('div:has(> span[translate="Payment_Method"])');
    this.confirmationPaymentMethod = this.confirmationPaymentMethodSection.locator('.innerSeccion label');
    this.confirmationShippingToSection = page.locator('div:has(> span[translate="Shipping_to"])');
    this.confirmationOrderSummarySection = page.locator('div:has(> span[translate="Order_Summary"])');
    this.confirmationShippingTo = this.confirmationShippingToSection
      .locator('.innerSeccion')
      .first()
      .locator('label.ng-binding');
    this.confirmationSubtotal = this.confirmationOrderSummarySection
      .locator('.innerSeccion label')
      .filter({ hasText: 'Subtotal' })
      .locator('a.floater');
    this.confirmationShipping = this.confirmationOrderSummarySection
      .locator('.innerSeccion label')
      .filter({ hasText: 'shipping' })
      .locator('a.floater');
    this.confirmationTotal = this.confirmationOrderSummarySection.locator('label.total a.floater');
    this.shippingDetailsEditMode = page.locator('#userDetailsEditMode');
    this.shippingCityInput = page.locator('input[name="city"]');
    this.shippingAddressInput = page.locator('input[name="address"]');
    this.shippingCountrySelect = this.shippingDetailsEditMode.locator('select').first();
    this.shippingCountry = page.locator('#userDetails label[data-ng-show*="country.name"]');
    this.editModeNextButton = this.shippingDetailsEditMode.locator('#next_btn');
    this.backToShippingDetailsLink = page.getByRole('link', { name: 'Back to shipping details' });
    this.checkoutUsernameInput = page.locator('input[name="usernameInOrderPayment"]');
    this.checkoutPasswordInput = page.locator('input[name="passwordInOrderPayment"]');
    this.checkoutLoginButton = page.locator('#login_btn');
    this.checkoutRegistrationButton = page.locator('#registration_btn');
    this.saveShippingDetailsCheckbox = page.locator('input[name="agree_agreement"]');
  }

  async isDisplayed(): Promise<boolean> {
    return this.isElementVisible(this.checkoutContent);
  }

  async verifyOrderPaymentIsDisplayed(): Promise<this> {
    await this.waitForElementVisibility(this.orderPaymentTitle);
    return this;
  }

  async verifyOrderSummaryContainsProduct(expectedProductName: string): Promise<this> {
    await this.waitForElementVisibility(this.orderSummary);
    const orderSummaryText = await this.orderSummary.innerText();
    expect(orderSummaryText.trim().toLowerCase()).toContain(expectedProductName.trim().toLowerCase());
    return this;
  }

  async verifyAuthenticationIsRequired(): Promise<this> {
    await this.waitForElementVisibility(this.checkoutUsernameInput);
    await this.waitForElementVisibility(this.checkoutPasswordInput);
    await this.waitForElementVisibility(this.checkoutLoginButton);
    await this.waitForElementVisibility(this.checkoutRegistrationButton);
    return this;
  }

  async enterCheckoutUsername(username: string): Promise<this> {
    await this.fillText(this.checkoutUsernameInput, username);
    return this;
  }

  async enterCheckoutPassword(password: string): Promise<this> {
    await this.fillText(this.checkoutPasswordInput, password);
    return this;
  }

  async loginFromCheckout(): Promise<this> {
    await this.clickElement(this.checkoutLoginButton);
    await this.waitForElementVisibility(this.shippingDetailsTab, 15000);
    return this;
  }
  async verifyOrderSummaryProductName(expectedProductName: string): Promise<this> {
    const productName = await this.orderSummaryProductName.innerText();
    expect(productName.trim().toLowerCase()).toBe(expectedProductName.trim().toLowerCase());
    return this;
  }

  async verifyOrderSummaryQuantity(expectedQuantity: number): Promise<this> {
    await expect(this.orderSummaryQuantity).toContainText(`QTY: ${expectedQuantity}`);
    return this;
  }

  async verifyOrderSummaryColor(expectedColor: string): Promise<this> {
    await expect(this.orderSummaryColor).toHaveText(new RegExp(`^${expectedColor}$`, 'i'));
    return this;
  }

  async getOrderSummaryProductPrice(): Promise<string> {
    const productPrice = await this.orderSummaryProductPrice.innerText();
    return productPrice.trim();
  }

  async getOrderSummaryTotal(): Promise<string> {
    const total = await this.orderSummaryTotal.innerText();
    return total.trim();
  }

  async verifyShippingDetailsStepIsActive(): Promise<this> {
    await this.waitForElementVisibility(this.shippingDetailsTab);
    await expect(this.shippingDetailsTab).toHaveClass(/selected/);
    return this;
  }

  async verifyPaymentMethodStepIsNotActive(): Promise<this> {
    await this.waitForElementVisibility(this.paymentMethodTab);
    await expect(this.paymentMethodTab).not.toHaveClass(/selected/);
    return this;
  }

  async verifyShippingDetailsAreDisplayed(): Promise<this> {
    await this.waitForElementVisibility(this.shippingDetailsSection);
    await this.waitForElementVisibility(this.editShippingDetailsLink);
    await this.waitForElementVisibility(this.nextButton);
    return this;
  }

  async openShippingDetailsEditMode(): Promise<this> {
    await this.clickElement(this.editShippingDetailsLink);
    await this.waitForElementVisibility(this.shippingCityInput);
    return this;
  }

  async enterShippingCity(city: string): Promise<this> {
    await this.fillText(this.shippingCityInput, city);
    return this;
  }

  async enterShippingAddress(address: string): Promise<this> {
    await this.fillText(this.shippingAddressInput, address);
    return this;
  }

  async enableSaveShippingDetailsForFutureUse(): Promise<this> {
    if (!(await this.saveShippingDetailsCheckbox.isChecked())) {
      await this.checkElement(this.saveShippingDetailsCheckbox);
    }
    return this;
  }

  async clearShippingCountry(): Promise<this> {
    await this.selectOption(this.shippingCountrySelect, { value: '' });
    return this;
  }

  async selectShippingCountry(countryName: string): Promise<this> {
    await this.selectOption(this.shippingCountrySelect, { label: countryName });
    return this;
  }

  async verifyShippingCountry(expectedCountry: string): Promise<this> {
    await expect(this.shippingCountry).toHaveText(expectedCountry);
    return this;
  }

  async getShippingCity(): Promise<string> {
    return this.getElementInputValue(this.shippingCityInput);
  }

  async getShippingAddress(): Promise<string> {
    return this.getElementInputValue(this.shippingAddressInput);
  }

  async continueFromShippingDetailsEditMode(): Promise<this> {
    await this.clickElement(this.editModeNextButton);
    return this;
  }

  async verifyShippingDetailsEditModeIsDisplayed(): Promise<this> {
    await this.waitForElementVisibility(this.shippingDetailsEditMode);
    return this;
  }

  async verifyPaymentMethodStepIsActive(): Promise<this> {
    await this.waitForElementVisibility(this.paymentMethodTab);
    await expect(this.paymentMethodTab).toHaveClass(/selected/);
    return this;
  }

  async continueFromShippingDetails(): Promise<this> {
    await this.clickElement(this.nextButton);
    return this;
  }

  async backToShippingDetails(): Promise<this> {
    await this.clickElement(this.backToShippingDetailsLink);
    await this.verifyShippingDetailsStepIsActive();
    return this;
  }

  async verifyPaymentMethodsAreDisplayed(): Promise<this> {
    await this.waitForElementVisibility(this.paymentMethods);
    await this.waitForElementVisibility(this.safePayOption);
    await this.waitForElementVisibility(this.masterCreditOption);
    return this;
  }

  async disableSaveShippingDetailsForFutureUse(): Promise<this> {
    if (await this.saveShippingDetailsCheckbox.isChecked()) {
      await this.saveShippingDetailsCheckbox.uncheck();
    }
    return this;
  }

  async enterSafePayUsername(username: string): Promise<this> {
    await this.fillText(this.safePayUsernameInput, username);
    return this;
  }

  async enterSafePayPassword(password: string): Promise<this> {
    await this.fillText(this.safePayPasswordInput, password);
    return this;
  }

  async disableSaveSafePayDetailsForFutureUse(): Promise<this> {
    if (await this.saveSafePayDetailsCheckbox.isChecked()) {
      await this.saveSafePayDetailsCheckbox.uncheck();
    }
    return this;
  }

  async verifySafePayNowIsEnabled(): Promise<this> {
    await expect(this.safePayNowButton).toBeEnabled();
    return this;
  }

  async payNowWithSafePay(): Promise<this> {
    await this.clickElement(this.safePayNowButton);
    await expect(this.orderConfirmationMessage).toBeVisible();
    return this;
  }

  async selectMasterCredit(): Promise<this> {
    await this.masterCreditRadioButton.check();
    return this;
  }

  async openMasterCreditEditModeIfNeeded(): Promise<this> {
    if (!(await this.masterCreditCardNumberInput.isVisible()) && await this.masterCreditEditButton.isVisible()) {
      await this.clickElement(this.masterCreditEditButton);
    }

    await this.waitForElementVisibility(this.masterCreditCardNumberInput);
    return this;
  }

  async enterMasterCreditCardNumber(cardNumber: string): Promise<this> {
    await this.masterCreditCardNumberInput.click();
    await this.masterCreditCardNumberInput.clear();
    await this.masterCreditCardNumberInput.pressSequentially(cardNumber);
    return this;
  }

  async enterMasterCreditCvv(cvv: string): Promise<this> {
    await expect(async () => {
      await this.masterCreditCvvInput.click();
      await this.masterCreditCvvInput.clear();
      await this.masterCreditCvvInput.pressSequentially(cvv);

      expect(await this.masterCreditCvvInput.inputValue()).toBe(cvv);
    }).toPass();

    return this;
  }

  async clearMasterCreditCvv(): Promise<this> {
    await this.masterCreditCvvInput.click();
    await this.masterCreditCvvInput.clear();
    await this.masterCreditCvvInput.press('Tab');
    return this;
  }

  async selectMasterCreditExpirationMonth(expirationMonth: string): Promise<this> {
    await this.selectOption(this.masterCreditExpirationMonthSelect, expirationMonth);
    return this;
  }

  async selectMasterCreditExpirationYear(expirationYear: string): Promise<this> {
    await this.selectOption(this.masterCreditExpirationYearSelect, expirationYear);
    return this;
  }

  async enterMasterCreditCardholderName(cardholderName: string): Promise<this> {
    await this.fillText(this.masterCreditCardholderNameInput, cardholderName);
    return this;
  }

  async enableSaveMasterCreditDetailsForFutureUse(): Promise<this> {
    if (!(await this.saveMasterCreditDetailsCheckbox.isChecked())) {
      await this.checkElement(this.saveMasterCreditDetailsCheckbox);
    }
    return this;
  }

  async verifyMasterCreditPayNowIsEnabled(): Promise<this> {
    await expect(this.masterCreditPayNowButton).toBeEnabled();
    return this;
  }

  async verifyMasterCreditPayNowIsDisabled(): Promise<this> {
    await expect(this.masterCreditPayNowButton).toBeDisabled();
    return this;
  }

  async verifyMasterCreditCvvRequiredErrorIsDisplayed(): Promise<this> {
    await expect(this.masterCreditCvvRequiredError).toHaveText('CVV number field is required');
    return this;
  }

  async payNowWithMasterCredit(): Promise<this> {
    await this.clickElement(this.masterCreditPayNowButton);
    await expect(this.orderConfirmationMessage).toBeVisible();
    return this;
  }

  async saveMasterCreditForFutureUse(): Promise<this> {
    const saveMasterCreditResponsePromise = this.page.waitForResponse((response) => {
      const request = response.request();
      const url = response.url();

      return request.method() === 'POST' &&
        (
          url.includes('/AddMasterCreditMethodRequest') ||
          url.includes('/UpdateMasterCreditMethodRequest')
        );
    });

    await this.clickElement(this.masterCreditPayNowButton);

    const saveMasterCreditResponse = await saveMasterCreditResponsePromise;
    expect(saveMasterCreditResponse.ok()).toBeTruthy();
    return this;
  }

  async verifyMasterCreditIsSelected(): Promise<this> {
    await expect(this.masterCreditRadioWrapper).toHaveClass(/selected/);
    return this;
  }

  async verifySavedMasterCreditIsDisplayed(): Promise<this> {
    await expect(this.masterCreditSection).toBeVisible();
    await expect(this.savedMasterCreditName).toBeVisible();
    await expect(this.savedMasterCreditEditButton).toBeVisible();
    return this;
  }

  async verifyOrderConfirmationIsDisplayed(): Promise<this> {
    await expect(this.orderConfirmationMessage).toBeVisible();
    return this;
  }

  async verifyTrackingNumberIsGenerated(): Promise<this> {
    await this.verifyGeneratedNumericValue(this.trackingNumber);
    return this;
  }

  async verifyOrderNumberIsGenerated(): Promise<this> {
    await this.verifyGeneratedNumericValue(this.orderNumber);
    return this;
  }

  async verifyConfirmationPaymentMethod(expectedPaymentMethod: string): Promise<this> {
    await expect(this.confirmationPaymentMethod.filter({ hasText: expectedPaymentMethod })).toContainText(expectedPaymentMethod);
    return this;
  }

  async verifyConfirmationShippingTo(expectedUsername: string): Promise<this> {
    await expect(this.confirmationShippingTo).toHaveText(expectedUsername);
    return this;
  }

  async verifyConfirmationSubtotal(expectedSubtotal: string): Promise<this> {
    await expect(this.confirmationSubtotal).toHaveText(expectedSubtotal);
    return this;
  }

  async verifyConfirmationShipping(expectedShipping: string): Promise<this> {
    await expect(this.confirmationShipping).toHaveText(expectedShipping);
    return this;
  }

  async verifyConfirmationTotal(expectedTotal: string): Promise<this> {
    await expect(this.confirmationTotal).toHaveText(expectedTotal);
    return this;
  }

  private async verifyGeneratedNumericValue(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
    const value = (await locator.innerText()).trim();

    expect(value).not.toBe('');
    expect(value).toMatch(/^\d+$/);
  }
}
