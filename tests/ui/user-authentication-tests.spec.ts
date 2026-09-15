import { test } from '../../fixtures/aos-fixture';
import { generateUniqueUser, USERS } from '../../test-data/ui/users.data';

test.describe('User Authentication', () => {
    test('TC-054: Registration Form Opens From Login Popup', async ({
        homePage,
        loginPage,
        registerPage,
    }) => {
        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            { type: 'story', description: 'Display registration form from login popup' },
            { type: 'tag', description: 'FR-059' },
            { type: 'tag', description: 'FR-072' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Open the login form from the account icon', async () => {
            await loginPage.openLoginForm();
        });

        await test.step('Select CREATE NEW ACCOUNT', async () => {
            await loginPage.openCreateAccountPage();
        });

        await test.step('Verify the Create Account page is displayed', async () => {
            await registerPage.verifyCreateAccountPageIsDisplayed();
        });

        await test.step('Verify mandatory account fields are displayed', async () => {
            await registerPage.verifyMandatoryAccountFieldsAreDisplayed();
        });

        await test.step('Verify the required agreement is displayed', async () => {
            await registerPage.verifyRequiredAgreementIsDisplayed();
        });

        await test.step('Verify the REGISTER button is disabled', async () => {
            await registerPage.verifyRegisterButtonIsDisabled();
        });

        await test.step('Verify the user remains unauthenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });
    });

    test('TC-055: New User Account Can Be Created With Valid Data', async ({
        homePage,
        loginPage,
        myAccountPage,
        registerPage,
    }) => {
        const user = generateUniqueUser();
        let cleanupRequired = false;

        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            { type: 'story', description: 'Create new user account with valid data' },
            { type: 'tag', description: 'FR-060' },
            { type: 'tag', description: 'FR-067' },
            { type: 'tag', description: 'FR-070' },
        );

        try {
            await test.step('Open the AOS Home Page', async () => {
                await homePage.open();
            });

            await test.step('Open the login form from the account icon', async () => {
                await loginPage.openLoginForm();
            });

            await test.step('Select CREATE NEW ACCOUNT', async () => {
                await loginPage.openCreateAccountPage();
            });

            await test.step('Verify the Create Account page is displayed', async () => {
                await registerPage.verifyCreateAccountPageIsDisplayed();
            });

            await test.step('Enter valid mandatory account details', async () => {
                await registerPage.fillAccountFields(user);
            });

            await test.step('Accept the required agreement', async () => {
                await registerPage.acceptRequiredAgreement();
            });

            await test.step('Verify the REGISTER button is enabled', async () => {
                await registerPage.verifyRegisterButtonIsEnabled();
            });

            await test.step('Register the new user account', async () => {
                await registerPage.registerAccount();
                cleanupRequired = true;
            });

            await test.step('Verify the user returns to the Home Page', async () => {
                await homePage.verifyUserRemainsOnHomePage();
            });

            await test.step('Verify the generated user is signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });
        } finally {
            if (cleanupRequired) {
                await test.step('Open My Account for cleanup', async () => {
                    await loginPage.openMyAccount();
                });

                await test.step('Delete the generated user account', async () => {
                    await myAccountPage.deleteAccountAndConfirm();
                });

                await test.step('Verify the account deletion success message is displayed', async () => {
                    await myAccountPage.verifyAccountDeletedSuccessfullyMessageIsDisplayed();
                });

                await test.step('Verify the user remains unauthenticated after cleanup', async () => {
                    await loginPage.verifyUserIsNotSignedIn();
                });
            }
        }
    });

    test('TC-056: Registration Is Blocked When Mandatory Fields Are Missing', async ({
        homePage,
        loginPage,
        registerPage,
    }) => {
        const user = {
            ...generateUniqueUser(),
            username: '',
        };

        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            { type: 'story', description: 'Block registration with missing mandatory fields' },
            { type: 'tag', description: 'FR-061' },
            { type: 'tag', description: 'FR-068' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Open the login form from the account icon', async () => {
            await loginPage.openLoginForm();
        });

        await test.step('Select CREATE NEW ACCOUNT', async () => {
            await loginPage.openCreateAccountPage();
        });

        await test.step('Verify the Create Account page is displayed', async () => {
            await registerPage.verifyCreateAccountPageIsDisplayed();
        });

        await test.step('Enter valid mandatory account details without username', async () => {
            await registerPage.fillAccountFields(user);
        });

        await test.step('Accept the required agreement', async () => {
            await registerPage.acceptRequiredAgreement();
        });

        await test.step('Verify the REGISTER button is enabled', async () => {
            await registerPage.verifyRegisterButtonIsEnabled();
        });

        await test.step('Attempt to register the account', async () => {
            await registerPage.registerAccount();
        });

        await test.step('Verify the registration failed message is displayed', async () => {
            await registerPage.verifyRegistrationFailedMessageIsDisplayed();
        });

        await test.step('Verify the Create Account page is still displayed', async () => {
            await registerPage.verifyCreateAccountPageIsDisplayed();
        });

        await test.step('Verify the user remains unauthenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });
    });

    test('TC-057: Registration Is Blocked When Email Format Is Invalid', async ({
        homePage,
        loginPage,
        registerPage,
    }) => {
        const user = {
            ...generateUniqueUser(),
            email: 'test@test',
        };

        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            { type: 'story', description: 'Block registration with invalid email format' },
            { type: 'tag', description: 'FR-062' },
            { type: 'tag', description: 'FR-068' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Open the login form from the account icon', async () => {
            await loginPage.openLoginForm();
        });

        await test.step('Select CREATE NEW ACCOUNT', async () => {
            await loginPage.openCreateAccountPage();
        });

        await test.step('Verify the Create Account page is displayed', async () => {
            await registerPage.verifyCreateAccountPageIsDisplayed();
        });

        await test.step('Enter account details with invalid email format', async () => {
            await registerPage.fillAccountFields(user);
        });

        await test.step('Accept the required agreement', async () => {
            await registerPage.acceptRequiredAgreement();
        });

        await test.step('Verify the REGISTER button is enabled', async () => {
            await registerPage.verifyRegisterButtonIsEnabled();
        });

        await test.step('Attempt to register the account', async () => {
            await registerPage.registerAccount();
        });

        await test.step('Verify the invalid email message is displayed', async () => {
            await registerPage.verifyInvalidEmailMessageIsDisplayed();
        });

        await test.step('Verify the Create Account page is still displayed', async () => {
            await registerPage.verifyCreateAccountPageIsDisplayed();
        });

        await test.step('Verify the user remains unauthenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });
    });

    test('TC-058: Registration Is Blocked When Username Already Exists', async ({
        homePage,
        loginPage,
        registerPage,
    }) => {
        const user = {
            ...generateUniqueUser(),
            username: USERS.existingUser.username,
        };

        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            { type: 'story', description: 'Block registration when username already exists' },
            { type: 'tag', description: 'FR-063' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Open the login form from the account icon', async () => {
            await loginPage.openLoginForm();
        });

        await test.step('Select CREATE NEW ACCOUNT', async () => {
            await loginPage.openCreateAccountPage();
        });

        await test.step('Verify the Create Account page is displayed', async () => {
            await registerPage.verifyCreateAccountPageIsDisplayed();
        });

        await test.step('Enter account details with an existing username', async () => {
            await registerPage.fillAccountFields(user);
        });

        await test.step('Accept the required agreement', async () => {
            await registerPage.acceptRequiredAgreement();
        });

        await test.step('Verify the REGISTER button is enabled', async () => {
            await registerPage.verifyRegisterButtonIsEnabled();
        });

        await test.step('Attempt to register the account', async () => {
            await registerPage.registerAccount();
        });

        await test.step('Verify the username already exists message is displayed', async () => {
            await registerPage.verifyUsernameAlreadyExistsMessageIsDisplayed();
        });

        await test.step('Verify the Create Account page is still displayed', async () => {
            await registerPage.verifyCreateAccountPageIsDisplayed();
        });

        await test.step('Verify the user remains unauthenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });
    });

    test('TC-059: Registration Allows Email Address Already Used By Another Account', async ({
        homePage,
        loginPage,
        myAccountPage,
        registerPage,
    }) => {
        const user = {
            ...generateUniqueUser(),
            email: USERS.existingUser.email,
        };
        let cleanupRequired = false;

        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            {
                type: 'story',
                description: 'Allow registration with an email already used by another account',
            },
            { type: 'tag', description: 'FR-064' },
        );

        try {
            await test.step('Open the AOS Home Page', async () => {
                await homePage.open();
            });

            await test.step('Open the login form from the account icon', async () => {
                await loginPage.openLoginForm();
            });

            await test.step('Select CREATE NEW ACCOUNT', async () => {
                await loginPage.openCreateAccountPage();
            });

            await test.step('Verify the Create Account page is displayed', async () => {
                await registerPage.verifyCreateAccountPageIsDisplayed();
            });

            await test.step('Enter account details with an existing email address', async () => {
                await registerPage.fillAccountFields(user);
            });

            await test.step('Accept the required agreement', async () => {
                await registerPage.acceptRequiredAgreement();
            });

            await test.step('Verify the REGISTER button is enabled', async () => {
                await registerPage.verifyRegisterButtonIsEnabled();
            });

            await test.step('Register the new user account', async () => {
                await registerPage.registerAccount();
                cleanupRequired = true;
            });

            await test.step('Verify the user returns to the Home Page', async () => {
                await homePage.verifyUserRemainsOnHomePage();
            });

            await test.step('Verify the generated user is signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
            });
        } finally {
            if (cleanupRequired) {
                await test.step('Open My Account for cleanup', async () => {
                    await loginPage.openMyAccount();
                });

                await test.step('Delete the generated user account', async () => {
                    await myAccountPage.deleteAccountAndConfirm();
                });

                await test.step('Verify the account deletion success message is displayed', async () => {
                    await myAccountPage.verifyAccountDeletedSuccessfullyMessageIsDisplayed();
                });

                await test.step('Verify the user remains unauthenticated after cleanup', async () => {
                    await loginPage.verifyUserIsNotSignedIn();
                });
            }
        }
    });

    test('TC-060: Password Rules Are Validated During Registration', async ({
        homePage,
        loginPage,
        registerPage,
    }) => {
        const user = generateUniqueUser();
        const passwordValidationCases = [
            {
                password: 'Ab1',
                expectedMessage: 'Use 4 character or longer',
            },
            {
                password: 'AB12',
                expectedMessage: 'One lower letter required',
            },
            {
                password: 'ab12',
                expectedMessage: 'One upper letter required',
            },
        ];
        const validPassword = 'Ab12';

        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            { type: 'story', description: 'Password validation rules during registration' },
            { type: 'tag', description: 'FR-065' },
            { type: 'tag', description: 'FR-068' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Open the login form from the account icon', async () => {
            await loginPage.openLoginForm();
        });

        await test.step('Select CREATE NEW ACCOUNT', async () => {
            await loginPage.openCreateAccountPage();
        });

        await test.step('Verify the Create Account page is displayed', async () => {
            await registerPage.verifyCreateAccountPageIsDisplayed();
        });

        await test.step('Enter valid username and email', async () => {
            await registerPage.fillUsername(user.username);
            await registerPage.fillEmail(user.email);
        });

        for (const { password, expectedMessage } of passwordValidationCases) {
            await test.step(`Verify password validation message for ${password}`, async () => {
                await registerPage.fillPassword(password);
                await registerPage.focusConfirmPassword();
                await registerPage.verifyPasswordValidationMessage(expectedMessage);
            });
        }

        await test.step('Verify no password validation message is displayed for a valid password', async () => {
            await registerPage.fillPassword(validPassword);
            await registerPage.focusConfirmPassword();
            await registerPage.verifyPasswordValidationMessageIsNotDisplayed();
        });

        await test.step('Verify the user remains unauthenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });
    });

    test('TC-061: Registration Is Blocked When Password Confirmation Does Not Match', async ({
        homePage,
        loginPage,
        registerPage,
    }) => {
        const user = generateUniqueUser();
        const password = 'Ab12';
        const confirmPassword = 'Ab13';

        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            { type: 'story', description: 'Password confirmation validation during registration' },
            { type: 'tag', description: 'FR-066' },
            { type: 'tag', description: 'FR-068' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Open the login form from the account icon', async () => {
            await loginPage.openLoginForm();
        });

        await test.step('Select CREATE NEW ACCOUNT', async () => {
            await loginPage.openCreateAccountPage();
        });

        await test.step('Verify the Create Account page is displayed', async () => {
            await registerPage.verifyCreateAccountPageIsDisplayed();
        });

        await test.step('Enter valid username and email', async () => {
            await registerPage.fillUsername(user.username);
            await registerPage.fillEmail(user.email);
        });

        await test.step('Enter password and mismatched confirmation password', async () => {
            await registerPage.fillPassword(password);
            await registerPage.fillConfirmPassword(confirmPassword);
        });

        await test.step('Accept the required agreement', async () => {
            await registerPage.acceptRequiredAgreement();
        });

        await test.step('Verify the password mismatch message is displayed', async () => {
            await registerPage.verifyPasswordsDoNotMatchMessageIsDisplayed();
        });

        await test.step('Verify the REGISTER button remains disabled', async () => {
            await registerPage.verifyRegisterButtonIsDisabled();
        });

        await test.step('Verify the user remains unauthenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });
    });

    test('TC-062: Registration Is Blocked When Required Agreement Is Not Accepted', async ({
        homePage,
        loginPage,
        registerPage,
    }) => {
        const user = generateUniqueUser();

        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            { type: 'story', description: 'Required agreement validation during registration' },
            { type: 'tag', description: 'FR-067' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Open the login form from the account icon', async () => {
            await loginPage.openLoginForm();
        });

        await test.step('Select CREATE NEW ACCOUNT', async () => {
            await loginPage.openCreateAccountPage();
        });

        await test.step('Verify the Create Account page is displayed', async () => {
            await registerPage.verifyCreateAccountPageIsDisplayed();
        });

        await test.step('Enter valid mandatory account details', async () => {
            await registerPage.fillAccountFields(user);
        });

        await test.step('Verify the required agreement is not accepted', async () => {
            await registerPage.verifyRequiredAgreementIsNotAccepted();
        });

        await test.step('Verify the REGISTER button remains disabled', async () => {
            await registerPage.verifyRegisterButtonIsDisabled();
        });

        await test.step('Verify the user remains unauthenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });
    });

    test('TC-063: Registration Data Is Preserved After Validation Errors', async ({
        homePage,
        loginPage,
        registerPage,
    }) => {
        const user = {
            ...generateUniqueUser(),
            email: 'test@test',
        };

        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            { type: 'story', description: 'Preserve registration data after validation errors' },
            { type: 'tag', description: 'FR-068' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Open the login form from the account icon', async () => {
            await loginPage.openLoginForm();
        });

        await test.step('Select CREATE NEW ACCOUNT', async () => {
            await loginPage.openCreateAccountPage();
        });

        await test.step('Verify the Create Account page is displayed', async () => {
            await registerPage.verifyCreateAccountPageIsDisplayed();
        });

        await test.step('Enter account details with invalid email format', async () => {
            await registerPage.fillAccountFields(user);
        });

        await test.step('Accept the required agreement', async () => {
            await registerPage.acceptRequiredAgreement();
        });

        await test.step('Verify the REGISTER button is enabled', async () => {
            await registerPage.verifyRegisterButtonIsEnabled();
        });

        await test.step('Attempt to register the account', async () => {
            await registerPage.registerAccount();
        });

        await test.step('Verify the invalid email message is displayed', async () => {
            await registerPage.verifyInvalidEmailMessageIsDisplayed();
        });

        await test.step('Verify the Create Account page is still displayed', async () => {
            await registerPage.verifyCreateAccountPageIsDisplayed();
        });

        await test.step('Verify the entered registration data is preserved', async () => {
            await registerPage.verifyAccountFieldsPreserved(user);
        });

        await test.step('Verify the required agreement remains accepted', async () => {
            await registerPage.verifyRequiredAgreementIsAccepted();
        });

        await test.step('Verify the user remains unauthenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });
    });

    test('TC-064: Registration Form Can Be Closed Without Creating Account', async ({
        homePage,
        loginPage,
        registerPage,
    }) => {
        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            { type: 'story', description: 'Abandon registration and return to login' },
            { type: 'tag', description: 'FR-069' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Open the login form from the account icon', async () => {
            await loginPage.openLoginForm();
        });

        await test.step('Select CREATE NEW ACCOUNT', async () => {
            await loginPage.openCreateAccountPage();
        });

        await test.step('Verify the Create Account page is displayed', async () => {
            await registerPage.verifyCreateAccountPageIsDisplayed();
        });

        await test.step('Return to the login form from Create Account', async () => {
            await registerPage.openLoginFromCreateAccount();
        });

        await test.step('Verify the login form is displayed', async () => {
            await loginPage.verifyLoginFormIsDisplayed();
        });

        await test.step('Verify the user remains unauthenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });
    });

    test('TC-065: Newly Created Account Can Be Used For Sign In', async ({
        homePage,
        loginPage,
        myAccountPage,
        registerPage,
    }) => {
        const user = generateUniqueUser();
        let cleanupRequired = false;
        let signedInForCleanup = false;

        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            { type: 'story', description: 'Sign in with newly created account' },
            { type: 'tag', description: 'FR-071' },
            { type: 'tag', description: 'FR-073' },
        );

        try {
            await test.step('Open the AOS Home Page', async () => {
                await homePage.open();
            });

            await test.step('Open the login form from the account icon', async () => {
                await loginPage.openLoginForm();
            });

            await test.step('Select CREATE NEW ACCOUNT', async () => {
                await loginPage.openCreateAccountPage();
            });

            await test.step('Verify the Create Account page is displayed', async () => {
                await registerPage.verifyCreateAccountPageIsDisplayed();
            });

            await test.step('Enter valid mandatory account details', async () => {
                await registerPage.fillAccountFields(user);
            });

            await test.step('Accept the required agreement', async () => {
                await registerPage.acceptRequiredAgreement();
            });

            await test.step('Verify the REGISTER button is enabled', async () => {
                await registerPage.verifyRegisterButtonIsEnabled();
            });

            await test.step('Register the new user account', async () => {
                await registerPage.registerAccount();
                cleanupRequired = true;
            });

            await test.step('Verify the generated user is automatically signed in', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
                signedInForCleanup = true;
            });

            await test.step('Sign out from the generated user account', async () => {
                await loginPage.signOutIfSignedIn(user.username);
                signedInForCleanup = false;
            });

            await test.step('Verify the user is signed out', async () => {
                await loginPage.verifyUserIsNotSignedIn();
            });

            await test.step('Open the login form again', async () => {
                await loginPage.openLoginForm();
            });

            await test.step('Enter the generated username', async () => {
                await loginPage.enterUsername(user.username);
            });

            await test.step('Enter the generated password', async () => {
                await loginPage.enterPassword(user.password);
            });

            await test.step('Sign in with the generated user account', async () => {
                await loginPage.signIn();
            });

            await test.step('Verify the generated user is signed in again', async () => {
                await loginPage.verifyUserIsSignedIn(user.username);
                signedInForCleanup = true;
            });
        } finally {
            if (cleanupRequired) {
                if (!signedInForCleanup) {
                    await test.step('Sign in with the generated user account for cleanup', async () => {
                        await homePage.open();
                        await loginPage.openLoginForm();
                        await loginPage.enterUsername(user.username);
                        await loginPage.enterPassword(user.password);
                        await loginPage.signIn();
                        await loginPage.verifyUserIsSignedIn(user.username);
                    });
                }

                await test.step('Open My Account for cleanup', async () => {
                    await loginPage.openMyAccount();
                });

                await test.step('Delete the generated user account', async () => {
                    await myAccountPage.deleteAccountAndConfirm();
                });

                await test.step('Verify the account deletion success message is displayed', async () => {
                    await myAccountPage.verifyAccountDeletedSuccessfullyMessageIsDisplayed();
                });

                await test.step('Verify the user remains unauthenticated after cleanup', async () => {
                    await loginPage.verifyUserIsNotSignedIn();
                });
            }
        }
    });

    test('TC-066: Login Form Opens From Account Menu', async ({ homePage, loginPage }) => {
        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            { type: 'story', description: 'Open login form from account menu' },
            { type: 'tag', description: 'FR-072' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Verify the user is not authenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });

        await test.step('Open the login form from the account icon', async () => {
            await loginPage.openLoginForm();
        });

        await test.step('Verify the login form is displayed', async () => {
            await loginPage.verifyLoginFormIsDisplayed();
        });
    });

    test('TC-067: Existing User Can Sign In With Valid Credentials', async ({
        homePage,
        loginPage,
    }) => {
        const user = USERS.existingUser;

        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            { type: 'story', description: 'Sign in with valid existing user credentials' },
            { type: 'tag', description: 'FR-073' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Verify the user is not authenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });

        await test.step('Open the login form from the account icon', async () => {
            await loginPage.openLoginForm();
        });

        await test.step('Verify the login form is displayed', async () => {
            await loginPage.verifyLoginFormIsDisplayed();
        });

        await test.step('Enter the existing username', async () => {
            await loginPage.enterUsername(user.username);
        });

        await test.step('Enter the existing password', async () => {
            await loginPage.enterPassword(user.password);
        });

        await test.step('Sign in with the existing user account', async () => {
            await loginPage.signIn();
        });

        await test.step('Verify the existing user is signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });

        await test.step('Sign out from the existing user account', async () => {
            await loginPage.signOutIfSignedIn(user.username);
        });

        await test.step('Verify the user is signed out', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });
    });

    test('TC-068: Remember Me Option Is Available During Login', async ({
        homePage,
        loginPage,
    }) => {
        const user = USERS.existingUser;

        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            { type: 'story', description: 'Remember Me option during login' },
            { type: 'tag', description: 'FR-074' },
            { type: 'tag', description: 'FR-073' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Verify the user is not authenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });

        await test.step('Open the login form from the account icon', async () => {
            await loginPage.openLoginForm();
        });

        await test.step('Verify the login form is displayed', async () => {
            await loginPage.verifyLoginFormIsDisplayed();
        });

        await test.step('Verify Remember Me is displayed', async () => {
            await loginPage.verifyRememberMeIsDisplayed();
        });

        await test.step('Select Remember Me', async () => {
            await loginPage.selectRememberMe();
        });

        await test.step('Verify Remember Me remains selected', async () => {
            await loginPage.verifyRememberMeIsSelected();
        });

        await test.step('Enter the existing username', async () => {
            await loginPage.enterUsername(user.username);
        });

        await test.step('Enter the existing password', async () => {
            await loginPage.enterPassword(user.password);
        });

        await test.step('Sign in with Remember Me selected', async () => {
            await loginPage.signIn();
        });

        await test.step('Verify the existing user is signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });

        await test.step('Sign out from the existing user account', async () => {
            await loginPage.signOutIfSignedIn(user.username);
        });

        await test.step('Verify the user is signed out', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });
    });

    test('TC-069: Invalid Login Displays Error Message', async ({ homePage, loginPage }) => {
        const invalidUsername = 'invaliduser12345';
        const password = USERS.existingUser.password;

        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            { type: 'story', description: 'Invalid login error handling' },
            { type: 'tag', description: 'FR-075' },
            { type: 'tag', description: 'FR-073' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Verify the user is not authenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });

        await test.step('Open the login form from the account icon', async () => {
            await loginPage.openLoginForm();
        });

        await test.step('Verify the login form is displayed', async () => {
            await loginPage.verifyLoginFormIsDisplayed();
        });

        await test.step('Enter an invalid username', async () => {
            await loginPage.enterUsername(invalidUsername);
        });

        await test.step('Enter the password', async () => {
            await loginPage.enterPassword(password);
        });

        await test.step('Attempt to sign in with invalid credentials', async () => {
            await loginPage.signIn();
        });

        await test.step('Verify the invalid credentials message is displayed', async () => {
            await loginPage.verifyInvalidCredentialsMessageIsDisplayed();
        });

        await test.step('Verify the login form remains displayed', async () => {
            await loginPage.verifyLoginFormIsDisplayed();
        });

        await test.step('Verify the user remains unauthenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });
    });

    test('TC-070: Login Popup Can Be Closed Without Authentication', async ({
        homePage,
        loginPage,
    }) => {
        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            { type: 'story', description: 'Close login popup without authentication' },
            { type: 'tag', description: 'FR-076' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Verify the user is not authenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });

        await test.step('Open the login form from the account icon', async () => {
            await loginPage.openLoginForm();
        });

        await test.step('Verify the login form is displayed', async () => {
            await loginPage.verifyLoginFormIsDisplayed();
        });

        await test.step('Close the login form', async () => {
            await loginPage.closeLoginForm();
        });

        await test.step('Verify the login form is not displayed', async () => {
            await loginPage.verifyLoginFormIsNotDisplayed();
        });

        await test.step('Verify the user remains on the Home Page', async () => {
            await homePage.verifyUserRemainsOnHomePage();
        });

        await test.step('Verify the user remains unauthenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });
    });

    test('TC-071: Signed-In User Can Sign Out', async ({ homePage, loginPage }) => {
        const user = USERS.existingUser;

        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            { type: 'story', description: 'Sign out from authenticated user session' },
            { type: 'tag', description: 'FR-077' },
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

        await test.step('Sign out from the existing user account', async () => {
            await loginPage.signOutIfSignedIn(user.username);
        });

        await test.step('Verify the user is signed out', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });

        await test.step('Verify authenticated account options are not displayed', async () => {
            await loginPage.verifyAuthenticatedAccountOptionsAreNotDisplayed();
        });
    });

    test('TC-094: Remember Me Persists Login Credentials', async ({ homePage, loginPage }) => {
        const user = USERS.existingUser;

        test.info().annotations.push(
            { type: 'feature', description: 'User Authentication' },
            { type: 'story', description: 'Remember login credentials' },
            { type: 'tag', description: 'FR-074' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
        });

        await test.step('Verify the user is not authenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });

        await test.step('Open the login form from the account icon', async () => {
            await loginPage.openLoginForm();
        });

        await test.step('Verify the login form is displayed', async () => {
            await loginPage.verifyLoginFormIsDisplayed();
        });

        await test.step('Enter the existing username', async () => {
            await loginPage.enterUsername(user.username);
        });

        await test.step('Enter the existing password', async () => {
            await loginPage.enterPassword(user.password);
        });

        await test.step('Select Remember Me', async () => {
            await loginPage.selectRememberMe();
        });

        await test.step('Verify Remember Me remains selected', async () => {
            await loginPage.verifyRememberMeIsSelected();
        });

        await test.step('Sign in with Remember Me selected', async () => {
            await loginPage.signIn();
        });

        await test.step('Verify the existing user is signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });

        await test.step('Sign out from the existing user account', async () => {
            await loginPage.signOutIfSignedIn(user.username);
        });

        await test.step('Verify the user is signed out', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });

        await test.step('Open the login form again', async () => {
            await loginPage.openLoginForm();
        });

        await test.step('Verify the remembered credentials are populated', async () => {
            await loginPage.verifyLoginCredentialsArePopulated(user.username, user.password);
        });
    });
});
