import { test } from '../../fixtures/aos-fixture';
import { generateUniqueUser, USERS } from '../../test-data/ui/users.data';

test.describe('My Orders', () => {
    test('TC-082: Empty Orders State Is Displayed For User With No Orders', async ({
        homePage,
        loginPage,
        registerPage,
        myOrdersPage,
        myAccountPage,
    }) => {
        const user = generateUniqueUser();
        let accountCreated = false;

        test.info().annotations.push(
            { type: 'feature', description: 'My Orders' },
            { type: 'story', description: 'Display empty orders state for user with no orders' },
            { type: 'tag', description: 'FR-086' },
        );

        try {
            await test.step('Open the AOS Home Page', async () => {
                await homePage.open();
            });

            await test.step('Verify the user is not authenticated', async () => {
                await loginPage.verifyUserIsNotSignedIn();
            });

            await test.step('Open the login form from the account icon', async () => {
                await loginPage.openLoginForm();
            });

            await test.step('Open the Create Account page', async () => {
                await loginPage.openCreateAccountPage();
            });

            await test.step('Verify the Create Account page is displayed', async () => {
                await registerPage.verifyCreateAccountPageIsDisplayed();
            });

            await test.step('Fill the mandatory account fields', async () => {
                await registerPage.fillAccountFields(user);
            });

            await test.step('Accept the required agreement', async () => {
                await registerPage.acceptRequiredAgreement();
            });

            await test.step('Verify the REGISTER button is enabled', async () => {
                await registerPage.verifyRegisterButtonIsEnabled();
            });

            await test.step('Register the temporary user', async () => {
                await registerPage.registerAccount();
            });

            await test.step('Verify the temporary user is automatically signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
                accountCreated = true;
            });

            await test.step('Open My Orders', async () => {
                await loginPage.openMyOrders();
            });

            await test.step('Verify the My Orders page is displayed', async () => {
                await myOrdersPage.verifyMyOrdersPageIsDisplayed();
            });

            await test.step('Verify the empty orders state is displayed', async () => {
                await myOrdersPage.verifyEmptyOrdersStateIsDisplayed();
            });

            await test.step('Verify the temporary user remains signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });
        } finally {
            if (accountCreated) {
                if (!(await loginPage.isUserSignedIn(user.username))) {
                    await test.step('Sign in with the temporary user account for cleanup', async () => {
                        await loginPage.signInAs(user.username, user.password);
                        await loginPage.verifyUserIsSignedIn(user.username);
                    });
                }

                await test.step('Open My Account for cleanup', async () => {
                    await loginPage.openMyAccount();
                    await myAccountPage.verifyMyAccountPageIsDisplayed();
                });

                await test.step('Delete the temporary user account', async () => {
                    await myAccountPage.deleteAccountAndConfirm();
                    await myAccountPage.verifyAccountDeletedSuccessfullyMessageIsDisplayed();
                });

                await test.step('Verify the user is not authenticated after cleanup', async () => {
                    await loginPage.verifyUserIsNotSignedIn();
                });
            }
        }
    });

    test('TC-083: Completed Orders Are Displayed For Signed-In User', async ({
        homePage,
        loginPage,
        myOrdersPage,
    }) => {
        const user = USERS.existingUser;

        test.info().annotations.push(
            { type: 'feature', description: 'My Orders' },
            { type: 'story', description: 'Display completed orders for signed-in user' },
            { type: 'tag', description: 'FR-087' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Sign in with the existing user account', async () => {
            await loginPage.signInAs(user.username, user.password);
        });

        await test.step('Verify the existing user is signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });

        await test.step('Open My Orders', async () => {
            await loginPage.openMyOrders();
        });

        await test.step('Verify the My Orders page is displayed', async () => {
            await myOrdersPage.verifyMyOrdersPageIsDisplayed();
        });

        await test.step('Verify at least one completed order is displayed', async () => {
            await myOrdersPage.verifyCompletedOrdersAreDisplayed();
        });

        await test.step('Verify the first completed order contains identifiable information', async () => {
            await myOrdersPage.verifyFirstCompletedOrderHasIdentifiableInformation();
        });

        await test.step('Verify the user remains signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });
    });

    test('TC-084: Completed Order Details Can Be Reviewed', async ({
        homePage,
        loginPage,
        myOrdersPage,
    }) => {
        const user = USERS.existingUser;

        test.info().annotations.push(
            { type: 'feature', description: 'My Orders' },
            { type: 'story', description: 'Review completed order details' },
            { type: 'tag', description: 'FR-088' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Sign in with the existing user account', async () => {
            await loginPage.signInAs(user.username, user.password);
        });

        await test.step('Verify the existing user is signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });

        await test.step('Open My Orders', async () => {
            await loginPage.openMyOrders();
        });

        await test.step('Verify the My Orders page is displayed', async () => {
            await myOrdersPage.verifyMyOrdersPageIsDisplayed();
        });

        await test.step('Verify at least one completed order is displayed', async () => {
            await myOrdersPage.verifyCompletedOrdersAreDisplayed();
        });

        await test.step('Review and verify the first completed order details', async () => {
            await myOrdersPage.verifyFirstCompletedOrderDetails();
        });

        await test.step('Verify the user remains signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });
    });

    test('TC-085: Completed Order Can Be Removed After Confirmation', async ({
        homePage,
        loginPage,
        myOrdersPage,
    }) => {
        const user = USERS.existingUser;

        test.info().annotations.push(
            { type: 'feature', description: 'My Orders' },
            { type: 'story', description: 'Remove completed order after confirmation' },
            { type: 'tag', description: 'FR-089' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Sign in with the existing user account', async () => {
            await loginPage.signInAs(user.username, user.password);
        });

        await test.step('Verify the existing user is signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });

        await test.step('Open My Orders', async () => {
            await loginPage.openMyOrders();
        });

        await test.step('Verify the My Orders page is displayed', async () => {
            await myOrdersPage.verifyMyOrdersPageIsDisplayed();
        });

        await test.step('Verify at least one completed order is displayed', async () => {
            await myOrdersPage.verifyCompletedOrdersAreDisplayed();
        });

        const orderNumber = await test.step('Capture the first order number', async () => {
            return myOrdersPage.getFirstOrderNumber();
        });

        await test.step('Remove the first completed order', async () => {
            await myOrdersPage.removeFirstOrder();
        });

        await test.step('Verify the delete order confirmation modal is displayed', async () => {
            await myOrdersPage.verifyDeleteOrderConfirmationIsDisplayed();
        });

        await test.step('Confirm the order removal', async () => {
            await myOrdersPage.confirmOrderRemoval();
        });

        await test.step('Verify the confirmation modal is closed', async () => {
            await myOrdersPage.verifyDeleteOrderConfirmationIsHidden();
        });

        await test.step('Verify the removed order is no longer displayed', async () => {
            await myOrdersPage.verifyOrderIsNotDisplayed(orderNumber);
        });

        await test.step('Verify the user remains signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });
    });

    test('TC-086: Order Removal Can Be Canceled', async ({
        homePage,
        loginPage,
        myOrdersPage,
    }) => {
        const user = USERS.existingUser;

        test.info().annotations.push(
            { type: 'feature', description: 'My Orders' },
            { type: 'story', description: 'Cancel order removal' },
            { type: 'tag', description: 'FR-090' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Sign in with the existing user account', async () => {
            await loginPage.signInAs(user.username, user.password);
        });

        await test.step('Verify the existing user is signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });

        await test.step('Open My Orders', async () => {
            await loginPage.openMyOrders();
        });

        await test.step('Verify the My Orders page is displayed', async () => {
            await myOrdersPage.verifyMyOrdersPageIsDisplayed();
        });

        await test.step('Verify at least one order is displayed', async () => {
            await myOrdersPage.verifyCompletedOrdersAreDisplayed();
        });

        const orderNumber = await test.step('Capture the first order number', async () => {
            return myOrdersPage.getFirstOrderNumber();
        });

        await test.step('Start removing the first order', async () => {
            await myOrdersPage.removeFirstOrder();
        });

        await test.step('Verify the delete order confirmation modal is displayed', async () => {
            await myOrdersPage.verifyDeleteOrderConfirmationIsDisplayed();
        });

        await test.step('Cancel the order removal', async () => {
            await myOrdersPage.cancelOrderRemoval();
        });

        await test.step('Verify the confirmation modal is closed', async () => {
            await myOrdersPage.verifyDeleteOrderConfirmationIsHidden();
        });

        await test.step('Verify the selected order remains displayed', async () => {
            await myOrdersPage.verifyOrderIsDisplayed(orderNumber);
        });

        await test.step('Verify the user remains signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });
    });
});
