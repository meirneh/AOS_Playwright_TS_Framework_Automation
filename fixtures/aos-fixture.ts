import { test as base, expect } from '@playwright/test';
import AccountDeletionPage from '../pages/AccountDeletionPage';
import CategoryPage from '../pages/CategoryPage';
import CheckoutPage from '../pages/CheckoutPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import MiniCartComponent from '../pages/components/MiniCartComponent';
import MyAccountPage from '../pages/MyAccountPage';
import MyOrdersPage from '../pages/MyOrdersPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import RegisterPage from '../pages/RegisterPage';
import SearchResultsPage from '../pages/SearchResultsPage';
import ShoppingCartPage from '../pages/ShoppingCartPage';

export type AosFixtures = {
    accountDeletionPage: AccountDeletionPage;
    categoryPage: CategoryPage;
    checkoutPage: CheckoutPage;
    homePage: HomePage;
    loginPage: LoginPage;
    miniCartComponent: MiniCartComponent;
    myAccountPage: MyAccountPage;
    myOrdersPage: MyOrdersPage;
    productDetailsPage: ProductDetailsPage;
    registerPage: RegisterPage;
    searchResultsPage: SearchResultsPage;
    shoppingCartPage: ShoppingCartPage;
};

export const test = base.extend<AosFixtures>({
    accountDeletionPage: async ({ page }, use) => {
        await use(new AccountDeletionPage(page));
    },
    categoryPage: async ({ page }, use) => {
        await use(new CategoryPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    miniCartComponent: async ({ page }, use) => {
        await use(new MiniCartComponent(page));
    },
    myAccountPage: async ({ page }, use) => {
        await use(new MyAccountPage(page));
    },
    myOrdersPage: async ({ page }, use) => {
        await use(new MyOrdersPage(page));
    },
    productDetailsPage: async ({ page }, use) => {
        await use(new ProductDetailsPage(page));
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    searchResultsPage: async ({ page }, use) => {
        await use(new SearchResultsPage(page));
    },
    shoppingCartPage: async ({ page }, use) => {
        await use(new ShoppingCartPage(page));
    },
});

export { expect };
