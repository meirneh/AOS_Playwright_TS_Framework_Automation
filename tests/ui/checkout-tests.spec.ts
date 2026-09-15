import { expect, test } from '../../fixtures/aos-fixture';
import { CHECKOUT_DATA } from '../../test-data/ui/checkout.data';
import { PRODUCTS } from '../../test-data/ui/products.data';
import { USERS } from '../../test-data/ui/users.data';
import { toCents } from '../../utils/helpers/price-helpers';

test.describe('Checkout', () => {
    test('TC-039: Checkout Can Be Started From Shopping Cart With Products', async ({
        categoryPage,
        checkoutPage,
        homePage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        const product = PRODUCTS.hpPavilion15T;
        const expectedQuantity = 1;

        test.info().annotations.push(
            { type: 'feature', description: 'Checkout' },
            { type: 'story', description: 'Start checkout from shopping cart with products' },
            { type: 'tag', description: 'FR-044' },
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

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the Shopping Cart contains the added product', async () => {
            await shoppingCartPage.verifyProductName(product.name);
        });

        await test.step('Start checkout from Shopping Cart', async () => {
            await shoppingCartPage.checkout();
        });

        await test.step('Verify the Order Payment page is displayed', async () => {
            await checkoutPage.verifyOrderPaymentIsDisplayed();
        });

        await test.step('Verify the Order Summary preserves the current cart product', async () => {
            await checkoutPage.verifyOrderSummaryContainsProduct(product.name);
        });
    });

    test('TC-040: Authentication Is Required Before Checkout Can Continue', async ({
        categoryPage,
        checkoutPage,
        homePage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        const product = PRODUCTS.hpPavilion15T;
        const expectedQuantity = 1;

        test.info().annotations.push(
            { type: 'feature', description: 'Checkout' },
            { type: 'story', description: 'Require authentication before continuing checkout' },
            { type: 'tag', description: 'FR-045' },
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

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the Shopping Cart contains the added product', async () => {
            await shoppingCartPage.verifyProductName(product.name);
        });

        await test.step('Start checkout from Shopping Cart', async () => {
            await shoppingCartPage.checkout();
        });

        await test.step('Verify the Order Payment page is displayed', async () => {
            await checkoutPage.verifyOrderPaymentIsDisplayed();
        });

        await test.step('Verify authentication is required before checkout can continue', async () => {
            await checkoutPage.verifyAuthenticationIsRequired();
        });
    });

    test('TC-041: Order Summary Displays Current Cart Products', async ({
        categoryPage,
        checkoutPage,
        homePage,
        loginPage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        const product = PRODUCTS.hpPavilion15T;
        const user = USERS.existingUser;
        const expectedQuantity = 1;
        let shipping = user.shipping.primary;
        let shoppingCartProductPrice = '';
        let shoppingCartTotal = '';
        let orderSummaryProductPrice = '';
        let orderSummaryTotal = '';

        test.info().annotations.push(
            { type: 'feature', description: 'Checkout' },
            { type: 'story', description: 'Display current cart products in order summary' },
            { type: 'tag', description: 'FR-046' },
            { type: 'tag', description: 'FR-042' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Sign in with the existing user', async () => {
            await loginPage.signInAs(user.username, user.password);
            await loginPage.verifyUserIsSignedIn(user.username);
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

        await test.step('Capture the Shopping Cart product price', async () => {
            shoppingCartProductPrice = await shoppingCartPage.getProductPrice();
        });

        await test.step('Capture the Shopping Cart total', async () => {
            shoppingCartTotal = await shoppingCartPage.getCartTotal();
        });

        await test.step('Start checkout from Shopping Cart', async () => {
            await shoppingCartPage.checkout();
        });

        await test.step('Verify the Order Payment page is displayed', async () => {
            await checkoutPage.verifyOrderPaymentIsDisplayed();
        });

        await test.step('Verify the Order Summary product information', async () => {
            await checkoutPage.verifyOrderSummaryProductName(product.name);
            await checkoutPage.verifyOrderSummaryQuantity(expectedQuantity);
            await checkoutPage.verifyOrderSummaryColor(product.alternateColor);
        });

        await test.step('Capture the Order Summary product price', async () => {
            orderSummaryProductPrice = await checkoutPage.getOrderSummaryProductPrice();
        });

        await test.step('Capture the Order Summary total', async () => {
            orderSummaryTotal = await checkoutPage.getOrderSummaryTotal();
        });

        await test.step('Verify the Order Summary product price matches Shopping Cart', async () => {
            expect(toCents(orderSummaryProductPrice)).toBe(toCents(shoppingCartProductPrice));
        });

        await test.step('Verify the Order Summary total matches Shopping Cart', async () => {
            expect(toCents(orderSummaryTotal)).toBe(toCents(shoppingCartTotal));
        });
    });

    test('TC-042: Shipping Details Step Is Displayed During Checkout', async ({
        categoryPage,
        checkoutPage,
        homePage,
        loginPage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        const product = PRODUCTS.hpPavilion15T;
        const user = USERS.existingUser;
        const expectedQuantity = 1;
        let shipping = user.shipping.primary;

        test.info().annotations.push(
            { type: 'feature', description: 'Checkout' },
            { type: 'story', description: 'Display shipping details step during checkout' },
            { type: 'tag', description: 'FR-047' },
            { type: 'tag', description: 'FR-050' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Sign in with the existing user', async () => {
            await loginPage.signInAs(user.username, user.password);
            await loginPage.verifyUserIsSignedIn(user.username);
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

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the Shopping Cart contains the added product', async () => {
            await shoppingCartPage.verifyProductName(product.name);
        });

        await test.step('Start checkout from Shopping Cart', async () => {
            await shoppingCartPage.checkout();
        });

        await test.step('Verify the Order Payment page is displayed', async () => {
            await checkoutPage.verifyOrderPaymentIsDisplayed();
        });

        await test.step('Verify Shipping Details is the active checkout step', async () => {
            await checkoutPage.verifyShippingDetailsStepIsActive();
        });

        await test.step('Verify Payment Method is visible but not active', async () => {
            await checkoutPage.verifyPaymentMethodStepIsNotActive();
        });

        await test.step('Verify shipping details and available actions are displayed', async () => {
            await checkoutPage.verifyShippingDetailsAreDisplayed();
        });
    });

    test('TC-043: Shipping Details Can Be Edited With Valid Information', async ({
        categoryPage,
        checkoutPage,
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
            { type: 'feature', description: 'Checkout' },
            { type: 'story', description: 'Edit shipping details with valid information' },
            { type: 'tag', description: 'FR-048' },
            { type: 'tag', description: 'FR-050' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Sign in with the existing user', async () => {
            await loginPage.signInAs(user.username, user.password);
            await loginPage.verifyUserIsSignedIn(user.username);
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

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the Shopping Cart contains the added product', async () => {
            await shoppingCartPage.verifyProductName(product.name);
        });

        await test.step('Start checkout from Shopping Cart', async () => {
            await shoppingCartPage.checkout();
        });

        await test.step('Verify the Order Payment page is displayed', async () => {
            await checkoutPage.verifyOrderPaymentIsDisplayed();
        });

        await test.step('Verify Shipping Details is the active checkout step', async () => {
            await checkoutPage.verifyShippingDetailsStepIsActive();
        });

        await test.step('Open shipping details edit mode', async () => {
            await checkoutPage.openShippingDetailsEditMode();
        });

        await test.step('Enter valid shipping city', async () => {
            await checkoutPage.enterShippingCity(user.shipping.primary.city);
        });

        await test.step('Enter valid shipping address', async () => {
            await checkoutPage.enterShippingAddress(user.shipping.primary.address);
        });

        await test.step('Disable saving shipping details for future use', async () => {
            await checkoutPage.disableSaveShippingDetailsForFutureUse();
        });

        await test.step('Continue from Shipping Details edit mode', async () => {
            await checkoutPage.continueFromShippingDetailsEditMode();
        });

        await test.step('Verify Payment Method is the active checkout step', async () => {
            await checkoutPage.verifyPaymentMethodStepIsActive();
        });
    });

    test('TC-044: Shipping Details Cannot Be Submitted With Missing Required Fields', async ({
        categoryPage,
        checkoutPage,
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
            { type: 'feature', description: 'Checkout' },
            { type: 'story', description: 'Prevent checkout progression with missing required shipping information' },
            { type: 'tag', description: 'FR-049' },
            { type: 'tag', description: 'FR-050' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Sign in with the existing user', async () => {
            await loginPage.signInAs(user.username, user.password);
            await loginPage.verifyUserIsSignedIn(user.username);
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

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the Shopping Cart contains the added product', async () => {
            await shoppingCartPage.verifyProductName(product.name);
        });

        await test.step('Start checkout from Shopping Cart', async () => {
            await shoppingCartPage.checkout();
        });

        await test.step('Verify the Order Payment page is displayed', async () => {
            await checkoutPage.verifyOrderPaymentIsDisplayed();
        });

        await test.step('Verify Shipping Details is the active checkout step', async () => {
            await checkoutPage.verifyShippingDetailsStepIsActive();
        });

        await test.step('Open shipping details edit mode', async () => {
            await checkoutPage.openShippingDetailsEditMode();
        });

        await test.step('Clear the required Country field', async () => {
            await checkoutPage.clearShippingCountry();
        });

        await test.step('Disable saving shipping details for future use', async () => {
            await checkoutPage.disableSaveShippingDetailsForFutureUse();
        });

        await test.step('Attempt to continue from Shipping Details edit mode', async () => {
            await checkoutPage.continueFromShippingDetailsEditMode();
        });

        await test.step('Verify Shipping Details edit mode is still displayed', async () => {
            await checkoutPage.verifyShippingDetailsEditModeIsDisplayed();
        });

        await test.step('Verify Payment Method is still not active', async () => {
            await checkoutPage.verifyPaymentMethodStepIsNotActive();
        });
    });

    test('TC-045: Shipping Details Can Be Saved For Future Purchases', async ({
        categoryPage,
        checkoutPage,
        homePage,
        loginPage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        test.slow();
        const product = PRODUCTS.hpPavilion15T;
        const user = USERS.existingUser;
        const expectedQuantity = 1;
        let originalCity = '';
        let originalAddress = '';
        let shipping: typeof user.shipping.primary | typeof user.shipping.alternate =
            user.shipping.primary;

        test.info().annotations.push(
            { type: 'feature', description: 'Checkout' },
            { type: 'story', description: 'Save shipping details for future purchases' },
            { type: 'tag', description: 'FR-049' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Sign in with the existing user', async () => {
            await loginPage.signInAs(user.username, user.password);
            await loginPage.verifyUserIsSignedIn(user.username);
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

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Start checkout from Shopping Cart', async () => {
            await shoppingCartPage.checkout();
        });

        await test.step('Verify the Order Payment page is displayed', async () => {
            await checkoutPage.verifyOrderPaymentIsDisplayed();
        });

        await test.step('Verify Shipping Details is the active checkout step', async () => {
            await checkoutPage.verifyShippingDetailsStepIsActive();
        });

        await test.step('Open shipping details edit mode', async () => {
            await checkoutPage.openShippingDetailsEditMode();
        });

        await test.step('Capture original shipping details', async () => {
            originalCity = await checkoutPage.getShippingCity();
            originalAddress = await checkoutPage.getShippingAddress();
        });

        await test.step('Select shipping details that differ from the current saved values', async () => {
            shipping = originalCity === user.shipping.primary.city
                ? user.shipping.alternate
                : user.shipping.primary;
        });

        await test.step('Enter valid shipping details', async () => {
            await checkoutPage.enterShippingCity(shipping.city);
            await checkoutPage.enterShippingAddress(shipping.address);
        });

        await test.step('Enable saving shipping details for future use', async () => {
            await checkoutPage.enableSaveShippingDetailsForFutureUse();
        });

        await test.step('Continue from Shipping Details edit mode', async () => {
            await checkoutPage.continueFromShippingDetailsEditMode();
        });

        await test.step('Verify Payment Method is the active checkout step', async () => {
            await checkoutPage.verifyPaymentMethodStepIsActive();
        });

        await test.step('Navigate back to the Home Page without completing payment', async () => {
            await homePage.open();
            await homePage.verifyProductCategoriesAreVisible();
        });

        await test.step('Select the LAPTOPS category again from Home Page', async () => {
            await homePage.selectProductCategory(product.category);
        });

        await test.step('Verify the Category Page is displayed again', async () => {
            await categoryPage.verifyCategoryTitleIsDisplayed(product.category);
        });

        await test.step('Verify the deterministic product again from Category Page', async () => {
            const productName = await categoryPage.getProductNameByIndex(product.index);
            expect(productName.toLowerCase()).toBe(product.name.toLowerCase());
        });

        await test.step('Select the deterministic product again from Category Page', async () => {
            await categoryPage.selectProductByIndex(product.index);
        });

        await test.step('Verify the Product Details Page is displayed again', async () => {
            await productDetailsPage.verifyProductDetailsPageIsDisplayed();
        });

        await test.step('Add the product to cart again', async () => {
            await productDetailsPage.addToCart();
        });

        await test.step('Open the Shopping Cart page again', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed again', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Start checkout again from Shopping Cart', async () => {
            await shoppingCartPage.checkout();
        });

        await test.step('Verify the Order Payment page is displayed again', async () => {
            await checkoutPage.verifyOrderPaymentIsDisplayed();
        });

        await test.step('Sign in from Order Payment again', async () => {
            await checkoutPage.enterCheckoutUsername(user.username);
            await checkoutPage.enterCheckoutPassword(user.password);
            await checkoutPage.loginFromCheckout();
        });

        await test.step('Verify Shipping Details is active again', async () => {
            await checkoutPage.verifyShippingDetailsStepIsActive();
        });

        await test.step('Open shipping details edit mode again', async () => {
            await checkoutPage.openShippingDetailsEditMode();
        });

        await test.step('Verify saved shipping details are preloaded', async () => {
            expect(await checkoutPage.getShippingCity()).toBe(shipping.city);
            expect(await checkoutPage.getShippingAddress()).toBe(shipping.address);
        });

        await test.step('Restore original shipping details', async () => {
            await checkoutPage.enterShippingCity(originalCity);
            await checkoutPage.enterShippingAddress(originalAddress);
        });

        await test.step('Enable saving original shipping details for future use', async () => {
            await checkoutPage.enableSaveShippingDetailsForFutureUse();
        });

        await test.step('Save the restored shipping details', async () => {
            await checkoutPage.continueFromShippingDetailsEditMode();
        });

        await test.step('Verify Payment Method is active after restoring shipping details', async () => {
            await checkoutPage.verifyPaymentMethodStepIsActive();
        });

        await test.step('Open the Shopping Cart page for cleanup', async () => {
            await miniCartComponent.openShoppingCart();
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Remove all products from the Shopping Cart', async () => {
            await shoppingCartPage.removeAllProducts();
        });

        await test.step('Verify the Shopping Cart is empty after cleanup', async () => {
            await shoppingCartPage.verifyCartHasNoProducts();
            await shoppingCartPage.verifyEmptyCartMessageIsDisplayed();
        });

        await test.step('Sign out if the user session is still active', async () => {
            await loginPage.signOutIfSignedIn(user.username);
        });

        await test.step('Sign in again with the same user', async () => {
            await loginPage.signInAs(user.username, user.password);
            await loginPage.verifyUserIsSignedIn(user.username);
        });

        await test.step('Open the Shopping Cart page after re-authentication', async () => {
            await miniCartComponent.openShoppingCart();
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the authenticated Shopping Cart remains empty after cleanup', async () => {
            await shoppingCartPage.verifyCartHasNoProducts();
            await shoppingCartPage.verifyEmptyCartMessageIsDisplayed();
        });
    });

    test('TC-046: Payment Method Step Is Displayed After Shipping Details', async ({
        categoryPage,
        checkoutPage,
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
            { type: 'feature', description: 'Checkout' },
            { type: 'story', description: 'Display payment methods after shipping details' },
            { type: 'tag', description: 'FR-050' },
            { type: 'tag', description: 'FR-051' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Sign in with the existing user', async () => {
            await loginPage.signInAs(user.username, user.password);
            await loginPage.verifyUserIsSignedIn(user.username);
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

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Start checkout from Shopping Cart', async () => {
            await shoppingCartPage.checkout();
        });

        await test.step('Verify the Order Payment page is displayed', async () => {
            await checkoutPage.verifyOrderPaymentIsDisplayed();
        });

        await test.step('Verify Shipping Details is the active checkout step', async () => {
            await checkoutPage.verifyShippingDetailsStepIsActive();
        });

        await test.step('Continue from Shipping Details', async () => {
            await checkoutPage.continueFromShippingDetails();
        });

        await test.step('Verify Payment Method is the active checkout step', async () => {
            await checkoutPage.verifyPaymentMethodStepIsActive();
        });

        await test.step('Verify available payment methods are displayed', async () => {
            await checkoutPage.verifyPaymentMethodsAreDisplayed();
        });

        await test.step('Open the Shopping Cart page for cleanup', async () => {
            await miniCartComponent.openShoppingCart();
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Remove all products from the Shopping Cart', async () => {
            await shoppingCartPage.removeAllProducts();
        });

        await test.step('Verify the Shopping Cart is empty after cleanup', async () => {
            await shoppingCartPage.verifyCartHasNoProducts();
            await shoppingCartPage.verifyEmptyCartMessageIsDisplayed();
        });

    });

    test('TC-047: Order Can Be Paid Using SafePay With Valid Data', async ({
        categoryPage,
        checkoutPage,
        homePage,
        loginPage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        test.slow();
        const product = PRODUCTS.hpPavilion15T;
        const user = USERS.existingUser;
        const expectedQuantity = 1;

        test.info().annotations.push(
            { type: 'feature', description: 'Checkout' },
            { type: 'story', description: 'Pay order using SafePay with valid data' },
            { type: 'tag', description: 'FR-052' },
            { type: 'tag', description: 'FR-056' },
            { type: 'tag', description: 'FR-057' },
            { type: 'tag', description: 'FR-058' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Sign in with the existing user', async () => {
            await loginPage.signInAs(user.username, user.password);
            await loginPage.verifyUserIsSignedIn(user.username);
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

        await test.step('Verify the cart badge quantity', async () => {
            await miniCartComponent.verifyCartBadgeQuantity(expectedQuantity);
        });

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Start checkout from Shopping Cart', async () => {
            await shoppingCartPage.checkout();
        });

        await test.step('Verify the Order Payment page is displayed', async () => {
            await checkoutPage.verifyOrderPaymentIsDisplayed();
        });

        await test.step('Verify Shipping Details is the active checkout step', async () => {
            await checkoutPage.verifyShippingDetailsStepIsActive();
        });

        await test.step('Continue from Shipping Details', async () => {
            await checkoutPage.continueFromShippingDetails();
        });

        await test.step('Verify Payment Method is the active checkout step', async () => {
            await checkoutPage.verifyPaymentMethodStepIsActive();
        });

        await test.step('Verify available payment methods are displayed', async () => {
            await checkoutPage.verifyPaymentMethodsAreDisplayed();
        });

        await test.step('Enter valid SafePay credentials', async () => {
            await checkoutPage.enterSafePayUsername(user.username);
            await checkoutPage.enterSafePayPassword(user.password);
        });

        await test.step('Disable saving SafePay details for future use', async () => {
            await checkoutPage.disableSaveSafePayDetailsForFutureUse();
        });

        await test.step('Verify SafePay payment can be submitted', async () => {
            await checkoutPage.verifySafePayNowIsEnabled();
        });

        await test.step('Submit payment with SafePay', async () => {
            await checkoutPage.payNowWithSafePay();
        });

        await test.step('Verify order confirmation is displayed', async () => {
            await checkoutPage.verifyOrderConfirmationIsDisplayed();
        });

        await test.step('Verify generated order identifiers are displayed', async () => {
            await checkoutPage.verifyTrackingNumberIsGenerated();
            await checkoutPage.verifyOrderNumberIsGenerated();
        });

        await test.step('Verify confirmation payment method is SafePay', async () => {
            await checkoutPage.verifyConfirmationPaymentMethod('SafePay');
        });

        await test.step('Verify the user remains signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });

        await test.step('Verify the cart is empty after purchase', async () => {
            await miniCartComponent.verifyCartBadgeIsNotDisplayed();
            await miniCartComponent.showMiniCart();
            await miniCartComponent.verifyEmptyCartStateIsDisplayed();
        });
    });

    test('TC-048: Order Can Be Paid Using MasterCredit With Valid Data', async ({
        categoryPage,
        checkoutPage,
        homePage,
        loginPage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        test.slow();
        const product = PRODUCTS.hpPavilion15T;
        const user = USERS.existingUser;
        const masterCredit = CHECKOUT_DATA.masterCredit;
        const expectedQuantity = 1;

        test.info().annotations.push(
            { type: 'feature', description: 'Checkout' },
            { type: 'story', description: 'Pay order using MasterCredit with valid data' },
            { type: 'tag', description: 'FR-053' },
            { type: 'tag', description: 'FR-056' },
            { type: 'tag', description: 'FR-057' },
            { type: 'tag', description: 'FR-058' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Sign in with the existing user', async () => {
            await loginPage.signInAs(user.username, user.password);
            await loginPage.verifyUserIsSignedIn(user.username);
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

        await test.step('Verify the cart badge quantity', async () => {
            await miniCartComponent.verifyCartBadgeQuantity(expectedQuantity);
        });

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Start checkout from Shopping Cart', async () => {
            await shoppingCartPage.checkout();
        });

        await test.step('Verify the Order Payment page is displayed', async () => {
            await checkoutPage.verifyOrderPaymentIsDisplayed();
        });

        await test.step('Verify Shipping Details is the active checkout step', async () => {
            await checkoutPage.verifyShippingDetailsStepIsActive();
        });

        await test.step('Continue from Shipping Details', async () => {
            await checkoutPage.continueFromShippingDetails();
        });

        await test.step('Verify Payment Method is the active checkout step', async () => {
            await checkoutPage.verifyPaymentMethodStepIsActive();
        });

        await test.step('Verify available payment methods are displayed', async () => {
            await checkoutPage.verifyPaymentMethodsAreDisplayed();
        });

        await test.step('Select MasterCredit payment method', async () => {
            await checkoutPage.selectMasterCredit();
            await checkoutPage.openMasterCreditEditModeIfNeeded();
        });

        await test.step('Enter valid MasterCredit card details', async () => {
            await checkoutPage.enterMasterCreditCardNumber(masterCredit.cardNumber);
            await checkoutPage.enterMasterCreditCvv(masterCredit.cvv);
            await checkoutPage.selectMasterCreditExpirationMonth(masterCredit.expirationMonth);
            await checkoutPage.selectMasterCreditExpirationYear(masterCredit.expirationYear);
            await checkoutPage.enterMasterCreditCardholderName(masterCredit.cardholderName);
        });

        await test.step('Enable saving MasterCredit details for future use', async () => {
            await checkoutPage.enableSaveMasterCreditDetailsForFutureUse();
        });

        await test.step('Verify MasterCredit payment can be submitted', async () => {
            await checkoutPage.verifyMasterCreditPayNowIsEnabled();
        });

        await test.step('Submit payment with MasterCredit', async () => {
            await checkoutPage.payNowWithMasterCredit();
        });

        await test.step('Verify order confirmation is displayed', async () => {
            await checkoutPage.verifyOrderConfirmationIsDisplayed();
        });

        await test.step('Verify generated order identifiers are displayed', async () => {
            await checkoutPage.verifyTrackingNumberIsGenerated();
            await checkoutPage.verifyOrderNumberIsGenerated();
        });

        await test.step('Verify confirmation payment method is MasterCredit', async () => {
            await checkoutPage.verifyConfirmationPaymentMethod('MasterCredit');
        });

        await test.step('Verify the user remains signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });

        await test.step('Verify the cart is empty after purchase', async () => {
            await miniCartComponent.verifyCartBadgeIsNotDisplayed();
            await miniCartComponent.showMiniCart();
            await miniCartComponent.verifyEmptyCartStateIsDisplayed();
        });
    });

    test('TC-049: Payment Method Can Be Saved For Future Use', async ({
        categoryPage,
        checkoutPage,
        homePage,
        loginPage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        test.slow();
        const product = PRODUCTS.hpPavilion15T;
        const user = USERS.paymentPersistenceUser;
        const masterCredit = CHECKOUT_DATA.masterCredit;
        const expectedQuantity = 1;

        test.info().annotations.push(
            { type: 'feature', description: 'Checkout' },
            { type: 'story', description: 'Save payment method for future use' },
            { type: 'tag', description: 'FR-054' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Sign in with the existing user', async () => {
            await loginPage.signInAs(user.username, user.password);
            await loginPage.verifyUserIsSignedIn(user.username);
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

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Start checkout from Shopping Cart', async () => {
            await shoppingCartPage.checkout();
        });

        await test.step('Verify the Order Payment page is displayed', async () => {
            await checkoutPage.verifyOrderPaymentIsDisplayed();
        });

        await test.step('Continue from Shipping Details', async () => {
            await checkoutPage.verifyShippingDetailsStepIsActive();
            await checkoutPage.continueFromShippingDetails();
        });

        await test.step('Select MasterCredit payment method', async () => {
            await checkoutPage.verifyPaymentMethodStepIsActive();
            await checkoutPage.verifyPaymentMethodsAreDisplayed();
            await checkoutPage.selectMasterCredit();
            await checkoutPage.openMasterCreditEditModeIfNeeded();
        });

        await test.step('Enter valid MasterCredit card details', async () => {
            await checkoutPage.enterMasterCreditCardNumber(masterCredit.cardNumber);
            await checkoutPage.enterMasterCreditCvv(masterCredit.cvv);
            await checkoutPage.selectMasterCreditExpirationMonth(masterCredit.expirationMonth);
            await checkoutPage.selectMasterCreditExpirationYear(masterCredit.expirationYear);
            await checkoutPage.enterMasterCreditCardholderName(masterCredit.cardholderName);
        });

        await test.step('Enable saving MasterCredit details for future use', async () => {
            await checkoutPage.enableSaveMasterCreditDetailsForFutureUse();
        });

        await test.step('Save MasterCredit details for future use', async () => {
            await checkoutPage.verifyMasterCreditPayNowIsEnabled();
            await checkoutPage.saveMasterCreditForFutureUse();
        });

        await test.step('Start a new checkout flow with the same user', async () => {
            await miniCartComponent.openShoppingCart();
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
            await shoppingCartPage.checkout();
            await checkoutPage.verifyOrderPaymentIsDisplayed();
            await checkoutPage.verifyShippingDetailsStepIsActive();
            await checkoutPage.continueFromShippingDetails();
            await checkoutPage.verifyPaymentMethodStepIsActive();
        });

        await test.step('Verify saved MasterCredit is available for future use', async () => {
            await checkoutPage.verifyMasterCreditIsSelected();
            await checkoutPage.verifySavedMasterCreditIsDisplayed();
            await checkoutPage.verifyMasterCreditPayNowIsEnabled();
        });

        await test.step('Clean up the Shopping Cart after persistence verification', async () => {
            await miniCartComponent.openShoppingCart();
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
            await shoppingCartPage.removeAllProducts();
            await shoppingCartPage.verifyCartHasNoProducts();
            await shoppingCartPage.verifyEmptyCartMessageIsDisplayed();
        });
    });

    test('TC-050: Payment Submission Is Blocked When Mandatory Payment Data Is Missing', async ({
        categoryPage,
        checkoutPage,
        homePage,
        loginPage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        test.slow();
        const product = PRODUCTS.hpPavilion15T;
        const user = USERS.existingUser;
        const masterCredit = CHECKOUT_DATA.masterCredit;
        const expectedQuantity = 1;

        test.info().annotations.push(
            { type: 'feature', description: 'Checkout' },
            { type: 'story', description: 'Mandatory payment validation' },
            { type: 'tag', description: 'FR-055' },
            { type: 'tag', description: 'FR-056' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Sign in with the existing user', async () => {
            await loginPage.signInAs(user.username, user.password);
            await loginPage.verifyUserIsSignedIn(user.username);
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

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Start checkout from Shopping Cart', async () => {
            await shoppingCartPage.checkout();
        });

        await test.step('Verify the Order Payment page is displayed', async () => {
            await checkoutPage.verifyOrderPaymentIsDisplayed();
        });

        await test.step('Continue from Shipping Details', async () => {
            await checkoutPage.verifyShippingDetailsStepIsActive();
            await checkoutPage.continueFromShippingDetails();
        });

        await test.step('Select MasterCredit payment method', async () => {
            await checkoutPage.verifyPaymentMethodStepIsActive();
            await checkoutPage.verifyPaymentMethodsAreDisplayed();
            await checkoutPage.selectMasterCredit();
            await checkoutPage.openMasterCreditEditModeIfNeeded();
        });

        await test.step('Enter MasterCredit data without CVV', async () => {
            await checkoutPage.enterMasterCreditCardNumber(masterCredit.cardNumber);
            await checkoutPage.clearMasterCreditCvv();
            await checkoutPage.selectMasterCreditExpirationMonth(masterCredit.expirationMonth);
            await checkoutPage.selectMasterCreditExpirationYear(masterCredit.expirationYear);
            await checkoutPage.enterMasterCreditCardholderName(masterCredit.cardholderName);
        });

        await test.step('Enable saving MasterCredit details for future use', async () => {
            await checkoutPage.enableSaveMasterCreditDetailsForFutureUse();
        });

        await test.step('Verify CVV required validation blocks payment submission', async () => {
            await checkoutPage.verifyMasterCreditCvvRequiredErrorIsDisplayed();
            await checkoutPage.verifyMasterCreditPayNowIsDisabled();
        });

        await test.step('Clean up the Shopping Cart after payment validation', async () => {
            await miniCartComponent.openShoppingCart();
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
            await shoppingCartPage.removeAllProducts();
            await shoppingCartPage.verifyCartHasNoProducts();
            await shoppingCartPage.verifyEmptyCartMessageIsDisplayed();
        });
    });

    test('TC-051: User Can Navigate Between Checkout Steps Without Losing Data', async ({
        categoryPage,
        checkoutPage,
        homePage,
        loginPage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        const product = PRODUCTS.hpPavilion15T;
        const user = USERS.existingUser;
        const shippingCountry = CHECKOUT_DATA.shipping.navigationCountry;
        const expectedQuantity = 1;

        test.info().annotations.push(
            { type: 'feature', description: 'Checkout' },
            { type: 'story', description: 'Navigate between checkout steps without losing data' },
            { type: 'tag', description: 'FR-050' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Sign in with the existing user', async () => {
            await loginPage.signInAs(user.username, user.password);
            await loginPage.verifyUserIsSignedIn(user.username);
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

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Start checkout from Shopping Cart', async () => {
            await shoppingCartPage.checkout();
        });

        await test.step('Verify the Order Payment page is displayed', async () => {
            await checkoutPage.verifyOrderPaymentIsDisplayed();
        });

        await test.step('Verify Shipping Details is the active checkout step', async () => {
            await checkoutPage.verifyShippingDetailsStepIsActive();
        });

        await test.step('Open shipping details edit mode', async () => {
            await checkoutPage.openShippingDetailsEditMode();
        });

        await test.step('Change the shipping country', async () => {
            await checkoutPage.selectShippingCountry(shippingCountry);
        });

        await test.step('Disable saving shipping details for future use', async () => {
            await checkoutPage.disableSaveShippingDetailsForFutureUse();
        });

        await test.step('Continue from Shipping Details edit mode', async () => {
            await checkoutPage.continueFromShippingDetailsEditMode();
        });

        await test.step('Verify Payment Method is the active checkout step', async () => {
            await checkoutPage.verifyPaymentMethodStepIsActive();
        });

        await test.step('Go back to Shipping Details', async () => {
            await checkoutPage.backToShippingDetails();
        });

        await test.step('Verify the shipping country was preserved', async () => {
            await checkoutPage.verifyShippingCountry(shippingCountry);
        });

        await test.step('Continue again to Payment Method', async () => {
            await checkoutPage.continueFromShippingDetails();
        });

        await test.step('Verify Payment Method is active again', async () => {
            await checkoutPage.verifyPaymentMethodStepIsActive();
        });

        await test.step('Clean up the Shopping Cart after checkout step navigation', async () => {
            await miniCartComponent.openShoppingCart();
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
            await shoppingCartPage.removeAllProducts();
            await shoppingCartPage.verifyCartHasNoProducts();
            await shoppingCartPage.verifyEmptyCartMessageIsDisplayed();
        });
    });

    test('TC-052: Order Confirmation Displays Completed Purchase Information', async ({
        categoryPage,
        checkoutPage,
        homePage,
        loginPage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        test.slow();
        const product = PRODUCTS.hpPavilion15T;
        const user = USERS.existingUser;
        const expectedQuantity = 1;
        const expectedShipping = '$0.00';
        let expectedSubtotal = '';

        test.info().annotations.push(
            { type: 'feature', description: 'Checkout' },
            { type: 'story', description: 'Display completed purchase information' },
            { type: 'tag', description: 'FR-056' },
            { type: 'tag', description: 'FR-057' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Sign in with the existing user', async () => {
            await loginPage.signInAs(user.username, user.password);
            await loginPage.verifyUserIsSignedIn(user.username);
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

        await test.step('Capture the selected product price', async () => {
            expectedSubtotal = await productDetailsPage.getProductPrice();
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

        await test.step('Verify the cart badge quantity', async () => {
            await miniCartComponent.verifyCartBadgeQuantity(expectedQuantity);
        });

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Start checkout from Shopping Cart', async () => {
            await shoppingCartPage.checkout();
        });

        await test.step('Verify the Order Payment page is displayed', async () => {
            await checkoutPage.verifyOrderPaymentIsDisplayed();
        });

        await test.step('Verify Shipping Details is the active checkout step', async () => {
            await checkoutPage.verifyShippingDetailsStepIsActive();
        });

        await test.step('Continue from Shipping Details', async () => {
            await checkoutPage.continueFromShippingDetails();
        });

        await test.step('Verify Payment Method is the active checkout step', async () => {
            await checkoutPage.verifyPaymentMethodStepIsActive();
        });

        await test.step('Verify available payment methods are displayed', async () => {
            await checkoutPage.verifyPaymentMethodsAreDisplayed();
        });

        await test.step('Enter valid SafePay credentials', async () => {
            await checkoutPage.enterSafePayUsername(user.username);
            await checkoutPage.enterSafePayPassword(user.password);
        });

        await test.step('Disable saving SafePay details for future use', async () => {
            await checkoutPage.disableSaveSafePayDetailsForFutureUse();
        });

        await test.step('Verify SafePay payment can be submitted', async () => {
            await checkoutPage.verifySafePayNowIsEnabled();
        });

        await test.step('Submit payment with SafePay', async () => {
            await checkoutPage.payNowWithSafePay();
        });

        await test.step('Verify order confirmation is displayed', async () => {
            await checkoutPage.verifyOrderConfirmationIsDisplayed();
        });

        await test.step('Verify generated order identifiers are displayed', async () => {
            await checkoutPage.verifyTrackingNumberIsGenerated();
            await checkoutPage.verifyOrderNumberIsGenerated();
        });

        await test.step('Verify confirmation payment method is SafePay', async () => {
            await checkoutPage.verifyConfirmationPaymentMethod('SafePay');
        });

        await test.step('Verify confirmation shipping information is displayed', async () => {
            await checkoutPage.verifyConfirmationShippingTo(user.username);
        });

        await test.step('Verify confirmation totals are displayed', async () => {
            await checkoutPage.verifyConfirmationSubtotal(expectedSubtotal);
            await checkoutPage.verifyConfirmationShipping(expectedShipping);
            await checkoutPage.verifyConfirmationTotal(expectedSubtotal);
        });
    });

    test('TC-053: Cart Is Cleared After Successful Purchase', async ({
        categoryPage,
        checkoutPage,
        homePage,
        loginPage,
        miniCartComponent,
        productDetailsPage,
        shoppingCartPage,
    }) => {
        test.slow();
        const product = PRODUCTS.hpPavilion15T;
        const user = USERS.existingUser;
        const expectedQuantity = 1;

        test.info().annotations.push(
            { type: 'feature', description: 'Checkout' },
            { type: 'story', description: 'Clear cart after successful purchase' },
            { type: 'tag', description: 'FR-058' },
            { type: 'tag', description: 'FR-038' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Sign in with the existing user', async () => {
            await loginPage.signInAs(user.username, user.password);
            await loginPage.verifyUserIsSignedIn(user.username);
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

        await test.step('Verify the cart badge quantity', async () => {
            await miniCartComponent.verifyCartBadgeQuantity(expectedQuantity);
        });

        await test.step('Open the Shopping Cart page', async () => {
            await miniCartComponent.openShoppingCart();
        });

        await test.step('Verify the Shopping Cart page is displayed', async () => {
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the Shopping Cart contains the added product', async () => {
            await shoppingCartPage.verifyProductName(product.name);
            await shoppingCartPage.verifyProductQuantity(expectedQuantity);
        });

        await test.step('Start checkout from Shopping Cart', async () => {
            await shoppingCartPage.checkout();
        });

        await test.step('Verify the Order Payment page is displayed', async () => {
            await checkoutPage.verifyOrderPaymentIsDisplayed();
        });

        await test.step('Verify Shipping Details is the active checkout step', async () => {
            await checkoutPage.verifyShippingDetailsStepIsActive();
        });

        await test.step('Continue from Shipping Details', async () => {
            await checkoutPage.continueFromShippingDetails();
        });

        await test.step('Verify Payment Method is the active checkout step', async () => {
            await checkoutPage.verifyPaymentMethodStepIsActive();
        });

        await test.step('Verify available payment methods are displayed', async () => {
            await checkoutPage.verifyPaymentMethodsAreDisplayed();
        });

        await test.step('Enter valid SafePay credentials', async () => {
            await checkoutPage.enterSafePayUsername(user.username);
            await checkoutPage.enterSafePayPassword(user.password);
        });

        await test.step('Disable saving SafePay details for future use', async () => {
            await checkoutPage.disableSaveSafePayDetailsForFutureUse();
        });

        await test.step('Verify SafePay payment can be submitted', async () => {
            await checkoutPage.verifySafePayNowIsEnabled();
        });

        await test.step('Submit payment with SafePay', async () => {
            await checkoutPage.payNowWithSafePay();
        });

        await test.step('Verify order confirmation is displayed', async () => {
            await checkoutPage.verifyOrderConfirmationIsDisplayed();
        });

        await test.step('Verify Mini Cart is empty after purchase', async () => {
            await miniCartComponent.verifyCartBadgeIsNotDisplayed();
            await miniCartComponent.showMiniCart();
            await miniCartComponent.verifyEmptyCartStateIsDisplayed();
        });

        await test.step('Open the Shopping Cart page after purchase', async () => {
            await miniCartComponent.openShoppingCart();
            await shoppingCartPage.verifyShoppingCartPageIsDisplayed();
        });

        await test.step('Verify the Shopping Cart is empty after successful purchase', async () => {
            await shoppingCartPage.verifyCartHasNoProducts();
            await shoppingCartPage.verifyEmptyCartMessageIsDisplayed();
        });
    });
});
