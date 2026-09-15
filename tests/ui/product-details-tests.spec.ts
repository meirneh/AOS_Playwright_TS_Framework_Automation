import { expect, test } from '../../fixtures/aos-fixture';
import { PRODUCTS } from '../../test-data/ui/products.data';

test.describe('Product Details', () => {
  test('TC-019: Product Details Page Displays Selected Product Information', async ({
    categoryPage,
    homePage,
    productDetailsPage,
  }) => {
    const categoryName = 'LAPTOPS';
    const productIndex = 2;
    let selectedProductName = '';

    test.info().annotations.push(
      { type: 'feature', description: 'Product Details' },
      { type: 'story', description: 'Display selected product information' },
      { type: 'tag', description: 'FR-024' },
    );

    await test.step('Open the AOS Home Page', async () => {
      await homePage.open();
    });

    await test.step('Select the LAPTOPS category from Home Page', async () => {
      await homePage.selectProductCategory(categoryName);
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

    await test.step('Verify the selected product name is displayed', async () => {
      const productDetailsName = await productDetailsPage.getProductName();
      expect(productDetailsName.toLowerCase()).toBe(selectedProductName.toLowerCase());
    });

    await test.step('Verify the product price is displayed', async () => {
      await productDetailsPage.verifyProductPriceIsDisplayed();
    });
  });

  test('TC-020: Product Specifications Are Displayed On Product Details Page', async ({
    categoryPage,
    homePage,
    productDetailsPage,
  }) => {
    const categoryName = 'LAPTOPS';
    const productIndex = 2;

    test.info().annotations.push(
      { type: 'feature', description: 'Product Details' },
      { type: 'story', description: 'Display product specifications' },
      { type: 'tag', description: 'FR-025' },
    );

    await test.step('Open the AOS Home Page', async () => {
      await homePage.open();
    });

    await test.step('Select the LAPTOPS category from Home Page', async () => {
      await homePage.selectProductCategory(categoryName);
    });

    await test.step('Select a deterministic product from Category Page', async () => {
      await categoryPage.selectProductByIndex(productIndex);
    });

    await test.step('Verify the Product Details Page is displayed', async () => {
      await productDetailsPage.verifyProductDetailsPageIsDisplayed();
    });

    await test.step('Verify product specifications are displayed', async () => {
      await productDetailsPage.verifyProductSpecificationsAreDisplayed();
    });
  });

  test('TC-021: Product Image Gallery Is Displayed And Can Be Used', async ({
    categoryPage,
    homePage,
    productDetailsPage,
  }) => {
    const categoryName = 'LAPTOPS';
    const productIndex = 2;
    const thumbnailIndex = 1;
    let initialImageSrc: string | null = null;

    test.info().annotations.push(
      { type: 'feature', description: 'Product Details' },
      { type: 'story', description: 'Use product image gallery' },
      { type: 'tag', description: 'FR-026' },
    );

    await test.step('Open the AOS Home Page', async () => {
      await homePage.open();
    });

    await test.step('Select the LAPTOPS category from Home Page', async () => {
      await homePage.selectProductCategory(categoryName);
    });

    await test.step('Select a deterministic product from Category Page', async () => {
      await categoryPage.selectProductByIndex(productIndex);
    });

    await test.step('Verify the Product Details Page is displayed', async () => {
      await productDetailsPage.verifyProductDetailsPageIsDisplayed();
    });

    await test.step('Verify main product image is displayed', async () => {
      await productDetailsPage.verifyMainProductImageIsDisplayed();
    });

    await test.step('Verify gallery contains more than one thumbnail', async () => {
      expect(await productDetailsPage.getProductImageThumbnailsCount()).toBeGreaterThan(1);
    });

    await test.step('Capture current main image source', async () => {
      initialImageSrc = await productDetailsPage.getMainProductImageSrc();
      expect(initialImageSrc).not.toBeNull();
    });

    await test.step('Select the second thumbnail', async () => {
      await productDetailsPage.selectProductImageThumbnailByIndex(thumbnailIndex);
    });

    await test.step('Verify main product image source changed', async () => {
      const updatedImageSrc = await productDetailsPage.getMainProductImageSrc();

      expect(updatedImageSrc).not.toBeNull();
      expect(updatedImageSrc).not.toBe(initialImageSrc);
    });
  });

  test('TC-022: Available Product Color Can Be Selected', async ({
    categoryPage,
    homePage,
    productDetailsPage,
  }) => {
    const product = PRODUCTS.hpPavilion15T;

    test.info().annotations.push(
      { type: 'feature', description: 'Product Details' },
      { type: 'story', description: 'Select available product color' },
      { type: 'tag', description: 'FR-027' },
    );

    await test.step('Open the AOS Home Page', async () => {
      await homePage.open();
    });

    await test.step('Select the LAPTOPS category from Home Page', async () => {
      await homePage.selectProductCategory(product.category);
    });

    await test.step('Verify the deterministic product is available', async () => {
      const actualProductName = await categoryPage.getProductNameByIndex(product.index);
      expect(actualProductName.toLowerCase()).toBe(product.name.toLowerCase());
    });

    await test.step('Select the deterministic product from Category Page', async () => {
      await categoryPage.selectProductByIndex(product.index);
    });

    await test.step('Verify the Product Details Page is displayed', async () => {
      await productDetailsPage.verifyProductDetailsPageIsDisplayed();
    });

    await test.step('Verify more than one color option is available', async () => {
      expect(await productDetailsPage.getProductColorsCount()).toBeGreaterThan(1);
    });

    await test.step('Verify GRAY is selected by default', async () => {
      await productDetailsPage.verifyProductColorIsSelected(product.defaultColor);
    });

    await test.step('Select BLUE color', async () => {
      await productDetailsPage.selectProductColor(product.alternateColor);
    });

    await test.step('Verify BLUE is selected', async () => {
      await productDetailsPage.verifyProductColorIsSelected(product.alternateColor);
    });
  });

  test('TC-023: Product Quantity Can Be Increased And Decreased Within Allowed Limits', async ({
    categoryPage,
    homePage,
    productDetailsPage,
  }) => {
    const categoryName = 'LAPTOPS';
    const productIndex = 2;

    test.info().annotations.push(
      { type: 'feature', description: 'Product Details' },
      { type: 'story', description: 'Change product quantity within allowed limits' },
      { type: 'tag', description: 'FR-028' },
    );

    await test.step('Open the AOS Home Page', async () => {
      await homePage.open();
    });

    await test.step('Select the LAPTOPS category from Home Page', async () => {
      await homePage.selectProductCategory(categoryName);
    });

    await test.step('Select a deterministic product from Category Page', async () => {
      await categoryPage.selectProductByIndex(productIndex);
    });

    await test.step('Verify the Product Details Page is displayed', async () => {
      await productDetailsPage.verifyProductDetailsPageIsDisplayed();
    });

    await test.step('Verify initial quantity is 1', async () => {
      expect(await productDetailsPage.getProductQuantity()).toBe(1);
    });

    await test.step('Increase product quantity', async () => {
      await productDetailsPage.increaseProductQuantity();
    });

    await test.step('Verify quantity is 2', async () => {
      expect(await productDetailsPage.getProductQuantity()).toBe(2);
    });

    await test.step('Decrease product quantity', async () => {
      await productDetailsPage.decreaseProductQuantity();
    });

    await test.step('Verify quantity is 1', async () => {
      expect(await productDetailsPage.getProductQuantity()).toBe(1);
    });

    await test.step('Attempt to decrease quantity at minimum', async () => {
      await productDetailsPage.decreaseProductQuantity();
    });

    await test.step('Verify quantity remains 1', async () => {
      expect(await productDetailsPage.getProductQuantity()).toBe(1);
    });
  });

  test('TC-025: Product Can Be Added To Cart With Selected Configuration', async ({
    categoryPage,
    homePage,
    miniCartComponent,
    productDetailsPage,
  }) => {
    const product = PRODUCTS.hpPavilion15T;
    const expectedQuantity = 2;

    test.info().annotations.push(
      { type: 'feature', description: 'Product Details' },
      { type: 'story', description: 'Add product with selected configuration to cart' },
      { type: 'tag', description: 'FR-030' },
      { type: 'tag', description: 'FR-031' },
      { type: 'tag', description: 'FR-032' },
      { type: 'tag', description: 'FR-033' },
      { type: 'tag', description: 'FR-096' },
      { type: 'tag', description: 'FR-097' },
    );

    await test.step('Open the AOS Home Page', async () => {
      await homePage.open();
    });

    await test.step('Select the LAPTOPS category from Home Page', async () => {
      await homePage.selectProductCategory(product.category);
    });

    await test.step('Verify the deterministic product is available', async () => {
      const actualProductName = await categoryPage.getProductNameByIndex(product.index);
      expect(actualProductName.toLowerCase()).toBe(product.name.toLowerCase());
    });

    await test.step('Select the deterministic product from Category Page', async () => {
      await categoryPage.selectProductByIndex(product.index);
    });

    await test.step('Verify the Product Details Page is displayed', async () => {
      await productDetailsPage.verifyProductDetailsPageIsDisplayed();
    });

    await test.step('Select BLUE color', async () => {
      await productDetailsPage.selectProductColor(product.alternateColor);
    });

    await test.step('Verify BLUE is selected', async () => {
      await productDetailsPage.verifyProductColorIsSelected(product.alternateColor);
    });

    await test.step('Verify initial quantity is 1', async () => {
      expect(await productDetailsPage.getProductQuantity()).toBe(1);
    });

    await test.step('Increase product quantity to 2', async () => {
      await productDetailsPage.increaseProductQuantity();
    });

    await test.step('Verify quantity is 2', async () => {
      expect(await productDetailsPage.getProductQuantity()).toBe(expectedQuantity);
    });

    await test.step('Add the configured product to cart', async () => {
      await productDetailsPage.addToCart();
    });

    await test.step('Verify cart badge quantity', async () => {
      await miniCartComponent.verifyCartBadgeQuantity(expectedQuantity);
    });

    await test.step('Verify mini-cart is displayed', async () => {
      await miniCartComponent.verifyMiniCartIsDisplayed();
    });

    await test.step('Verify added product name', async () => {
      await miniCartComponent.verifyAddedProductName(product.name);
    });

    await test.step('Verify added product quantity', async () => {
      await miniCartComponent.verifyAddedProductQuantity(expectedQuantity);
    });

    await test.step('Verify added product color', async () => {
      await miniCartComponent.verifyAddedProductColor(product.alternateColor);
    });
  });

  test('TC-026: Mini Cart Displays Added Product Summary', async ({
    categoryPage,
    homePage,
    miniCartComponent,
    productDetailsPage,
  }) => {
    const product = PRODUCTS.hpPavilion15T;
    const expectedQuantity = 2;

    test.info().annotations.push(
      { type: 'feature', description: 'Product Details' },
      { type: 'story', description: 'Display added product summary in mini cart' },
      { type: 'tag', description: 'FR-032' },
      { type: 'tag', description: 'FR-033' },
    );

    await test.step('Open the AOS Home Page', async () => {
      await homePage.open();
    });

    await test.step('Select the LAPTOPS category from Home Page', async () => {
      await homePage.selectProductCategory(product.category);
    });

    await test.step('Verify the deterministic product is available', async () => {
      const actualProductName = await categoryPage.getProductNameByIndex(product.index);
      expect(actualProductName.toLowerCase()).toBe(product.name.toLowerCase());
    });

    await test.step('Select the deterministic product from Category Page', async () => {
      await categoryPage.selectProductByIndex(product.index);
    });

    await test.step('Verify the Product Details Page is displayed', async () => {
      await productDetailsPage.verifyProductDetailsPageIsDisplayed();
    });

    await test.step('Select BLUE color', async () => {
      await productDetailsPage.selectProductColor(product.alternateColor);
    });

    await test.step('Verify BLUE is selected', async () => {
      await productDetailsPage.verifyProductColorIsSelected(product.alternateColor);
    });

    await test.step('Verify initial quantity is 1', async () => {
      expect(await productDetailsPage.getProductQuantity()).toBe(1);
    });

    await test.step('Increase product quantity to 2', async () => {
      await productDetailsPage.increaseProductQuantity();
    });

    await test.step('Verify quantity is 2', async () => {
      expect(await productDetailsPage.getProductQuantity()).toBe(expectedQuantity);
    });

    await test.step('Add the configured product to cart', async () => {
      await productDetailsPage.addToCart();
    });

    await test.step('Verify mini-cart is displayed', async () => {
      await miniCartComponent.verifyMiniCartIsDisplayed();
    });

    await test.step('Verify added product name', async () => {
      await miniCartComponent.verifyAddedProductName(product.name);
    });

    await test.step('Verify added product quantity', async () => {
      await miniCartComponent.verifyAddedProductQuantity(expectedQuantity);
    });

    await test.step('Verify added product color', async () => {
      await miniCartComponent.verifyAddedProductColor(product.alternateColor);
    });
  });

  test('TC-027: Cart Badge Updates After Adding Product', async ({
    categoryPage,
    homePage,
    miniCartComponent,
    productDetailsPage,
  }) => {
    const product = PRODUCTS.hpPavilion15T;
    const expectedQuantity = 2;

    test.info().annotations.push(
      { type: 'feature', description: 'Product Details' },
      { type: 'story', description: 'Update cart badge after adding product' },
      { type: 'tag', description: 'FR-031' },
      { type: 'tag', description: 'FR-096' },
      { type: 'tag', description: 'FR-097' },
    );

    await test.step('Open the AOS Home Page', async () => {
      await homePage.open();
    });

    await test.step('Select the LAPTOPS category from Home Page', async () => {
      await homePage.selectProductCategory(product.category);
    });

    await test.step('Verify the deterministic product is available', async () => {
      const actualProductName = await categoryPage.getProductNameByIndex(product.index);
      expect(actualProductName.toLowerCase()).toBe(product.name.toLowerCase());
    });

    await test.step('Select the deterministic product from Category Page', async () => {
      await categoryPage.selectProductByIndex(product.index);
    });

    await test.step('Verify the Product Details Page is displayed', async () => {
      await productDetailsPage.verifyProductDetailsPageIsDisplayed();
    });

    await test.step('Verify initial quantity is 1', async () => {
      expect(await productDetailsPage.getProductQuantity()).toBe(1);
    });

    await test.step('Increase product quantity to 2', async () => {
      await productDetailsPage.increaseProductQuantity();
    });

    await test.step('Verify quantity is 2', async () => {
      expect(await productDetailsPage.getProductQuantity()).toBe(expectedQuantity);
    });

    await test.step('Add product to cart', async () => {
      await productDetailsPage.addToCart();
    });

    await test.step('Verify cart badge quantity', async () => {
      await miniCartComponent.verifyCartBadgeQuantity(expectedQuantity);
    });

    await test.step('Verify mini-cart product quantity', async () => {
      await miniCartComponent.verifyAddedProductQuantity(expectedQuantity);
    });
  });
});
