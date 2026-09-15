import { expect, test } from '../../fixtures/aos-fixture';
import { CATEGORIES } from '../../test-data/ui/categories.data';

test.describe('Product Categories', () => {
  test('TC-015: Category Page Opens From Home Page', async ({ categoryPage, homePage }) => {
    const categoryName = CATEGORIES.laptops;

    test.info().annotations.push(
      { type: 'feature', description: 'Product Categories' },
      { type: 'story', description: 'Open category page from Home Page' },
      { type: 'tag', description: 'FR-021' },
      { type: 'tag', description: 'FR-095' },
      { type: 'tag', description: 'FR-097' },
    );

    await test.step('Open the AOS Home Page', async () => {
      await homePage.open();
    });

    await test.step('Select the LAPTOPS category from Home Page', async () => {
      await homePage.selectProductCategory(categoryName);
    });

    await test.step('Verify the LAPTOPS Category Page is displayed', async () => {
      await categoryPage.verifyCategoryTitleIsDisplayed(categoryName);
    });
  });

  test('TC-016: Category Page Displays Products From Selected Category', async ({ categoryPage, homePage }) => {
    const categoryName = CATEGORIES.laptops;

    test.info().annotations.push(
      { type: 'feature', description: 'Product Categories' },
      { type: 'story', description: 'Display products from selected category' },
      { type: 'tag', description: 'FR-022' },
    );

    await test.step('Open the AOS Home Page', async () => {
      await homePage.open();
    });

    await test.step('Select the LAPTOPS category from Home Page', async () => {
      await homePage.selectProductCategory(categoryName);
    });

    await test.step('Verify the LAPTOPS Category Page is displayed', async () => {
      await categoryPage.verifyCategoryTitleIsDisplayed(categoryName);
    });

    await test.step('Verify the product list area displays products', async () => {
      await categoryPage.verifyAtLeastOneProductIsDisplayed();
      expect(await categoryPage.getProductCount()).toBeGreaterThan(0);
    });

    await test.step('Verify visible products contain identifiable information', async () => {
      await categoryPage.verifyEachProductContainsBasicInformation();
    });
  });

  test('TC-017: Product Details Page Opens From Category Product List', async ({
    categoryPage,
    homePage,
    productDetailsPage,
  }) => {
    const categoryName = CATEGORIES.laptops;
    const productIndex = 2;
    let selectedProductName = '';

    test.info().annotations.push(
      { type: 'feature', description: 'Product Categories' },
      { type: 'story', description: 'Open product details from category product list' },
      { type: 'tag', description: 'FR-023' },
      { type: 'tag', description: 'FR-024' },
      { type: 'tag', description: 'FR-095' },
      { type: 'tag', description: 'FR-097' },
    );

    await test.step('Open the AOS Home Page', async () => {
      await homePage.open();
    });

    await test.step('Select the LAPTOPS category from Home Page', async () => {
      await homePage.selectProductCategory(categoryName);
    });

    await test.step('Verify the LAPTOPS Category Page is displayed', async () => {
      await categoryPage.verifyCategoryTitleIsDisplayed(categoryName);
    });

    await test.step('Capture the selected product name from Category Page', async () => {
      selectedProductName = await categoryPage.getProductNameByIndex(productIndex);
    });

    await test.step('Select the captured product from Category Page', async () => {
      await categoryPage.selectProductByIndex(productIndex);
    });

    await test.step('Verify the Product Details Page is displayed', async () => {
      await productDetailsPage.verifyProductDetailsPageIsDisplayed();
    });

    await test.step('Verify Product Details Page matches the selected product', async () => {
      const productDetailsName = await productDetailsPage.getProductName();
      expect(productDetailsName.toLowerCase()).toBe(selectedProductName.toLowerCase());
    });
  });

  test('TC-018: Category Browsing Does Not Require Authentication', async ({ categoryPage, homePage }) => {
    const categoryName = CATEGORIES.laptops;

    test.info().annotations.push(
      { type: 'feature', description: 'Product Categories' },
      { type: 'story', description: 'Category browsing without authentication' },
      { type: 'tag', description: 'FR-021' },
      { type: 'tag', description: 'FR-022' },
    );

    await test.step('Open the AOS Home Page', async () => {
      await homePage.open();
    });

    await test.step('Select the LAPTOPS category from Home Page', async () => {
      await homePage.selectProductCategory(categoryName);
    });

    await test.step('Verify the LAPTOPS Category Page is displayed', async () => {
      await categoryPage.verifyCategoryTitleIsDisplayed(categoryName);
    });

    await test.step('Verify that category products are displayed', async () => {
      await categoryPage.verifyAtLeastOneProductIsDisplayed();
    });

    await test.step('Verify that the login popup is not displayed', async () => {
      await homePage.verifyLoginPopupIsNotVisible();
    });
  });
});
