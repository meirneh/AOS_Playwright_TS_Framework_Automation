import { expect, type Locator, type Page } from '@playwright/test';
import BasePage from './base/BasePage';

export default class LoginPage extends BasePage {
  private readonly accountMenu: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly signInResultMessage: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly loginPopupCloseButton: Locator;
  private readonly signOutButton: Locator;
  private readonly createNewAccountLink: Locator;
  private readonly myAccountLink: Locator;
  private readonly myOrdersLink: Locator;

  constructor(page: Page) {
    super(page);
    this.accountMenu = page.locator('#menuUserLink');
    this.usernameInput = page.locator('[name="username"]');
    this.passwordInput = page.locator('[name="password"]');
    this.signInButton = page.locator('#sign_in_btn');
    this.signInResultMessage = page.locator('#signInResultMessage');
    this.rememberMeCheckbox = page.locator('input[name="remember_me"]');
    this.loginPopupCloseButton = page.locator('.loginPopUpCloseBtn');
    this.signOutButton = page.getByRole('link', { name: 'Sign out' });
    this.createNewAccountLink = page.locator('.create-new-account');
    this.myAccountLink = page
      .locator('#loginMiniTitle')
      .getByRole('link', { name: 'My account', exact: true });
    this.myOrdersLink = page
      .locator('#loginMiniTitle')
      .getByRole('link', { name: 'My orders', exact: true });
  }

  async openLoginForm(): Promise<this> {
    await this.clickElement(this.accountMenu);
    await this.waitForElementVisibility(this.usernameInput);
    return this;
  }

  async verifyLoginFormIsDisplayed(): Promise<this> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    return this;
  }

  async verifyLoginFormIsNotDisplayed(): Promise<this> {
    await expect(this.usernameInput).not.toBeVisible();
    await expect(this.passwordInput).not.toBeVisible();
    return this;
  }

  async verifyRememberMeIsDisplayed(): Promise<this> {
    await expect(this.rememberMeCheckbox).toBeVisible();
    return this;
  }

  async selectRememberMe(): Promise<this> {
    await this.checkElement(this.rememberMeCheckbox);
    return this;
  }

  async verifyRememberMeIsSelected(): Promise<this> {
    await expect(this.rememberMeCheckbox).toBeChecked();
    return this;
  }

  async enterUsername(username: string): Promise<this> {
    await this.fillText(this.usernameInput, username);
    return this;
  }

  async enterPassword(password: string): Promise<this> {
    await this.fillText(this.passwordInput, password);
    return this;
  }

  async verifyLoginCredentialsArePopulated(username: string, password: string): Promise<this> {
    await expect(this.usernameInput).toHaveValue(username);
    await expect(this.passwordInput).toHaveValue(password);
    return this;
  }

  async signIn(): Promise<this> {
    await this.clickElement(this.signInButton);
    return this;
  }

  async signInAs(username: string, password: string): Promise<this> {
    await this.openLoginForm();
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.signIn();
    return this;
  }

  async closeLoginForm(): Promise<this> {
    await this.clickElement(this.loginPopupCloseButton);
    return this;
  }

  async verifyInvalidCredentialsMessageIsDisplayed(): Promise<this> {
    await expect(this.signInResultMessage).toHaveText('Incorrect user name or password.');
    return this;
  }

  async openCreateAccountPage(): Promise<this> {
    await this.clickElement(this.createNewAccountLink);
    return this;
  }

  async verifyUserIsSignedIn(username: string): Promise<this> {
    await expect(this.accountMenu).toContainText(new RegExp(username, 'i'));
    return this;
  }

  async verifyUserIsNotSignedIn(): Promise<this> {
    await expect(this.signOutButton).not.toBeVisible();
    return this;
  }

  async verifyAuthenticatedAccountOptionsAreNotDisplayed(): Promise<this> {
    await expect(this.myAccountLink).not.toBeVisible();
    await expect(this.signOutButton).not.toBeVisible();
    return this;
  }

  async verifyAuthenticatedAccountOptionsAreDisplayed(): Promise<this> {
    await this.clickElement(this.accountMenu);
    await expect(this.myAccountLink).toBeVisible();
    await expect(this.signOutButton).toBeVisible();
    return this;
  }

  async isUserSignedIn(username: string): Promise<boolean> {
    const accountMenuText = await this.accountMenu.innerText().catch(() => '');

    if (accountMenuText.toLowerCase().includes(username.toLowerCase())) {
      return true;
    }

    const myAccountVisible = await this.myAccountLink.isVisible().catch(() => false);
    const signOutVisible = await this.signOutButton.isVisible().catch(() => false);

    if (myAccountVisible && signOutVisible) {
      return true;
    }

    await this.accountMenu.click().catch(() => { });

    const myAccountVisibleAfterOpen = await this.myAccountLink.isVisible().catch(() => false);
    const signOutVisibleAfterOpen = await this.signOutButton.isVisible().catch(() => false);

    return myAccountVisibleAfterOpen && signOutVisibleAfterOpen;
  }

  async openMyAccount(): Promise<this> {
    if (!(await this.myAccountLink.isVisible())) {
      await this.clickElement(this.accountMenu);
    }

    await this.myAccountLink.click({ force: true });
    return this;
  }

  async openMyOrders(): Promise<this> {
    await this.clickElement(this.accountMenu);
    await this.clickElement(this.myOrdersLink);
    return this;
  }

  async signOutIfSignedIn(username: string): Promise<this> {
    const userIsSignedIn = await this.isUserSignedIn(username);

    if (userIsSignedIn) {
      const signOutVisible = await this.signOutButton.isVisible().catch(() => false);

      if (!signOutVisible) {
        await this.clickElement(this.accountMenu);
      }

      await this.clickElement(this.signOutButton);
      await expect(this.signOutButton).not.toBeVisible();
    }

    return this;
  }
}
