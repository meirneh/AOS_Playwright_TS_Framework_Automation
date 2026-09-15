import { test } from '../../fixtures/aos-fixture';

test.describe('Home Page', () => {
  test('TC-001 - Home Page Loads Successfully', async ({ homePage }) => {
    await test.step('Open the home page', async () => {
      await homePage.open();
    });

    await test.step('Verify the main header and product categories', async () => {
      await homePage.verifyHeaderIsVisible();
      await homePage.verifyProductCategoriesAreVisible();
    });

    await test.step('Verify the main home sections', async () => {
      await homePage.verifyMainHomeSectionsAreVisible();
    });

    await test.step('Scroll to the footer and verify it is visible', async () => {
      await homePage.scrollToFooter();
      await homePage.verifyFooterIsVisible();
    });
  });

  test('TC-002: Header Navigation Is Available For Unauthenticated Users', async ({ homePage }) => {
    await test.step('Open the home page', async () => {
      await homePage.open();
    });

    await test.step('Verify the header is visible', async () => {
      await homePage.verifyHeaderIsVisible();
    });

    await test.step('Verify header action options are visible', async () => {
      await homePage.verifySearchOptionIsVisible();
      await homePage.verifyCartOptionIsVisible();
      await homePage.verifyAccountOptionIsVisible();
    });

    await test.step('Verify main navigation options are visible', async () => {
      await homePage.verifyMainNavigationOptionsAreVisible();
    });
  });

  test('TC-003: User Can Navigate Between Home Page Sections', async ({ homePage }) => {
    await test.step('Open the Home Page', async () => {
      await homePage.open();
    });

    await test.step('Navigate to OUR PRODUCTS section and verify it is visible', async () => {
      await homePage.navigateToOurProductsSection();
      await homePage.verifyOurProductsSectionIsVisible();
    });

    await test.step('Navigate to CONTACT US section and verify it is visible', async () => {
      await homePage.navigateToContactUsSection();
      await homePage.verifyContactUsSectionIsVisible();
    });

    await test.step('Verify the user remains on the Home Page', async () => {
      await homePage.verifyUserRemainsOnHomePage();
    });

    await test.step('Verify no login popup is displayed', async () => {
      await homePage.verifyLoginPopupIsNotVisible();
    });
  });

  test('TC-004: Contact Us Section Is Accessible From Home Page', async ({ homePage }) => {
    await test.step('Open the Home Page', async () => {
      await homePage.open();
    });

    await test.step('Navigate to Contact Us section', async () => {
      await homePage.navigateToContactUsSection();
    });

    await test.step('Verify Contact Us section is visible', async () => {
      await homePage.verifyContactUsSectionIsVisible();
    });

    await test.step('Verify Contact Us form is visible', async () => {
      await homePage.verifyContactUsFormIsVisible();
    });

    await test.step('Verify the user remains on the Home Page', async () => {
      await homePage.verifyUserRemainsOnHomePage();
    });
  });

  test('TC-005: Go Up Navigation Returns User To Top Of Home Page', async ({ homePage }) => {
    await test.step('Open the Home Page', async () => {
      await homePage.open();
    });

    await test.step('Navigate to Contact Us section', async () => {
      await homePage.navigateToContactUsSection();
    });

    await test.step('Verify Contact Us section is visible', async () => {
      await homePage.verifyContactUsSectionIsVisible();
    });

    await test.step('Click GO UP', async () => {
      await homePage.clickGoUp();
    });

    await test.step('Verify the user is at the top of the Home Page', async () => {
      await homePage.verifyUserIsAtTopOfHomePage();
    });

    await test.step('Verify the user remains on the Home Page', async () => {
      await homePage.verifyUserRemainsOnHomePage();
    });
  });

  test('TC-006: Footer And Social Media Links Are Displayed', async ({ homePage }) => {
    await test.step('Open the Home Page', async () => {
      await homePage.open();
    });

    await test.step('Scroll to the footer area', async () => {
      await homePage.scrollToFooter();
    });

    await test.step('Verify the footer is visible', async () => {
      await homePage.verifyFooterIsVisible();
    });

    await test.step('Verify footer social media links are visible', async () => {
      await homePage.verifyFooterSocialMediaLinksAreVisible();
    });
  });
});
