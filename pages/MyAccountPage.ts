import { expect, type Locator, type Page } from '@playwright/test';
import BasePage from './base/BasePage';

export default class MyAccountPage extends BasePage {
  private readonly accountContent: Locator;
  private readonly myAccountTitle: Locator;
  private readonly homeBreadcrumb: Locator;
  private readonly accountDetailsSection: Locator;
  private readonly accountDetailsTitle: Locator;
  private readonly shippingDetailsSection: Locator;
  private readonly shippingDetailsTitle: Locator;
  private readonly preferredPaymentMethodSection: Locator;
  private readonly preferredPaymentMethodContainer: Locator;
  private readonly preferredPaymentMethodEditLink: Locator;
  private readonly preferredPaymentMasterCreditRadioButton: Locator;
  private readonly preferredPaymentCardholderNameInput: Locator;
  private readonly notifyAboutPromotionsCheckbox: Locator;
  private readonly promotionalCategoriesTitle: Locator;
  private readonly tabletsPromotionCheckbox: Locator;
  private readonly laptopsPromotionCheckbox: Locator;
  private readonly headphonesPromotionCheckbox: Locator;
  private readonly speakersPromotionCheckbox: Locator;
  private readonly micePromotionCheckbox: Locator;
  private readonly accountDetailsEditLink: Locator;
  private readonly accountDetailsEditTitle: Locator;
  private readonly changePasswordLink: Locator;
  private readonly oldPasswordInput: Locator;
  private readonly newPasswordInput: Locator;
  private readonly confirmNewPasswordInput: Locator;
  private readonly passwordMismatchError: Locator;
  private readonly emailInput: Locator;
  private readonly emailRequiredError: Locator;
  private readonly lastNameInput: Locator;
  private readonly saveButton: Locator;
  private readonly accountUpdatedMessage: Locator;
  private readonly deleteAccountButton: Locator;
  private readonly deleteAccountConfirmation: Locator;
  private readonly cancelAccountDeletionButton: Locator;
  private readonly confirmDeleteAccountButton: Locator;
  private readonly successfulDeleteMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.accountContent = page.locator('article');
    this.myAccountTitle = page.getByRole('heading', { name: 'MY ACCOUNT', exact: true });
    this.homeBreadcrumb = page.locator('nav.pages a[translate="HOME"]');
    this.accountDetailsTitle = page.getByRole('heading', { name: /^Account details\b/i });
    this.accountDetailsSection = page.locator('#myAccountContainer .cube').filter({ has: this.accountDetailsTitle });
    this.shippingDetailsTitle = page.getByRole('heading', { name: 'Shipping details', exact: true });
    this.shippingDetailsSection = page.locator('#myAccountContainer .cube').filter({ has: this.shippingDetailsTitle });
    this.preferredPaymentMethodSection = page.locator(
      '#myAccountContainer .paymentBox[data-ng-show="defaultPaymentMethodId == 20 && masterCredit4Digits != null"]',
    );
    this.preferredPaymentMethodContainer = page
      .locator('#myAccountContainer .cube')
      .filter({
        has: page.locator(
          '.paymentBox[data-ng-show="defaultPaymentMethodId == 20 && masterCredit4Digits != null"]',
        ),
      });
    this.preferredPaymentMethodEditLink = this.preferredPaymentMethodContainer.getByRole('link', {
      name: 'Edit',
      exact: true,
    });
    this.preferredPaymentMasterCreditRadioButton = page.locator('div.imgRadioButton').filter({
      has: page.locator('img[alt="Master credit"]'),
    });
    this.preferredPaymentCardholderNameInput = page.locator('input[name="cardholder_name"]');
    this.notifyAboutPromotionsCheckbox = page.locator('input[name="notify_about_promotions"]');
    this.promotionalCategoriesTitle = page.locator('.categoriesBox').getByText('Categories', { exact: true });
    this.tabletsPromotionCheckbox = page.locator('input[name="category_tablets"]');
    this.laptopsPromotionCheckbox = page.locator('input[name="category_laptops"]');
    this.headphonesPromotionCheckbox = page.locator('input[name="category_headphones"]');
    this.speakersPromotionCheckbox = page.locator('input[name="category_speakers"]');
    this.micePromotionCheckbox = page.locator('input[name="category_mice"]');
    this.accountDetailsEditLink = this.accountDetailsSection.getByRole('link', { name: 'Edit', exact: true });
    this.accountDetailsEditTitle = page.getByRole('heading', { name: 'ACCOUNT DETAILS', exact: true });
    this.changePasswordLink = page.locator('a[translate="Change_Password"]');
    this.oldPasswordInput = page.locator('input[name="old_passwordAccountDetails"]');
    this.newPasswordInput = page.locator('input[name="new_passwordAccountDetails"]');
    this.confirmNewPasswordInput = page.locator('input[name="confirm_new_passwordAccountDetails"]');
    this.passwordMismatchError = page.getByText('New_passwords do not match', { exact: true });
    this.emailInput = page.locator('input[name="emailAccountDetails"]');
    this.emailRequiredError = page.getByText('Email field is required', { exact: true });
    this.lastNameInput = page.locator('input[name="last_nameAccountDetails"]');
    this.saveButton = page.getByRole('button', { name: 'SAVE', exact: true });
    this.accountUpdatedMessage = page.getByText('Account updated successfully', { exact: true });
    this.deleteAccountButton = page.getByRole('button', { name: /delete account/i });
    this.deleteAccountConfirmation = page.locator('#deleteAccountPopup');
    this.cancelAccountDeletionButton = this.deleteAccountConfirmation.locator(
      'div.deletePopupBtn.deleteGreen[ng-click="closeDeleteDialogBox()"]',
    );
    this.confirmDeleteAccountButton = page.locator('div.deletePopupBtn.deleteRed[data-ng-click="deleteAccountConfirmed()"]');
    this.successfulDeleteMessage = page.locator('.successfulDeleteMessage');
  }

  async isDisplayed(): Promise<boolean> {
    return this.isElementVisible(this.accountContent);
  }

  async verifyMyAccountPageIsDisplayed(): Promise<this> {
    await expect(this.myAccountTitle).toBeVisible();
    return this;
  }

  async verifyAccountDetailsSectionIsDisplayed(): Promise<this> {
    await expect(this.accountDetailsSection).toBeVisible();
    await expect(this.accountDetailsTitle).toBeVisible();
    return this;
  }

  async verifyAccountDetailsUsername(expectedUsername: string): Promise<this> {
    await expect(this.accountDetailsSection.getByText(expectedUsername, { exact: true })).toBeVisible();
    return this;
  }

  async verifyShippingDetailsSectionIsDisplayed(): Promise<this> {
    await expect(this.shippingDetailsSection).toBeVisible();
    await expect(this.shippingDetailsTitle).toBeVisible();
    return this;
  }

  async verifyShippingDetailsUsername(expectedUsername: string): Promise<this> {
    await expect(this.shippingDetailsSection.getByText(expectedUsername, { exact: true })).toBeVisible();
    return this;
  }

  async verifyShippingDetailsCountry(expectedCountry: string): Promise<this> {
    await expect(this.shippingDetailsSection.getByText(expectedCountry, { exact: true })).toBeVisible();
    return this;
  }

  async verifyPreferredPaymentMethodSectionIsDisplayed(): Promise<this> {
    await expect(this.preferredPaymentMethodSection).toBeVisible();
    return this;
  }

  async verifyPreferredPaymentMethodType(expectedType: string): Promise<this> {
    await expect(this.preferredPaymentMethodSection.getByText(expectedType, { exact: true })).toBeVisible();
    return this;
  }

  async verifyPreferredPaymentMethodLastFourDigits(expectedLastFourDigits: string): Promise<this> {
    await expect(this.preferredPaymentMethodSection.getByText(expectedLastFourDigits, { exact: true })).toBeVisible();
    return this;
  }

  async openPreferredPaymentMethodEdit(): Promise<this> {
    await this.clickElement(this.preferredPaymentMethodEditLink);
    return this;
  }

  async selectPreferredMasterCredit(): Promise<this> {
    const classAttribute = await this.preferredPaymentMasterCreditRadioButton.getAttribute('class');

    if (!classAttribute?.includes('selected')) {
      await this.clickElement(this.preferredPaymentMasterCreditRadioButton);
    }

    return this;
  }

  async fillPreferredPaymentCardholderName(cardholderName: string): Promise<this> {
    await this.preferredPaymentCardholderNameInput.fill('');

    if (cardholderName) {
      await this.preferredPaymentCardholderNameInput.pressSequentially(cardholderName);
    }

    await this.preferredPaymentCardholderNameInput.blur();
    return this;
  }

  async verifyPreferredPaymentCardholderName(expectedCardholderName: string): Promise<this> {
    await expect(this.preferredPaymentCardholderNameInput).toHaveValue(expectedCardholderName);
    return this;
  }

  async verifyPromotionalPreferencesAreDisplayed(): Promise<this> {
    await expect(this.notifyAboutPromotionsCheckbox).toBeVisible();
    await expect(this.promotionalCategoriesTitle).toBeVisible();
    await expect(this.tabletsPromotionCheckbox).toBeVisible();
    await expect(this.laptopsPromotionCheckbox).toBeVisible();
    await expect(this.headphonesPromotionCheckbox).toBeVisible();
    await expect(this.speakersPromotionCheckbox).toBeVisible();
    await expect(this.micePromotionCheckbox).toBeVisible();
    return this;
  }

  async navigateToHome(): Promise<this> {
    await this.clickElement(this.homeBreadcrumb);
    return this;
  }

  async openAccountDetailsEdit(): Promise<this> {
    await this.clickElement(this.accountDetailsEditLink);
    return this;
  }

  async verifyAccountDetailsEditPageIsDisplayed(): Promise<this> {
    await expect(this.accountDetailsEditTitle).toBeVisible();
    return this;
  }

  async openChangePassword(): Promise<this> {
    await this.clickElement(this.changePasswordLink);
    return this;
  }

  async fillPasswordChange(
    oldPassword: string,
    newPassword: string,
    confirmNewPassword: string = newPassword,
  ): Promise<this> {
    await this.oldPasswordInput.fill('');
    await this.oldPasswordInput.pressSequentially(oldPassword);

    await this.newPasswordInput.fill('');
    await this.newPasswordInput.pressSequentially(newPassword);

    await this.confirmNewPasswordInput.fill('');
    await this.confirmNewPasswordInput.pressSequentially(confirmNewPassword);

    await this.confirmNewPasswordInput.blur();
    return this;
  }

  async verifyPasswordMismatchErrorIsDisplayed(): Promise<this> {
    await expect(this.passwordMismatchError).toBeVisible();
    return this;
  }

  async fillLastName(lastName: string): Promise<this> {
    await this.lastNameInput.fill('');

    if (lastName) {
      await this.lastNameInput.pressSequentially(lastName);
    }

    await this.lastNameInput.blur();
    return this;
  }

  async clearEmail(): Promise<this> {
    await this.emailInput.fill('');
    await this.emailInput.blur();
    return this;
  }

  async verifyEmailRequiredErrorIsDisplayed(): Promise<this> {
    await expect(this.emailRequiredError).toBeVisible();
    return this;
  }

  async verifySaveButtonIsEnabled(): Promise<this> {
    await expect(this.saveButton).toBeEnabled();
    return this;
  }

  async verifySaveButtonIsDisabled(): Promise<this> {
    await expect(this.saveButton).toBeDisabled();
    return this;
  }

  async saveAccountDetails(): Promise<this> {
    await this.clickElement(this.saveButton);
    return this;
  }

  async verifyAccountUpdatedSuccessfullyMessageIsDisplayed(): Promise<this> {
    await expect(this.accountUpdatedMessage).toBeVisible();
    return this;
  }

  async verifyAccountDetailsLastName(expectedLastName: string): Promise<this> {
    await expect(this.accountDetailsSection.getByText(expectedLastName)).toBeVisible();
    return this;
  }

  async openDeleteAccountConfirmation(): Promise<this> {
    await this.clickElement(this.deleteAccountButton);
    return this;
  }

  async verifyDeleteAccountConfirmationIsDisplayed(): Promise<this> {
    await expect(this.deleteAccountConfirmation).toBeVisible();
    return this;
  }

  async cancelAccountDeletion(): Promise<this> {
    await this.clickElement(this.cancelAccountDeletionButton);
    return this;
  }

  async verifyDeleteAccountConfirmationIsHidden(): Promise<this> {
    await expect(this.deleteAccountConfirmation).toBeHidden();
    return this;
  }

  async confirmAccountDeletion(): Promise<this> {
    await this.clickElement(this.confirmDeleteAccountButton);
    return this;
  }

  async deleteAccountAndConfirm(): Promise<this> {
    await this.clickElement(this.deleteAccountButton);
    await this.clickElement(this.confirmDeleteAccountButton);
    return this;
  }

  async verifyAccountDeletedSuccessfullyMessageIsDisplayed(): Promise<this> {
    await expect(this.successfulDeleteMessage).toHaveText('Account deleted successfully');
    return this;
  }
}
