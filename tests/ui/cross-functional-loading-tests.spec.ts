import { test } from '../../fixtures/aos-fixture';

test.describe('Cross-Functional Loading', () => {
    test('TC-091: Loading Spinner Is Displayed During Page Navigation', async ({
        homePage,
        categoryPage,
    }) => {
        const categoryName = 'LAPTOPS';

        test.info().annotations.push(
            { type: 'feature', description: 'Cross-Functional Loading' },
            { type: 'story', description: 'Display loading spinner during page navigation' },
            { type: 'tag', description: 'FR-095' },
            { type: 'tag', description: 'FR-097' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Select the LAPTOPS category and verify the loading spinner cycle', async () => {
            await Promise.all([
                homePage.verifyLoadingSpinnerCycle(),
                homePage.selectProductCategory(categoryName),
            ]);
        });

        await test.step('Verify the LAPTOPS Category Page is displayed', async () => {
            await categoryPage.verifyCategoryTitleIsDisplayed(categoryName);
        });
    });

    test('TC-093: UI State Is Fully Refreshed After Loading Completes', async ({
        homePage,
        categoryPage,
        productDetailsPage,
    }) => {
        const categoryName = 'LAPTOPS';

        test.info().annotations.push(
            { type: 'feature', description: 'Cross-Functional Loading' },
            { type: 'story', description: 'Refresh UI state after loading completes' },
            { type: 'tag', description: 'FR-097' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Select the LAPTOPS category and wait for the loading spinner cycle', async () => {
            await Promise.all([
                homePage.verifyLoadingSpinnerCycle(),
                homePage.selectProductCategory(categoryName),
            ]);
        });

        await test.step('Verify the LAPTOPS Category Page is displayed', async () => {
            await categoryPage.verifyCategoryTitleIsDisplayed(categoryName);
        });

        await test.step('Verify at least one product is displayed', async () => {
            await categoryPage.verifyAtLeastOneProductIsDisplayed();
        });

        await test.step('Select the first available product', async () => {
            await categoryPage.selectProductByIndex(0);
        });

        await test.step('Verify the Product Details Page is displayed', async () => {
            await productDetailsPage.verifyProductDetailsPageIsDisplayed();
        });
    });
});
