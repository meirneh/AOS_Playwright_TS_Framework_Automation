import { test } from '../../fixtures/aos-fixture';
import { generateUniqueUser, USERS } from '../../test-data/ui/users.data';

test.describe('Account Deletion', () => {
    test('TC-087: Account Deletion Confirmation Is Displayed', async ({
        homePage,
        loginPage,
        myAccountPage,
    }) => {
        const user = USERS.existingUser;

        test.info().annotations.push(
            { type: 'feature', description: 'Account Deletion' },
            { type: 'story', description: 'Display account deletion confirmation' },
            { type: 'tag', description: 'FR-091' },
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

        await test.step('Open My Account', async () => {
            await loginPage.openMyAccount();
        });

        await test.step('Verify the My Account page is displayed', async () => {
            await myAccountPage.verifyMyAccountPageIsDisplayed();
        });

        await test.step('Start account deletion', async () => {
            await myAccountPage.openDeleteAccountConfirmation();
        });

        await test.step('Verify the account deletion confirmation is displayed', async () => {
            await myAccountPage.verifyDeleteAccountConfirmationIsDisplayed();
        });

        await test.step('Cancel account deletion', async () => {
            await myAccountPage.cancelAccountDeletion();
        });

        await test.step('Verify the account deletion confirmation is hidden', async () => {
            await myAccountPage.verifyDeleteAccountConfirmationIsHidden();
        });

        await test.step('Verify the existing user remains signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });
    });

    test('TC-088: Account Deletion Can Be Canceled', async ({
        homePage,
        loginPage,
        myAccountPage,
    }) => {
        const user = USERS.existingUser;

        test.info().annotations.push(
            { type: 'feature', description: 'Account Deletion' },
            { type: 'story', description: 'Cancel account deletion' },
            { type: 'tag', description: 'FR-092' },
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

        await test.step('Open My Account', async () => {
            await loginPage.openMyAccount();
        });

        await test.step('Verify the My Account page is displayed', async () => {
            await myAccountPage.verifyMyAccountPageIsDisplayed();
        });

        await test.step('Start account deletion', async () => {
            await myAccountPage.openDeleteAccountConfirmation();
        });

        await test.step('Verify the account deletion confirmation is displayed', async () => {
            await myAccountPage.verifyDeleteAccountConfirmationIsDisplayed();
        });

        await test.step('Cancel account deletion', async () => {
            await myAccountPage.cancelAccountDeletion();
        });

        await test.step('Verify the account deletion confirmation is hidden', async () => {
            await myAccountPage.verifyDeleteAccountConfirmationIsHidden();
        });

        await test.step('Verify the My Account page remains displayed', async () => {
            await myAccountPage.verifyMyAccountPageIsDisplayed();
        });

        await test.step('Verify the existing user remains signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });
    });

    test('TC-089: Account Is Deleted After Confirmation', async ({
        homePage,
        loginPage,
        myAccountPage,
        registerPage,
    }) => {
        const user = generateUniqueUser();

        test.info().annotations.push(
            { type: 'feature', description: 'Account Deletion' },
            { type: 'story', description: 'Confirm account deletion' },
            { type: 'tag', description: 'FR-093' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
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

        await test.step('Fill the temporary user account fields', async () => {
            await registerPage.fillAccountFields(user);
        });

        await test.step('Accept the required agreement', async () => {
            await registerPage.acceptRequiredAgreement();
        });

        await test.step('Verify the REGISTER button is enabled', async () => {
            await registerPage.verifyRegisterButtonIsEnabled();
        });

        await test.step('Register the temporary user account', async () => {
            await registerPage.registerAccount();
        });

        await test.step('Verify the temporary user is automatically signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });

        await test.step('Open My Account', async () => {
            await loginPage.openMyAccount();
        });

        await test.step('Verify the My Account page is displayed', async () => {
            await myAccountPage.verifyMyAccountPageIsDisplayed();
        });

        await test.step('Start account deletion', async () => {
            await myAccountPage.openDeleteAccountConfirmation();
        });

        await test.step('Verify the account deletion confirmation is displayed', async () => {
            await myAccountPage.verifyDeleteAccountConfirmationIsDisplayed();
        });

        await test.step('Confirm account deletion', async () => {
            await myAccountPage.confirmAccountDeletion();
        });

        await test.step('Verify the account deletion success message is displayed', async () => {
            await myAccountPage.verifyAccountDeletedSuccessfullyMessageIsDisplayed();
        });

        await test.step('Verify the temporary user is no longer signed in', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });
    });

    test('TC-090: Deleted Account Credentials Cannot Be Used For Login', async ({
        homePage,
        loginPage,
        myAccountPage,
        registerPage,
    }) => {
        const user = generateUniqueUser();

        test.info().annotations.push(
            { type: 'feature', description: 'Account Deletion' },
            { type: 'story', description: 'Reject deleted account credentials' },
            { type: 'tag', description: 'FR-094' },
            { type: 'tag', description: 'FR-075' },
        );

        await test.step('Open the AOS Home Page', async () => {
            await homePage.open();
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

        await test.step('Fill the temporary user account fields', async () => {
            await registerPage.fillAccountFields(user);
        });

        await test.step('Accept the required agreement', async () => {
            await registerPage.acceptRequiredAgreement();
        });

        await test.step('Verify the REGISTER button is enabled', async () => {
            await registerPage.verifyRegisterButtonIsEnabled();
        });

        await test.step('Register the temporary user account', async () => {
            await registerPage.registerAccount();
        });

        await test.step('Verify the temporary user is automatically signed in', async () => {
            await loginPage.verifyUserIsSignedIn(user.username);
        });

        await test.step('Open My Account', async () => {
            await loginPage.openMyAccount();
        });

        await test.step('Verify the My Account page is displayed', async () => {
            await myAccountPage.verifyMyAccountPageIsDisplayed();
        });

        await test.step('Start account deletion', async () => {
            await myAccountPage.openDeleteAccountConfirmation();
        });

        await test.step('Verify the account deletion confirmation is displayed', async () => {
            await myAccountPage.verifyDeleteAccountConfirmationIsDisplayed();
        });

        await test.step('Confirm account deletion', async () => {
            await myAccountPage.confirmAccountDeletion();
        });

        await test.step('Verify the account deletion success message is displayed', async () => {
            await myAccountPage.verifyAccountDeletedSuccessfullyMessageIsDisplayed();
        });

        await test.step('Verify the temporary user is no longer signed in', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });

        await test.step('Open the Home Page after account deletion', async () => {
            await homePage.open();
        });

        await test.step('Open the login form after account deletion', async () => {
            await loginPage.openLoginForm();
        });

        await test.step('Enter the deleted account credentials', async () => {
            await loginPage.enterUsername(user.username);
            await loginPage.enterPassword(user.password);
        });

        await test.step('Attempt to sign in once with the deleted account', async () => {
            await loginPage.signIn();
        });

        await test.step('Verify the invalid credentials message is displayed', async () => {
            await loginPage.verifyInvalidCredentialsMessageIsDisplayed();
        });

        await test.step('Verify the user remains unauthenticated', async () => {
            await loginPage.verifyUserIsNotSignedIn();
        });

        await test.step('Sign in with a valid existing user to reset the failed login sequence', async () => {
            await loginPage.enterUsername(USERS.existingUser.username);
            await loginPage.enterPassword(USERS.existingUser.password);
            await loginPage.signIn();
            await loginPage.verifyUserIsSignedIn(USERS.existingUser.username);
        });

        await test.step('Sign out the existing user', async () => {
            await loginPage.signOutIfSignedIn(USERS.existingUser.username);
        });
    });
});
