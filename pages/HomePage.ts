import { expect, type Locator, type Page } from '@playwright/test';
import BasePage from './base/BasePage';
import SearchComponent from './components/SearchComponent';

export default class HomePage extends BasePage {
  private readonly pageContent: Locator;
  private readonly header: Locator;
  private readonly searchComponent: SearchComponent;
  private readonly searchOption: Locator;
  private readonly searchTextbox: Locator;
  private readonly searchBoxContainer: Locator;
  private readonly searchCloseButton: Locator;
  private readonly searchResultsArea: Locator;
  private readonly cartOption: Locator;
  private readonly accountOption: Locator;
  private readonly ourProductsNavigationOption: Locator;
  private readonly contactUsNavigationOption: Locator;
  private readonly mainNavigationOptions: Locator[];
  private readonly ourProductsSection: Locator;
  private readonly contactUsSection: Locator;
  private readonly contactUsArticle: Locator;
  private readonly contactUsCategorySelect: Locator;
  private readonly contactUsProductSelect: Locator;
  private readonly contactUsEmailTextbox: Locator;
  private readonly contactUsSubjectTextbox: Locator;
  private readonly contactUsSendButton: Locator;
  private readonly goUpOption: Locator;
  private readonly loginPopup: Locator;
  private readonly specialOfferSection: Locator;
  private readonly popularItemsSection: Locator;
  private readonly footer: Locator;
  private readonly footerFollowUsText: Locator;
  private readonly footerFacebookLink: Locator;
  private readonly footerTwitterLink: Locator;
  private readonly footerLinkedInLink: Locator;
  private readonly loadingSpinner: Locator;
  private readonly headerNavigationOptionNames = ['CONTACT US', 'POPULAR ITEMS', 'SPECIAL OFFER', 'OUR PRODUCTS'] as const;
  private readonly productCategoryNames = ['SPEAKERS', 'TABLETS', 'LAPTOPS', 'MICE', 'HEADPHONES'] as const;

  constructor(page: Page) {
    super(page);
    this.pageContent = page.locator('body');
    this.header = page.locator('header, nav, #menuMain').first();
    this.searchComponent = new SearchComponent(page);
    this.searchOption = page.getByTitle('SEARCH');
    this.searchTextbox = page.locator('#autoComplete');
    this.searchBoxContainer = page.locator('.autoCompleteCover');
    this.searchCloseButton = page.locator('[data-ng-click="closeSearchForce()"]');
    this.searchResultsArea = page.getByText(/SEARCH RESULT/i).first();
    this.cartOption = page.locator('#shoppingCartLink');
    this.accountOption = page.locator('#menuUserLink');
    this.ourProductsNavigationOption = this.header.getByText(/^OUR PRODUCTS$/i).first();
    this.contactUsNavigationOption = this.header.getByText(/^CONTACT US$/i).first();
    this.mainNavigationOptions = this.headerNavigationOptionNames.map((optionName) =>
      this.header.getByText(new RegExp(`^${optionName}$`, 'i')).first(),
    );
    this.ourProductsSection = page.getByText('OUR PRODUCTS', { exact: true });
    this.contactUsSection = page.getByRole('heading', { name: 'CONTACT US' });
    this.contactUsArticle = page.locator('article').filter({ has: this.contactUsSection });
    this.contactUsCategorySelect = page.getByRole('listbox').filter({ hasText: 'Select Category' });
    this.contactUsProductSelect = page.getByRole('listbox').filter({ hasText: 'Select Product' });
    this.contactUsEmailTextbox = this.contactUsArticle.getByRole('textbox').nth(0);
    this.contactUsSubjectTextbox = this.contactUsArticle.getByRole('textbox').nth(1);
    this.contactUsSendButton = page.getByRole('button', { name: /^SEND$/i });
    this.goUpOption = page.getByText(/^GO UP$/i);
    this.loginPopup = page.locator('#loginMiniTitle, login-modal, .loginPopUp, #loginMiniForm').first();
    this.specialOfferSection = page.getByText(/SPECIAL OFFERS?/i).first();
    this.popularItemsSection = page.getByText(/POPULAR ITEMS/i).first();
    this.footer = page.locator('footer');
    this.footerFollowUsText = this.footer.getByText(/FOLLOW US/i);
    this.footerFacebookLink = this.footer.locator('[class*="facebook"], [href*="facebook"]');
    this.footerTwitterLink = this.footer.locator('[class*="twitter"], [href*="twitter"]');
    this.footerLinkedInLink = this.footer.locator('[class*="linkedin"], [href*="linkedin"]');
    this.loadingSpinner = page.locator('.loader').first();
  }

  async open(): Promise<this> {
    await this.navigateTo('/');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
    await this.waitForElementVisibility(this.pageContent, 15000);
    return this;
  }

  async verifyHeaderIsVisible(): Promise<this> {
    await expect(this.header).toBeVisible({ timeout: 15000 });
    return this;
  }

  async verifySearchOptionIsVisible(): Promise<this> {
    await this.waitForElementVisibility(this.searchOption);
    return this;
  }

  async openSearchBoxFromHeader(): Promise<this> {
    await this.clickElement(this.searchOption);
    return this;
  }

  async verifySearchBoxIsVisible(): Promise<this> {
    await this.waitForElementVisibility(this.searchTextbox);
    return this;
  }

  async closeSearchBox(): Promise<this> {
    await this.searchTextbox.waitFor({ state: 'visible' });
    // Synchronization workaround.
    // AOS Search Box ignores the close action immediately after opening.
    // 750 ms was determined experimentally during TC-008 RCA
    // and validated through repeated UI and CMD executions.
    await this.page.waitForTimeout(750);
    await this.searchCloseButton.click();
    await this.verifySearchBoxIsClosed();
    return this;
  }

  async verifySearchBoxIsNotVisible(): Promise<this> {
    await this.verifySearchBoxIsClosed();
    return this;
  }

  private async verifySearchBoxIsClosed(): Promise<void> {
    // AOS keeps the search input in the DOM after closing.
    // The visual closed state is represented by the autocomplete cover width collapsing to zero.
    await expect
      .poll(async () => this.searchBoxContainer.evaluate((element) => element.getBoundingClientRect().width))
      .toBeLessThanOrEqual(1);
  }

  async verifySearchResultsAreNotDisplayed(): Promise<this> {
    await expect(this.searchResultsArea).toBeHidden();
    return this;
  }

  async fillSearchBox(searchTerm: string): Promise<this> {
    await this.searchComponent.fillSearchBox(searchTerm);
    return this;
  }

  async typeSearchBox(searchTerm: string): Promise<this> {
    await this.searchComponent.typeSearchBox(searchTerm);
    return this;
  }

  async clearSearchBoxWithBackspace(): Promise<this> {
    await this.searchComponent.clearSearchBoxWithBackspace();
    return this;
  }

  async verifySearchBoxValue(searchTerm: string): Promise<this> {
    await this.searchComponent.verifySearchBoxValue(searchTerm);
    return this;
  }

  async submitSearch(): Promise<this> {
    await this.searchComponent.submitSearch();
    return this;
  }

  async verifySuggestionsPanelIsVisible(searchTerm: string): Promise<this> {
    await this.searchComponent.verifySuggestionsPanelIsVisible(searchTerm);
    return this;
  }

  async verifySuggestionsPanelIsNotVisible(): Promise<this> {
    await this.searchComponent.verifySuggestionsPanelIsNotVisible();
    return this;
  }

  async verifyProductSuggestionsAreVisible(): Promise<this> {
    await this.searchComponent.verifyProductSuggestionsAreVisible();
    return this;
  }

  async verifySuggestedCategoriesAreVisible(): Promise<this> {
    await this.searchComponent.verifySuggestedCategoriesAreVisible();
    return this;
  }

  async verifySuggestionsContain(text: string): Promise<this> {
    await this.searchComponent.verifySuggestionsContain(text);
    return this;
  }

  async verifyTopResultsTitleIsVisible(searchTerm: string): Promise<this> {
    await this.searchComponent.verifyTopResultsTitleIsVisible(searchTerm);
    return this;
  }

  async verifyViewAllIsVisible(): Promise<this> {
    await this.searchComponent.verifyViewAllIsVisible();
    return this;
  }

  async verifyCartOptionIsVisible(): Promise<this> {
    await this.waitForElementVisibility(this.cartOption);
    return this;
  }

  async verifyAccountOptionIsVisible(): Promise<this> {
    await this.waitForElementVisibility(this.accountOption);
    return this;
  }

  async verifyMainNavigationOptionsAreVisible(): Promise<this> {
    for (const mainNavigationOption of this.mainNavigationOptions) {
      await this.waitForElementVisibility(mainNavigationOption);
    }

    return this;
  }

  async navigateToOurProductsSection(): Promise<this> {
    await this.clickElement(this.ourProductsNavigationOption);
    return this;
  }

  async navigateToContactUsSection(): Promise<this> {
    await this.clickElement(this.contactUsNavigationOption);
    return this;
  }

  async verifyOurProductsSectionIsVisible(): Promise<this> {
    await this.waitForElementVisibility(this.ourProductsSection);
    return this;
  }

  async verifyContactUsSectionIsVisible(): Promise<this> {
    await this.waitForElementVisibility(this.contactUsSection);
    return this;
  }

  async verifyContactUsFormIsVisible(): Promise<this> {
    await this.waitForElementVisibility(this.contactUsCategorySelect);
    await this.waitForElementVisibility(this.contactUsProductSelect);
    await this.waitForElementVisibility(this.contactUsEmailTextbox);
    await this.waitForElementVisibility(this.contactUsSubjectTextbox);
    await this.waitForElementVisibility(this.contactUsSendButton);
    return this;
  }

  async clickGoUp(): Promise<this> {
    await this.clickElement(this.goUpOption);
    return this;
  }

  async verifyUserIsAtTopOfHomePage(): Promise<this> {
    await expect
      .poll(async () => this.page.evaluate(() => window.scrollY), {
        timeout: 5000,
      })
      .toBeLessThanOrEqual(5);
    return this;
  }

  async verifyUserRemainsOnHomePage(): Promise<this> {
    await expect(this.page).toHaveURL(/\/(?:#.*)?$/);
    return this;
  }

  async verifyLoginPopupIsNotVisible(): Promise<this> {
    await expect(this.loginPopup).toBeHidden();
    return this;
  }

  async verifyProductCategoriesAreVisible(): Promise<this> {
    await expect(this.page.getByText('OUR PRODUCTS', { exact: true })).toBeVisible();
    return this;
  }

  async selectProductCategory(categoryName: string): Promise<this> {
    await this.clickElement(this.productCategory(categoryName));
    return this;
  }

  async verifyLoadingSpinnerCycle(): Promise<this> {
    await expect(this.loadingSpinner).toBeVisible();
    await expect(this.loadingSpinner).toBeHidden();
    return this;
  }

  async verifyMainHomeSectionsAreVisible(): Promise<this> {
    await expect(this.specialOfferSection).toBeVisible();
    await expect(this.popularItemsSection).toBeVisible();
    return this;
  }

  async scrollToFooter(): Promise<this> {
    await this.scrollToElement(this.footer);
    return this;
  }

  async verifyFooterIsVisible(): Promise<this> {
    await expect(this.footer).toBeVisible();
    return this;
  }

  async verifyFooterSocialMediaLinksAreVisible(): Promise<this> {
    await this.waitForElementVisibility(this.footerFollowUsText);
    await expect(this.footerFacebookLink).toHaveCount(1);
    await expect(this.footerTwitterLink).toHaveCount(1);
    await expect(this.footerLinkedInLink).toHaveCount(1);
    return this;
  }

  private productCategory(categoryName: string): Locator {
    return this.page.locator(`#${categoryName.toLowerCase()}Img`);
  }
}
