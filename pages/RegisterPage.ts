import { expect, type Locator, type Page } from '@playwright/test';
import BasePage from './base/BasePage';

type RegisterUser = {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export default class RegisterPage extends BasePage {
  private readonly createAccountTitle: Locator;
  private readonly usernameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly agreementCheckbox: Locator;
  private readonly registerButton: Locator;
  private readonly alreadyHaveAccountLink: Locator;
  private readonly registrationFailedMessage: Locator;
  private readonly invalidEmailMessage: Locator;
  private readonly usernameAlreadyExistsMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.createAccountTitle = page.getByRole('heading', { name: 'CREATE ACCOUNT' });
    this.usernameInput = page.locator('input[name="usernameRegisterPage"]');
    this.emailInput = page.locator('input[name="emailRegisterPage"]');
    this.passwordInput = page.locator('input[name="passwordRegisterPage"]');
    this.confirmPasswordInput = page.locator('input[name="confirm_passwordRegisterPage"]');
    this.agreementCheckbox = page.locator('input[name="i_agree"]');
    this.registerButton = page.locator('button#register_btn');
    this.alreadyHaveAccountLink = page.getByRole('link', {
      name: 'ALREADY HAVE AN ACCOUNT?',
    });
    this.registrationFailedMessage = page.getByText('Registration failed. Please try again.', {
      exact: true,
    });
    this.invalidEmailMessage = page.getByText('Invalid e-mail address', { exact: true });
    this.usernameAlreadyExistsMessage = page.getByText('User name already exists', {
      exact: true,
    });
  }

  async verifyCreateAccountPageIsDisplayed(): Promise<this> {
    await expect(this.page).toHaveURL(/\/#\/register$/);
    await expect(this.createAccountTitle).toBeVisible();
    return this;
  }

  async verifyMandatoryAccountFieldsAreDisplayed(): Promise<this> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
    return this;
  }

  async verifyRequiredAgreementIsDisplayed(): Promise<this> {
    await expect(this.agreementCheckbox).toBeVisible();
    return this;
  }

  async verifyRequiredAgreementIsNotAccepted(): Promise<this> {
    await expect(this.agreementCheckbox).not.toBeChecked();
    return this;
  }

  async verifyRequiredAgreementIsAccepted(): Promise<this> {
    await expect(this.agreementCheckbox).toBeChecked();
    return this;
  }

  async verifyRegisterButtonIsDisabled(): Promise<this> {
    await expect(this.registerButton).toBeDisabled();
    return this;
  }

  async fillAccountFields(user: RegisterUser): Promise<this> {
    await this.fillText(this.usernameInput, user.username);
    await this.fillText(this.emailInput, user.email);
    await this.fillText(this.passwordInput, user.password);
    await this.fillText(this.confirmPasswordInput, user.confirmPassword ?? user.password);
    return this;
  }

  async verifyAccountFieldsPreserved(user: RegisterUser): Promise<this> {
    await expect(this.usernameInput).toHaveValue(user.username);
    await expect(this.emailInput).toHaveValue(user.email);
    await expect(this.passwordInput).toHaveValue(user.password);
    await expect(this.confirmPasswordInput).toHaveValue(user.confirmPassword ?? user.password);
    return this;
  }

  async fillUsername(username: string): Promise<this> {
    await this.fillText(this.usernameInput, username);
    return this;
  }

  async fillEmail(email: string): Promise<this> {
    await this.fillText(this.emailInput, email);
    return this;
  }

  async fillPassword(password: string): Promise<this> {
    await this.fillText(this.passwordInput, password);
    return this;
  }

  async fillConfirmPassword(confirmPassword: string): Promise<this> {
    await this.fillText(this.confirmPasswordInput, confirmPassword);
    return this;
  }

  async focusConfirmPassword(): Promise<this> {
    await this.clickElement(this.confirmPasswordInput);
    return this;
  }

  async acceptRequiredAgreement(): Promise<this> {
    await this.checkElement(this.agreementCheckbox);
    return this;
  }

  async verifyRegisterButtonIsEnabled(): Promise<this> {
    await expect(this.registerButton).toBeEnabled();
    return this;
  }

  async registerAccount(): Promise<this> {
    await this.clickElement(this.registerButton);
    return this;
  }

  async openLoginFromCreateAccount(): Promise<this> {
    await this.clickElement(this.alreadyHaveAccountLink);
    return this;
  }

  async verifyRegistrationFailedMessageIsDisplayed(): Promise<this> {
    await expect(this.registrationFailedMessage).toBeVisible();
    return this;
  }

  async verifyInvalidEmailMessageIsDisplayed(): Promise<this> {
    await expect(this.invalidEmailMessage).toBeVisible();
    return this;
  }

  async verifyUsernameAlreadyExistsMessageIsDisplayed(): Promise<this> {
    await expect(this.usernameAlreadyExistsMessage).toBeVisible();
    return this;
  }

  async verifyPasswordValidationMessage(message: string): Promise<this> {
    await expect(this.page.getByText(message, { exact: true })).toBeVisible();
    return this;
  }

  async verifyPasswordValidationMessageIsNotDisplayed(): Promise<this> {
    await expect(
      this.page.getByText('Use 4 character or longer', { exact: true }),
    ).not.toBeVisible();
    await expect(
      this.page.getByText('One lower letter required', { exact: true }),
    ).not.toBeVisible();
    await expect(
      this.page.getByText('One upper letter required', { exact: true }),
    ).not.toBeVisible();
    return this;
  }

  async verifyPasswordsDoNotMatchMessageIsDisplayed(): Promise<this> {
    await expect(this.page.getByText('Passwords do not match', { exact: true })).toBeVisible();
    return this;
  }
}
