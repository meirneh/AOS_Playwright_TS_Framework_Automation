import { expect, test } from '../../fixtures/aos-fixture';
import { PRODUCTS } from '../../test-data/ui/products.data';
import { USERS } from '../../test-data/ui/users.data';
import { toCents } from '../../utils/helpers/price-helpers';

test.describe('Shopping Cart', () => {
    test('TC-028: Shopping Cart Page Displays Current Cart State', async ({
        homePage,
        miniCartComponent,
        shoppingCartPage,
    }) => {
        test.info().annotations.push(
            { type: 'feature', description: 'Shopping Cart' },
            { type: 'story', description: 'Display current shopping cart state' },
            { type: 'tag', description: 'FR-034' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });
    });

    test('TC-029: Empty Cart State Is Displayed When Cart Has No Products', async ({
        homePage,
        miniCartComponent,
        shoppingCartPage,
    }) => {
        test.info().annotations.push(
            { type: 'feature', description: 'Shopping Cart' },
            { type: 'story', description: 'Display empty cart state' },
            { type: 'tag', description: 'FR-038' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the empty cart message is displayed', async () => {
            await shoppingCartPage.verifyEmptyCartMessageIsDisplayed();
        });

        await test.step('Verify no product rows are present', async () => {
            await shoppingCartPage.verifyCartHasNoProducts();
        });

        await test.step('Verify Checkout is not available', async () => {
            await shoppingCartPage.verifyCheckoutIsNotAvailable();
        });
    });

    test('TC-030: Cart Displays Added Product Information', async ({
        categoryPage,
        homePage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        const product = PRODUCTS.hpPavilion15T;
        const expectedQuantity = 1;
        let productDetailsPrice = '';

        test.info().annotations.push(
            { type: 'feature', description: 'Shopping Cart' },
            { type: 'story', description: 'Display added product information' },
            { type: 'tag', description: 'FR-035' },
            { type: 'tag', description: 'FR-033' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Select the LAPTOPS category from Home Page', async () => {
            await homePage.selectProductCategory(product.category);
        });

        await test.step('Verify the deterministic product from Category Page', async () => {
            const productName = await categoryPage.getProductNameByIndex(product.index);
            expect(productName.toLowerCase()).toBe(product.name.toLowerCase());
        });

        await test.step('Select the deterministic product from Category Page', async () => {
            await categoryPage.selectProductByIndex(product.index);
        });

        await test.step('Verify the Product Details Page is displayed', async () => {
            await productDetailsPage.verifyProductDetailsPageIsDisplayed();
        });

        await test.step('Select the BLUE product color', async () => {
            await productDetailsPage.selectProductColor(product.alternateColor);
            await productDetailsPage.verifyProductColorIsSelected(product.alternateColor);
        });

        await test.step('Verify the current product quantity is 1', async () => {
            expect(await productDetailsPage.getProductQuantity()).toBe(expectedQuantity);
        });

        await test.step('Capture the Product Details price', async () => {
            productDetailsPrice = await productDetailsPage.getProductPrice();
        });

        await test.step('Add the product to cart', async () => {
            await productDetailsPage.addToCart();
        });

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the added product name', async () => {
            await shoppingCartPage.verifyProductName(product.name);
        });

        await test.step('Verify the added product color', async () => {
            await shoppingCartPage.verifyProductColor(product.alternateColor);
        });

        await test.step('Verify the added product quantity', async () => {
            await shoppingCartPage.verifyProductQuantity(expectedQuantity);
        });

        await test.step('Verify the added product price', async () => {
            expect(await shoppingCartPage.getProductPrice()).toBe(productDetailsPrice);
        });
    });

    test('TC-031: Product Quantity Can Be Edited From Cart', async ({
        categoryPage,
        homePage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        const product = PRODUCTS.hpPavilion15T;
        const initialQuantity = 1;
        const updatedQuantity = 2;
        let initialProductPrice = '';
        let initialCartTotal = '';
        let updatedProductPrice = '';
        let updatedCartTotal = '';

        test.info().annotations.push(
            { type: 'feature', description: 'Shopping Cart' },
            { type: 'story', description: 'Edit product quantity from cart' },
            { type: 'tag', description: 'FR-036' },
            { type: 'tag', description: 'FR-042' },
            { type: 'tag', description: 'FR-096' },
            { type: 'tag', description: 'FR-097' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Select the LAPTOPS category from Home Page', async () => {
            await homePage.selectProductCategory(product.category);
        });

        await test.step('Verify the deterministic product from Category Page', async () => {
            const productName = await categoryPage.getProductNameByIndex(product.index);
            expect(productName.toLowerCase()).toBe(product.name.toLowerCase());
        });

        await test.step('Select the deterministic product from Category Page', async () => {
            await categoryPage.selectProductByIndex(product.index);
        });

        await test.step('Verify the Product Details Page is displayed', async () => {
            await productDetailsPage.verifyProductDetailsPageIsDisplayed();
        });

        await test.step('Select the BLUE product color', async () => {
            await productDetailsPage.selectProductColor(product.alternateColor);
            await productDetailsPage.verifyProductColorIsSelected(product.alternateColor);
        });

        await test.step('Verify the current product quantity is 1', async () => {
            expect(await productDetailsPage.getProductQuantity()).toBe(initialQuantity);
        });

        await test.step('Add the product to cart', async () => {
            await productDetailsPage.addToCart();
        });

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the initial Shopping Cart quantity is 1', async () => {
            await shoppingCartPage.verifyProductQuantity(initialQuantity);
        });

        await test.step('Capture the initial Shopping Cart product price', async () => {
            initialProductPrice = await shoppingCartPage.getProductPrice();
        });

        await test.step('Capture the initial Shopping Cart total', async () => {
            initialCartTotal = await shoppingCartPage.getCartTotal();
        });

        await test.step('Verify the initial product price equals the initial cart total', async () => {
            expect(toCents(initialProductPrice)).toBe(toCents(initialCartTotal));
        });

        await test.step('Edit the product from Shopping Cart', async () => {
            await shoppingCartPage.editProduct();
        });

        await test.step('Verify the Product Details Page is displayed in edit mode', async () => {
            await productDetailsPage.verifyProductDetailsPageIsDisplayed();
        });

        await test.step('Verify the product quantity is still 1', async () => {
            expect(await productDetailsPage.getProductQuantity()).toBe(initialQuantity);
        });

        await test.step('Increase the product quantity to 2', async () => {
            await productDetailsPage.increaseProductQuantity();
            expect(await productDetailsPage.getProductQuantity()).toBe(updatedQuantity);
        });

        await test.step('Save the updated product configuration', async () => {
            await productDetailsPage.addToCart();
        });

        await test.step('Verify the Shopping Cart page is displayed again', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the updated Shopping Cart quantity is 2', async () => {
            await shoppingCartPage.verifyProductQuantity(updatedQuantity);
        });

        await test.step('Capture the updated Shopping Cart product price', async () => {
            updatedProductPrice = await shoppingCartPage.getProductPrice();
        });

        await test.step('Capture the updated Shopping Cart total', async () => {
            updatedCartTotal = await shoppingCartPage.getCartTotal();
        });

        await test.step('Verify the updated product price equals the updated cart total', async () => {
            expect(toCents(updatedProductPrice)).toBe(toCents(updatedCartTotal));
        });

        await test.step('Verify the updated amount matches the initial amount multiplied by 2', async () => {
            expect(toCents(updatedProductPrice)).toBe(toCents(initialProductPrice) * updatedQuantity);
        });
    });

    test('TC-032: Product Quantity Cannot Be Reduced Below Minimum From Cart', async ({
        categoryPage,
        homePage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        const product = PRODUCTS.hpPavilion15T;
        const minimumQuantity = 1;
        let initialProductPrice = '';
        let initialCartTotal = '';
        let finalProductPrice = '';
        let finalCartTotal = '';

        test.info().annotations.push(
            { type: 'feature', description: 'Shopping Cart' },
            { type: 'story', description: 'Prevent product quantity below minimum from cart' },
            { type: 'tag', description: 'FR-036' },
            { type: 'tag', description: 'FR-042' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Select the LAPTOPS category from Home Page', async () => {
            await homePage.selectProductCategory(product.category);
        });

        await test.step('Verify the deterministic product from Category Page', async () => {
            const productName = await categoryPage.getProductNameByIndex(product.index);
            expect(productName.toLowerCase()).toBe(product.name.toLowerCase());
        });

        await test.step('Select the deterministic product from Category Page', async () => {
            await categoryPage.selectProductByIndex(product.index);
        });

        await test.step('Verify the Product Details Page is displayed', async () => {
            await productDetailsPage.verifyProductDetailsPageIsDisplayed();
        });

        await test.step('Select the BLUE product color', async () => {
            await productDetailsPage.selectProductColor(product.alternateColor);
            await productDetailsPage.verifyProductColorIsSelected(product.alternateColor);
        });

        await test.step('Verify the current product quantity is 1', async () => {
            expect(await productDetailsPage.getProductQuantity()).toBe(minimumQuantity);
        });

        await test.step('Add the product to cart', async () => {
            await productDetailsPage.addToCart();
        });

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the Shopping Cart quantity is 1', async () => {
            await shoppingCartPage.verifyProductQuantity(minimumQuantity);
        });

        await test.step('Capture the initial Shopping Cart product price', async () => {
            initialProductPrice = await shoppingCartPage.getProductPrice();
        });

        await test.step('Capture the initial Shopping Cart total', async () => {
            initialCartTotal = await shoppingCartPage.getCartTotal();
        });

        await test.step('Edit the product from Shopping Cart', async () => {
            await shoppingCartPage.editProduct();
        });

        await test.step('Verify the Product Details Page is displayed in edit mode', async () => {
            await productDetailsPage.verifyProductDetailsPageIsDisplayed();
        });

        await test.step('Verify the product quantity is still 1', async () => {
            expect(await productDetailsPage.getProductQuantity()).toBe(minimumQuantity);
        });

        await test.step('Attempt to decrease the product quantity below 1', async () => {
            await productDetailsPage.decreaseProductQuantity();
            expect(await productDetailsPage.getProductQuantity()).toBe(minimumQuantity);
        });

        await test.step('Save the product configuration', async () => {
            await productDetailsPage.addToCart();
        });

        await test.step('Verify the Shopping Cart page is displayed again', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the Shopping Cart quantity remains 1', async () => {
            await shoppingCartPage.verifyProductQuantity(minimumQuantity);
        });

        await test.step('Capture the final Shopping Cart product price', async () => {
            finalProductPrice = await shoppingCartPage.getProductPrice();
        });

        await test.step('Capture the final Shopping Cart total', async () => {
            finalCartTotal = await shoppingCartPage.getCartTotal();
        });

        await test.step('Verify the final product price equals the initial product price', async () => {
            expect(toCents(finalProductPrice)).toBe(toCents(initialProductPrice));
        });

        await test.step('Verify the final cart total equals the initial cart total', async () => {
            expect(toCents(finalCartTotal)).toBe(toCents(initialCartTotal));
        });
    });

    test('TC-033: Product Can Be Removed From Cart', async ({
        categoryPage,
        homePage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        const product = PRODUCTS.hpPavilion15T;
        const expectedQuantity = 1;

        test.info().annotations.push(
            { type: 'feature', description: 'Shopping Cart' },
            { type: 'story', description: 'Remove product from cart' },
            { type: 'tag', description: 'FR-037' },
            { type: 'tag', description: 'FR-042' },
            { type: 'tag', description: 'FR-096' },
            { type: 'tag', description: 'FR-097' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Select the LAPTOPS category from Home Page', async () => {
            await homePage.selectProductCategory(product.category);
        });

        await test.step('Verify the deterministic product from Category Page', async () => {
            const productName = await categoryPage.getProductNameByIndex(product.index);
            expect(productName.toLowerCase()).toBe(product.name.toLowerCase());
        });

        await test.step('Select the deterministic product from Category Page', async () => {
            await categoryPage.selectProductByIndex(product.index);
        });

        await test.step('Verify the Product Details Page is displayed', async () => {
            await productDetailsPage.verifyProductDetailsPageIsDisplayed();
        });

        await test.step('Select the BLUE product color', async () => {
            await productDetailsPage.selectProductColor(product.alternateColor);
            await productDetailsPage.verifyProductColorIsSelected(product.alternateColor);
        });

        await test.step('Verify the current product quantity is 1', async () => {
            expect(await productDetailsPage.getProductQuantity()).toBe(expectedQuantity);
        });

        await test.step('Add the product to cart', async () => {
            await productDetailsPage.addToCart();
        });

        await test.step('Verify the cart badge displays 1 product', async () => {
            await miniCartComponent.verifyCartBadgeQuantity(expectedQuantity);
        });

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the added product is displayed', async () => {
            await shoppingCartPage.verifyProductName(product.name);
        });

        await test.step('Remove the product from Shopping Cart', async () => {
            await shoppingCartPage.removeProduct();
        });

        await test.step('Verify the empty cart message is displayed', async () => {
            await shoppingCartPage.verifyEmptyCartMessageIsDisplayed();
        });

        await test.step('Verify no product rows are present', async () => {
            await shoppingCartPage.verifyCartHasNoProducts();
        });

        await test.step('Verify Checkout is not available', async () => {
            await shoppingCartPage.verifyCheckoutIsNotAvailable();
        });

        await test.step('Verify the cart badge no longer displays a quantity', async () => {
            await miniCartComponent.verifyCartBadgeIsNotDisplayed();
        });
    });

    test('TC-034: Continue Shopping Preserves Cart Contents', async ({
        categoryPage,
        homePage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        const product = PRODUCTS.hpPavilion15T;
        const expectedQuantity = 1;
        let initialCartTotal = '';
        let finalCartTotal = '';

        test.info().annotations.push(
            { type: 'feature', description: 'Shopping Cart' },
            { type: 'story', description: 'Continue shopping preserves cart contents' },
            { type: 'tag', description: 'FR-039' },
            { type: 'tag', description: 'FR-035' },
            { type: 'tag', description: 'FR-042' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Select the LAPTOPS category from Home Page', async () => {
            await homePage.selectProductCategory(product.category);
        });

        await test.step('Verify the deterministic product from Category Page', async () => {
            const productName = await categoryPage.getProductNameByIndex(product.index);
            expect(productName.toLowerCase()).toBe(product.name.toLowerCase());
        });

        await test.step('Select the deterministic product from Category Page', async () => {
            await categoryPage.selectProductByIndex(product.index);
        });

        await test.step('Verify the Product Details Page is displayed', async () => {
            await productDetailsPage.verifyProductDetailsPageIsDisplayed();
        });

        await test.step('Select the BLUE product color', async () => {
            await productDetailsPage.selectProductColor(product.alternateColor);
            await productDetailsPage.verifyProductColorIsSelected(product.alternateColor);
        });

        await test.step('Verify the current product quantity is 1', async () => {
            expect(await productDetailsPage.getProductQuantity()).toBe(expectedQuantity);
        });

        await test.step('Add the product to cart', async () => {
            await productDetailsPage.addToCart();
        });

        await test.step('Verify the cart badge displays 1 product', async () => {
            await miniCartComponent.verifyCartBadgeQuantity(expectedQuantity);
        });

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the added product is displayed in Shopping Cart', async () => {
            await shoppingCartPage.verifyProductName(product.name);
            await shoppingCartPage.verifyProductColor(product.alternateColor);
            await shoppingCartPage.verifyProductQuantity(expectedQuantity);
        });

        await test.step('Capture the initial Shopping Cart state', async () => {
            initialCartTotal = await shoppingCartPage.getCartTotal();
        });

        await test.step('Navigate back to the Home Page to continue shopping', async () => {
            await shoppingCartPage.navigateToHome();
        });

        await test.step('Verify the Home Page is displayed', async () => {
            await homePage.verifyProductCategoriesAreVisible();
        });

        await test.step('Verify the cart badge still displays 1 product', async () => {
            await miniCartComponent.verifyCartBadgeQuantity(expectedQuantity);
        });

        await test.step('Open the Shopping Cart page again', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed again', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the Shopping Cart product information is preserved', async () => {
            await shoppingCartPage.verifyProductName(product.name);
            await shoppingCartPage.verifyProductColor(product.alternateColor);
            await shoppingCartPage.verifyProductQuantity(expectedQuantity);
        });

        await test.step('Capture the final Shopping Cart state', async () => {
            finalCartTotal = await shoppingCartPage.getCartTotal();
        });

        await test.step('Verify the Shopping Cart total is preserved', async () => {
            expect(toCents(finalCartTotal)).toBe(toCents(initialCartTotal));
        });
    });

    test('TC-035: Mini Cart Displays Current Cart Items From Cart Icon', async ({
        categoryPage,
        homePage,
        miniCartComponent,
        productDetailsPage,
    }) => {
        const product = PRODUCTS.hpPavilion15T;
        const expectedQuantity = 1;

        test.info().annotations.push(
            { type: 'feature', description: 'Shopping Cart' },
            { type: 'story', description: 'Display current cart items in mini cart' },
            { type: 'tag', description: 'FR-040' },
            { type: 'tag', description: 'FR-032' },
            { type: 'tag', description: 'FR-035' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Select the LAPTOPS category from Home Page', async () => {
            await homePage.selectProductCategory(product.category);
        });

        await test.step('Verify the deterministic product from Category Page', async () => {
            const productName = await categoryPage.getProductNameByIndex(product.index);
            expect(productName.toLowerCase()).toBe(product.name.toLowerCase());
        });

        await test.step('Select the deterministic product from Category Page', async () => {
            await categoryPage.selectProductByIndex(product.index);
        });

        await test.step('Verify the Product Details Page is displayed', async () => {
            await productDetailsPage.verifyProductDetailsPageIsDisplayed();
        });

        await test.step('Select the BLUE product color', async () => {
            await productDetailsPage.selectProductColor(product.alternateColor);
            await productDetailsPage.verifyProductColorIsSelected(product.alternateColor);
        });

        await test.step('Verify the current product quantity is 1', async () => {
            expect(await productDetailsPage.getProductQuantity()).toBe(expectedQuantity);
        });

        await test.step('Add the product to cart', async () => {
            await productDetailsPage.addToCart();
        });

        await test.step('Verify the cart badge displays 1 product', async () => {
            await miniCartComponent.verifyCartBadgeQuantity(expectedQuantity);
        });

        await test.step('Trigger the Mini Cart from the cart icon', async () => {
            await miniCartComponent.showMiniCart();
        });

        await test.step('Verify the Mini Cart is displayed', async () => {
            await miniCartComponent.verifyMiniCartIsDisplayed();
        });

        await test.step('Verify the Mini Cart product name', async () => {
            await miniCartComponent.verifyAddedProductName(product.name);
        });

        await test.step('Verify the Mini Cart product quantity', async () => {
            await miniCartComponent.verifyAddedProductQuantity(expectedQuantity);
        });

        await test.step('Verify the Mini Cart product color', async () => {
            await miniCartComponent.verifyAddedProductColor(product.alternateColor);
        });
    });

    test('TC-036: Product Can Be Removed From Mini Cart', async ({
        categoryPage,
        homePage,
        miniCartComponent,
        productDetailsPage,
    }) => {
        const product = PRODUCTS.hpPavilion15T;
        const expectedQuantity = 1;

        test.info().annotations.push(
            { type: 'feature', description: 'Shopping Cart' },
            { type: 'story', description: 'Remove product from mini cart' },
            { type: 'tag', description: 'FR-041' },
            { type: 'tag', description: 'FR-096' },
            { type: 'tag', description: 'FR-097' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Select the LAPTOPS category from Home Page', async () => {
            await homePage.selectProductCategory(product.category);
        });

        await test.step('Verify the deterministic product from Category Page', async () => {
            const productName = await categoryPage.getProductNameByIndex(product.index);
            expect(productName.toLowerCase()).toBe(product.name.toLowerCase());
        });

        await test.step('Select the deterministic product from Category Page', async () => {
            await categoryPage.selectProductByIndex(product.index);
        });

        await test.step('Verify the Product Details Page is displayed', async () => {
            await productDetailsPage.verifyProductDetailsPageIsDisplayed();
        });

        await test.step('Select the BLUE product color', async () => {
            await productDetailsPage.selectProductColor(product.alternateColor);
            await productDetailsPage.verifyProductColorIsSelected(product.alternateColor);
        });

        await test.step('Verify the current product quantity is 1', async () => {
            expect(await productDetailsPage.getProductQuantity()).toBe(expectedQuantity);
        });

        await test.step('Add the product to cart', async () => {
            await productDetailsPage.addToCart();
        });

        await test.step('Verify the cart badge displays 1 product', async () => {
            await miniCartComponent.verifyCartBadgeQuantity(expectedQuantity);
        });

        await test.step('Trigger the Mini Cart from the cart icon', async () => {
            await miniCartComponent.showMiniCart();
        });

        await test.step('Verify the Mini Cart is displayed', async () => {
            await miniCartComponent.verifyMiniCartIsDisplayed();
        });

        await test.step('Verify the Mini Cart contains the added product', async () => {
            await miniCartComponent.verifyAddedProductName(product.name);
            await miniCartComponent.verifyAddedProductQuantity(expectedQuantity);
            await miniCartComponent.verifyAddedProductColor(product.alternateColor);
        });

        await test.step('Remove the product from the Mini Cart', async () => {
            await miniCartComponent.removeProduct();
        });

        await test.step('Verify the Mini Cart displays the empty-cart state', async () => {
            await miniCartComponent.verifyEmptyCartStateIsDisplayed();
        });

        await test.step('Verify the cart badge no longer displays a quantity', async () => {
            await miniCartComponent.verifyCartBadgeIsNotDisplayed();
        });
    });

    test('TC-037: Cart Total Is Calculated From Products And Quantities', async ({
        categoryPage,
        homePage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        const product = PRODUCTS.hpPavilion15T;
        const expectedQuantity = 2;
        let unitPrice = '';
        let cartProductSubtotal = '';
        let cartTotal = '';

        test.info().annotations.push(
            { type: 'feature', description: 'Shopping Cart' },
            { type: 'story', description: 'Calculate cart total from product quantity' },
            { type: 'tag', description: 'FR-042' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Select the LAPTOPS category from Home Page', async () => {
            await homePage.selectProductCategory(product.category);
        });

        await test.step('Verify the deterministic product from Category Page', async () => {
            const productName = await categoryPage.getProductNameByIndex(product.index);
            expect(productName.toLowerCase()).toBe(product.name.toLowerCase());
        });

        await test.step('Select the deterministic product from Category Page', async () => {
            await categoryPage.selectProductByIndex(product.index);
        });

        await test.step('Verify the Product Details Page is displayed', async () => {
            await productDetailsPage.verifyProductDetailsPageIsDisplayed();
        });

        await test.step('Select the BLUE product color', async () => {
            await productDetailsPage.selectProductColor(product.alternateColor);
            await productDetailsPage.verifyProductColorIsSelected(product.alternateColor);
        });

        await test.step('Capture the Product Details unit price', async () => {
            unitPrice = await productDetailsPage.getProductPrice();
        });

        await test.step('Verify the initial product quantity is 1', async () => {
            expect(await productDetailsPage.getProductQuantity()).toBe(1);
        });

        await test.step('Increase the product quantity to 2', async () => {
            await productDetailsPage.increaseProductQuantity();
            expect(await productDetailsPage.getProductQuantity()).toBe(expectedQuantity);
        });

        await test.step('Add the product to cart', async () => {
            await productDetailsPage.addToCart();
        });

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the Shopping Cart product information', async () => {
            await shoppingCartPage.verifyProductName(product.name);
            await shoppingCartPage.verifyProductColor(product.alternateColor);
            await shoppingCartPage.verifyProductQuantity(expectedQuantity);
        });

        await test.step('Capture the Shopping Cart product subtotal', async () => {
            cartProductSubtotal = await shoppingCartPage.getProductPrice();
        });

        await test.step('Capture the Shopping Cart total', async () => {
            cartTotal = await shoppingCartPage.getCartTotal();
        });

        await test.step('Verify the product subtotal is calculated from unit price and quantity', async () => {
            const expectedSubtotalInCents = toCents(unitPrice) * expectedQuantity;
            expect(toCents(cartProductSubtotal)).toBe(expectedSubtotalInCents);
        });

        await test.step('Verify the cart total equals the calculated subtotal', async () => {
            const expectedSubtotalInCents = toCents(unitPrice) * expectedQuantity;
            expect(toCents(cartTotal)).toBe(expectedSubtotalInCents);
        });
    });

    test('TC-038: Cart Contents Are Preserved After User Sign In', async ({
        categoryPage,
        homePage,
        loginPage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        const product = PRODUCTS.hpPavilion15T;
        const user = USERS.existingUser;
        const expectedQuantity = 1;

        test.info().annotations.push(
            { type: 'feature', description: 'Shopping Cart' },
            { type: 'story', description: 'Preserve cart contents after user sign in' },
            { type: 'tag', description: 'FR-043' },
            { type: 'tag', description: 'FR-073' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Select the LAPTOPS category from Home Page', async () => {
            await homePage.selectProductCategory(product.category);
        });

        await test.step('Verify the deterministic product from Category Page', async () => {
            const productName = await categoryPage.getProductNameByIndex(product.index);
            expect(productName.toLowerCase()).toBe(product.name.toLowerCase());
        });

        await test.step('Select the deterministic product from Category Page', async () => {
            await categoryPage.selectProductByIndex(product.index);
        });

        await test.step('Verify the Product Details Page is displayed', async () => {
            await productDetailsPage.verifyProductDetailsPageIsDisplayed();
        });

        await test.step('Select the BLUE product color', async () => {
            await productDetailsPage.selectProductColor(product.alternateColor);
            await productDetailsPage.verifyProductColorIsSelected(product.alternateColor);
        });

        await test.step('Verify the current product quantity is 1', async () => {
            expect(await productDetailsPage.getProductQuantity()).toBe(expectedQuantity);
        });

        await test.step('Add the product to cart while unauthenticated', async () => {
            await productDetailsPage.addToCart();
        });

        await test.step('Verify the cart badge displays 1 product', async () => {
            await miniCartComponent.verifyCartBadgeQuantity(expectedQuantity);
        });

        await test.step('Open the login form from the account icon', async () => {
            await loginPage.openLoginForm();
        });

        await test.step('Enter the registered username', async () => {
            await loginPage.enterUsername(user.username);
        });

        await test.step('Enter the registered password', async () => {
            await loginPage.enterPassword(user.password);
        });

        await test.step('Submit the login form', async () => {
            await loginPage.signIn();
        });

        await test.step('Verify the user is signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });

        await test.step('Verify the cart badge still displays 1 product', async () => {
            await miniCartComponent.verifyCartBadgeQuantity(expectedQuantity);
        });

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the preserved product name', async () => {
            await shoppingCartPage.verifyProductName(product.name);
        });

        await test.step('Verify the preserved product color', async () => {
            await shoppingCartPage.verifyProductColor(product.alternateColor);
        });

        await test.step('Verify the preserved product quantity', async () => {
            await shoppingCartPage.verifyProductQuantity(expectedQuantity);
        });
    });
});
