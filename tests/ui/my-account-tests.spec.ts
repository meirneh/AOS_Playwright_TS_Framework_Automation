import { test } from '../../fixtures/aos-fixture';
import { USERS } from '../../test-data/ui/users.data';

test.describe('My Account', () => {
    test('TC-072: Signed-In User Can View Account Details', async ({
        homePage,
        loginPage,
        myAccountPage,
    }) => {
        const user = USERS.existingUser;

        test.info().annotations.push(
            { type: 'feature', description: 'My Account' },
            { type: 'story', description: 'View signed-in user account details' },
            { type: 'tag', description: 'FR-078' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Verify the user is not authenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });

        await test.step('Sign in with the existing user account', async () => {
            await loginPage.signInAs(user.username, user.password);
        });

        await test.step('Verify the existing user is signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });

        await test.step('Open My Account', async () => {
            await loginPage.openMyAccount();
        });

        await test.step('Verify the My Account page is displayed', async () => {
            await myAccountPage.verifyMyAccountPageIsDisplayed();
        });

        await test.step('Verify the Account details section is displayed', async () => {
            await myAccountPage.verifyAccountDetailsSectionIsDisplayed();
        });

        await test.step("Verify the authenticated user's username is displayed in Account details", async () => {
            await myAccountPage.verifyAccountDetailsUsername(user.username);
        });

        await test.step('Sign out from the existing user account', async () => {
            await loginPage.signOutIfSignedIn(user.username);
        });

        await test.step('Verify the user is signed out', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });
    });

    test('TC-073: Account Details Can Be Edited With Valid Data', async ({
        homePage,
        loginPage,
        myAccountPage,
    }) => {

        const user = USERS.existingUser;
        const updatedLastName = 'automation';
        const originalLastName = '';
        let accountDetailsSaved = false;

        test.info().annotations.push(
            { type: 'feature', description: 'My Account' },
            { type: 'story', description: 'Edit account details with valid data' },
            { type: 'tag', description: 'FR-079' },
        );

        try {
            await test.step('Open the AOS Home Page', async () => {
                await homePage.open();
            });

            await test.step('Verify the user is not authenticated', async () => {
                await loginPage.verifyUserIsNotSignedIn();
            });

            await test.step('Sign in with the existing user account', async () => {
                await loginPage.signInAs(user.username, user.password);
            });

            await test.step('Verify the existing user is signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });

            await test.step('Open My Account', async () => {
                await loginPage.openMyAccount();
            });

            await test.step('Open Account details edit page', async () => {
                await myAccountPage.openAccountDetailsEdit();
            });

            await test.step('Verify the Account Details edit page is displayed', async () => {
                await myAccountPage.verifyAccountDetailsEditPageIsDisplayed();
            });

            await test.step('Enter a valid Last Name', async () => {
                await myAccountPage.fillLastName(updatedLastName);
            });

            await test.step('Verify the SAVE button is enabled', async () => {
                await myAccountPage.verifySaveButtonIsEnabled();
            });

            await test.step('Save Account Details', async () => {
                await myAccountPage.saveAccountDetails();
                accountDetailsSaved = true;
            });

            await test.step('Verify the My Account page is displayed again', async () => {
                await myAccountPage.verifyMyAccountPageIsDisplayed();
            });

            await test.step('Verify the updated Last Name is displayed in Account details', async () => {
                await myAccountPage.verifyAccountDetailsLastName(updatedLastName);
            });

            await test.step('Verify the user remains signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });
        } finally {
            if (accountDetailsSaved) {
                await test.step('Restore original Account details', async () => {
                    await myAccountPage.openAccountDetailsEdit();
                    await myAccountPage.fillLastName(originalLastName);
                    await myAccountPage.saveAccountDetails();
                    await myAccountPage.verifyMyAccountPageIsDisplayed();
                });
            }

            await test.step('Sign out from the existing user account', async () => {
                await loginPage.signOutIfSignedIn(user.username);
            });

            await test.step('Verify the user is signed out', async () => {
                await loginPage.verifyUserIsNotSignedIn();
            });
        }
    });

    test('TC-074: Account Details Cannot Be Saved With Invalid Required Data', async ({
        homePage,
        loginPage,
        myAccountPage,
    }) => {
        const user = USERS.existingUser;

        test.info().annotations.push(
            { type: 'feature', description: 'My Account' },
            { type: 'story', description: 'Prevent saving invalid required account details' },
            { type: 'tag', description: 'FR-079' },
        );

        try {
            await test.step('Open the AOS Home Page', async () => {
                await homePage.open();
            });

            await test.step('Verify the user is not authenticated', async () => {
                await loginPage.verifyUserIsNotSignedIn();
            });

            await test.step('Sign in with the existing user account', async () => {
                await loginPage.signInAs(user.username, user.password);
            });

            await test.step('Verify the existing user is signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });

            await test.step('Open My Account', async () => {
                await loginPage.openMyAccount();
            });

            await test.step('Verify the My Account page is displayed', async () => {
                await myAccountPage.verifyMyAccountPageIsDisplayed();
            });

            await test.step('Open Account details edit page', async () => {
                await myAccountPage.openAccountDetailsEdit();
            });

            await test.step('Verify the Account Details edit page is displayed', async () => {
                await myAccountPage.verifyAccountDetailsEditPageIsDisplayed();
            });

            await test.step('Clear the Email field', async () => {
                await myAccountPage.clearEmail();
            });

            await test.step('Verify the Email required error is displayed', async () => {
                await myAccountPage.verifyEmailRequiredErrorIsDisplayed();
            });

            await test.step('Verify the SAVE button is disabled', async () => {
                await myAccountPage.verifySaveButtonIsDisabled();
            });

            await test.step('Verify the user remains signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });
        } finally {
            await test.step('Sign out from the existing user account', async () => {
                await loginPage.signOutIfSignedIn(user.username);
            });

            await test.step('Verify the user is signed out', async () => {
                await loginPage.verifyUserIsNotSignedIn();
            });
        }
    });

    test('TC-075: Account Information Persists After Navigation Or Refresh', async ({
        homePage,
        loginPage,
        myAccountPage,
    }) => {
        const user = USERS.existingUser;
        const updatedLastName = 'automation';
        const originalLastName = '';
        let accountDetailsSaved = false;

        test.info().annotations.push(
            { type: 'feature', description: 'My Account' },
            { type: 'story', description: 'Persist account information after refresh' },
            { type: 'tag', description: 'FR-079' },
        );

        try {
            await test.step('Open the AOS Home Page', async () => {
                await homePage.open();
            });

            await test.step('Verify the user is not authenticated', async () => {
                await loginPage.verifyUserIsNotSignedIn();
            });

            await test.step('Sign in with the existing user account', async () => {
                await loginPage.signInAs(user.username, user.password);
            });

            await test.step('Verify the existing user is signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });

            await test.step('Open My Account', async () => {
                await loginPage.openMyAccount();
            });

            await test.step('Verify the My Account page is displayed', async () => {
                await myAccountPage.verifyMyAccountPageIsDisplayed();
            });

            await test.step('Open Account details edit page', async () => {
                await myAccountPage.openAccountDetailsEdit();
            });

            await test.step('Verify the Account Details edit page is displayed', async () => {
                await myAccountPage.verifyAccountDetailsEditPageIsDisplayed();
            });

            await test.step('Fill Last Name with updated value', async () => {
                await myAccountPage.fillLastName(updatedLastName);
            });

            await test.step('Verify the SAVE button is enabled', async () => {
                await myAccountPage.verifySaveButtonIsEnabled();
            });

            await test.step('Save Account details', async () => {
                await myAccountPage.saveAccountDetails();
                accountDetailsSaved = true;
            });

            await test.step('Verify the My Account page is displayed', async () => {
                await myAccountPage.verifyMyAccountPageIsDisplayed();
            });

            await test.step('Verify the updated Last Name is displayed in Account details', async () => {
                await myAccountPage.verifyAccountDetailsLastName(updatedLastName);
            });

            await test.step('Navigate to the AOS Home Page', async () => {
                await myAccountPage.navigateToHome();
            });

            await test.step('Verify the existing user remains signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });

            await test.step('Open My Account again', async () => {
                await loginPage.openMyAccount();
            });

            await test.step('Verify the My Account page is displayed again', async () => {
                await myAccountPage.verifyMyAccountPageIsDisplayed();
            });

            await test.step('Verify the updated Last Name is still displayed in Account details after navigation', async () => {
                await myAccountPage.verifyAccountDetailsLastName(updatedLastName);
            });
        } finally {
            const userIsSignedIn = await loginPage.isUserSignedIn(user.username);

            if (accountDetailsSaved && userIsSignedIn) {
                await test.step('Restore original Account details', async () => {
                    await loginPage.openMyAccount();
                    await myAccountPage.verifyMyAccountPageIsDisplayed();
                    await myAccountPage.openAccountDetailsEdit();
                    await myAccountPage.fillLastName(originalLastName);
                    await myAccountPage.saveAccountDetails();
                    await myAccountPage.verifyMyAccountPageIsDisplayed();
                });
            }

            await test.step('Sign out from the existing user account', async () => {
                await loginPage.signOutIfSignedIn(user.username);
            });
        }
    });

    test('TC-076: User Password Can Be Changed With Valid Data', async ({
        homePage,
        loginPage,
        myAccountPage,
    }) => {
        const user = USERS.existingUser;
        const temporaryPassword = 'Auto1234';
        let passwordChanged = false;

        test.info().annotations.push(
            { type: 'feature', description: 'My Account' },
            { type: 'story', description: 'Change password with valid data' },
            { type: 'tag', description: 'FR-080' },
        );

        try {
            await test.step('Open the AOS Home Page', async () => {
                await homePage.open();
            });

            await test.step('Verify the user is not authenticated', async () => {
                await loginPage.verifyUserIsNotSignedIn();
            });

            await test.step('Sign in with the existing user account', async () => {
                await loginPage.signInAs(user.username, user.password);
            });

            await test.step('Verify the existing user is signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });

            await test.step('Open My Account', async () => {
                await loginPage.openMyAccount();
            });

            await test.step('Open Account details edit page', async () => {
                await myAccountPage.openAccountDetailsEdit();
            });

            await test.step('Verify the Account Details edit page is displayed', async () => {
                await myAccountPage.verifyAccountDetailsEditPageIsDisplayed();
            });

            await test.step('Open Change password', async () => {
                await myAccountPage.openChangePassword();
            });

            await test.step('Enter valid password change details', async () => {
                await myAccountPage.fillPasswordChange(user.password, temporaryPassword);
            });

            await test.step('Verify the SAVE button is enabled', async () => {
                await myAccountPage.verifySaveButtonIsEnabled();
            });

            await test.step('Save the new password', async () => {
                await myAccountPage.saveAccountDetails();
                passwordChanged = true;
            });

            await test.step('Verify the account updated message is displayed', async () => {
                await myAccountPage.verifyAccountUpdatedSuccessfullyMessageIsDisplayed();
            });

            await test.step('Verify the My Account page is displayed', async () => {
                await myAccountPage.verifyMyAccountPageIsDisplayed();
            });

            await test.step('Sign out from the existing user account', async () => {
                await loginPage.signOutIfSignedIn(user.username);
            });

            await test.step('Open the login form again', async () => {
                await loginPage.openLoginForm();
            });

            await test.step('Enter the existing username again', async () => {
                await loginPage.enterUsername(user.username);
            });

            await test.step('Enter the temporary password', async () => {
                await loginPage.enterPassword(temporaryPassword);
            });

            await test.step('Sign in with the temporary password', async () => {
                await loginPage.signIn();
            });

            await test.step('Verify the existing user is signed in with the temporary password', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });
        } finally {
            if (passwordChanged) {
                const userIsSignedIn = await loginPage.isUserSignedIn(user.username);

                if (!userIsSignedIn) {
                    await test.step('Sign in with the temporary password for cleanup', async () => {
                        await loginPage.signInAs(user.username, temporaryPassword);
                        await loginPage.verifyUserIsSignedIn(user.username);
                    });
                }

                await test.step('Restore the original password', async () => {
                    await loginPage.openMyAccount();
                    await myAccountPage.openAccountDetailsEdit();
                    await myAccountPage.verifyAccountDetailsEditPageIsDisplayed();
                    await myAccountPage.openChangePassword();
                    await myAccountPage.fillPasswordChange(temporaryPassword, user.password);
                    await myAccountPage.verifySaveButtonIsEnabled();
                    await myAccountPage.saveAccountDetails();
                    await myAccountPage.verifyMyAccountPageIsDisplayed();
                });
            }

            await test.step('Sign out from the existing user account', async () => {
                await loginPage.signOutIfSignedIn(user.username);
            });
        }
    });

    test('TC-077: Password Change Is Blocked When Confirmation Does Not Match', async ({
        homePage,
        loginPage,
        myAccountPage,
    }) => {
        const user = USERS.existingUser;
        const newPassword = 'Auto1234';
        const mismatchedPassword = 'Auto5678';

        test.info().annotations.push(
            { type: 'feature', description: 'My Account' },
            { type: 'story', description: 'Block password change when confirmation does not match' },
            { type: 'tag', description: 'FR-080' },
        );

        try {
            await test.step('Open the AOS Home Page', async () => {
                await homePage.open();
            });

            await test.step('Verify the user is not authenticated', async () => {
                await loginPage.verifyUserIsNotSignedIn();
            });

            await test.step('Sign in with the existing user account', async () => {
                await loginPage.signInAs(user.username, user.password);
            });

            await test.step('Verify the existing user is signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });

            await test.step('Open My Account', async () => {
                await loginPage.openMyAccount();
            });

            await test.step('Open Account details edit page', async () => {
                await myAccountPage.openAccountDetailsEdit();
            });

            await test.step('Verify the Account Details edit page is displayed', async () => {
                await myAccountPage.verifyAccountDetailsEditPageIsDisplayed();
            });

            await test.step('Open Change password', async () => {
                await myAccountPage.openChangePassword();
            });

            await test.step('Enter mismatched password change details', async () => {
                await myAccountPage.fillPasswordChange(
                    user.password,
                    newPassword,
                    mismatchedPassword,
                );
            });

            await test.step('Verify the password mismatch error is displayed', async () => {
                await myAccountPage.verifyPasswordMismatchErrorIsDisplayed();
            });

            await test.step('Verify the SAVE button remains disabled', async () => {
                await myAccountPage.verifySaveButtonIsDisabled();
            });
        } finally {
            await test.step('Sign out from the existing user account', async () => {
                await loginPage.signOutIfSignedIn(user.username);
            });
        }
    });

    test('TC-078: Saved Shipping Details Can Be Viewed From My Account', async ({
        homePage,
        loginPage,
        myAccountPage,
    }) => {
        const user = USERS.existingUser;
        const expectedCountry = 'Israel';

        test.info().annotations.push(
            { type: 'feature', description: 'My Account' },
            { type: 'story', description: 'View saved shipping details' },
            { type: 'tag', description: 'FR-081' },
        );

        try {
            await test.step('Open the AOS Home Page', async () => {
                await homePage.open();
            });

            await test.step('Verify the user is not authenticated', async () => {
                await loginPage.verifyUserIsNotSignedIn();
            });

            await test.step('Sign in with the existing user account', async () => {
                await loginPage.signInAs(user.username, user.password);
            });

            await test.step('Verify the existing user is signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });

            await test.step('Open My Account', async () => {
                await loginPage.openMyAccount();
            });

            await test.step('Verify the My Account page is displayed', async () => {
                await myAccountPage.verifyMyAccountPageIsDisplayed();
            });

            await test.step('Verify the Shipping details section is displayed', async () => {
                await myAccountPage.verifyShippingDetailsSectionIsDisplayed();
            });

            await test.step("Verify the authenticated user's username is displayed in Shipping details", async () => {
                await myAccountPage.verifyShippingDetailsUsername(user.username);
            });

            await test.step('Verify the saved shipping country is displayed in Shipping details', async () => {
                await myAccountPage.verifyShippingDetailsCountry(expectedCountry);
            });

            await test.step('Verify the user remains signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });
        } finally {
            await test.step('Sign out from the existing user account', async () => {
                await loginPage.signOutIfSignedIn(user.username);
            });
        }
    });

    test('TC-079: Preferred Payment Method Can Be Viewed From My Account', async ({
        homePage,
        loginPage,
        myAccountPage,
    }) => {
        const user = USERS.existingUser;
        const expectedPaymentType = 'MasterCredit';
        const expectedLastFourDigits = '6666';

        test.info().annotations.push(
            { type: 'feature', description: 'My Account' },
            { type: 'story', description: 'View preferred payment method' },
            { type: 'tag', description: 'FR-082' },
        );

        try {
            await test.step('Open the AOS Home Page', async () => {
                await homePage.open();
            });

            await test.step('Verify the user is not authenticated', async () => {
                await loginPage.verifyUserIsNotSignedIn();
            });

            await test.step('Sign in with the existing user account', async () => {
                await loginPage.signInAs(user.username, user.password);
            });

            await test.step('Verify the existing user is signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });

            await test.step('Open My Account', async () => {
                await loginPage.openMyAccount();
            });

            await test.step('Verify the My Account page is displayed', async () => {
                await myAccountPage.verifyMyAccountPageIsDisplayed();
            });

            await test.step('Verify the Preferred payment method section is displayed', async () => {
                await myAccountPage.verifyPreferredPaymentMethodSectionIsDisplayed();
            });

            await test.step('Verify the preferred payment method type is displayed', async () => {
                await myAccountPage.verifyPreferredPaymentMethodType(expectedPaymentType);
            });

            await test.step('Verify the preferred payment method last four digits are displayed', async () => {
                await myAccountPage.verifyPreferredPaymentMethodLastFourDigits(expectedLastFourDigits);
            });

            await test.step('Verify the user remains signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });
        } finally {
            await test.step('Sign out from the existing user account', async () => {
                await loginPage.signOutIfSignedIn(user.username);
            });
        }
    });

    test('TC-080: Preferred Payment Method Can Be Edited With Valid Data', async ({
        homePage,
        loginPage,
        myAccountPage,
    }) => {
        const user = USERS.existingUser;
        const expectedPaymentType = 'MasterCredit';
        const expectedLastFourDigits = '6666';
        const originalCardholderName = 'TestName';
        const updatedCardholderName = 'AutomationName';
        let paymentMethodUpdated = false;

        test.info().annotations.push(
            { type: 'feature', description: 'My Account' },
            { type: 'story', description: 'Edit preferred payment method with valid data' },
            { type: 'tag', description: 'FR-083' },
        );

        try {
            await test.step('Open the AOS Home Page', async () => {
                await homePage.open();
            });

            await test.step('Verify the user is not authenticated', async () => {
                await loginPage.verifyUserIsNotSignedIn();
            });

            await test.step('Sign in with the existing user account', async () => {
                await loginPage.signInAs(user.username, user.password);
            });

            await test.step('Verify the existing user is signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });

            await test.step('Open My Account', async () => {
                await loginPage.openMyAccount();
            });

            await test.step('Verify the My Account page is displayed', async () => {
                await myAccountPage.verifyMyAccountPageIsDisplayed();
            });

            await test.step('Open Preferred payment method edit page', async () => {
                await myAccountPage.openPreferredPaymentMethodEdit();
            });

            await test.step('Select MasterCredit as preferred payment method', async () => {
                await myAccountPage.selectPreferredMasterCredit();
            });

            await test.step('Update the MasterCredit cardholder name', async () => {
                await myAccountPage.fillPreferredPaymentCardholderName(updatedCardholderName);
            });

            await test.step('Verify the SAVE button is enabled', async () => {
                await myAccountPage.verifySaveButtonIsEnabled();
            });

            await test.step('Save Preferred payment method', async () => {
                await myAccountPage.saveAccountDetails();
                paymentMethodUpdated = true;
            });

            await test.step('Verify the My Account page is displayed again', async () => {
                await myAccountPage.verifyMyAccountPageIsDisplayed();
            });

            await test.step('Verify the preferred payment method still displays MasterCredit', async () => {
                await myAccountPage.verifyPreferredPaymentMethodType(expectedPaymentType);
            });

            await test.step('Verify the preferred payment method still displays the saved card digits', async () => {
                await myAccountPage.verifyPreferredPaymentMethodLastFourDigits(expectedLastFourDigits);
            });

            await test.step('Open Preferred payment method edit page again', async () => {
                await myAccountPage.openPreferredPaymentMethodEdit();
            });

            await test.step('Select MasterCredit again if needed', async () => {
                await myAccountPage.selectPreferredMasterCredit();
            });

            await test.step('Verify the updated cardholder name persisted', async () => {
                await myAccountPage.verifyPreferredPaymentCardholderName(updatedCardholderName);
            });
        } finally {
            if (paymentMethodUpdated) {
                const userIsSignedIn = await loginPage.isUserSignedIn(user.username);

                if (!userIsSignedIn) {
                    await test.step('Sign in with the existing user account for cleanup', async () => {
                        await loginPage.signInAs(user.username, user.password);
                        await loginPage.verifyUserIsSignedIn(user.username);
                    });
                }

                await test.step('Restore the original preferred payment cardholder name', async () => {
                    await myAccountPage.fillPreferredPaymentCardholderName(originalCardholderName);
                    await myAccountPage.verifySaveButtonIsEnabled();
                    await myAccountPage.saveAccountDetails();
                    await myAccountPage.verifyMyAccountPageIsDisplayed();
                });
            }

            await test.step('Sign out from the existing user account', async () => {
                await loginPage.signOutIfSignedIn(user.username);
            });
        }
    });

    test('TC-081: Promotional Preferences Can Be Viewed From My Account', async ({
        homePage,
        loginPage,
        myAccountPage,
    }) => {
        const user = USERS.existingUser;

        test.info().annotations.push(
            { type: 'feature', description: 'My Account' },
            { type: 'story', description: 'View promotional preferences' },
            { type: 'tag', description: 'FR-084' },
        );

        try {
            await test.step('Open the AOS Home Page', async () => {
                await homePage.open();
            });

            await test.step('Verify the user is not authenticated', async () => {
                await loginPage.verifyUserIsNotSignedIn();
            });

            await test.step('Sign in with the existing user account', async () => {
                await loginPage.signInAs(user.username, user.password);
            });

            await test.step('Verify the existing user is signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });

            await test.step('Open My Account', async () => {
                await loginPage.openMyAccount();
            });

            await test.step('Verify the My Account page is displayed', async () => {
                await myAccountPage.verifyMyAccountPageIsDisplayed();
            });

            await test.step('Verify the promotional preferences are displayed', async () => {
                await myAccountPage.verifyPromotionalPreferencesAreDisplayed();
            });

            await test.step('Verify the user remains signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });
        } finally {
            await test.step('Sign out from the existing user account', async () => {
                await loginPage.signOutIfSignedIn(user.username);
            });
        }
    });
});
