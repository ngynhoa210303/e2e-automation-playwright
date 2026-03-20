
import { test as base } from '@playwright/test';
import LoginPage from './pages/login.page';
import HomePage from './pages/home.page';

export type PageObjects = {
  homePage: HomePage;
  loginPage: LoginPage;
};

export const test = base.extend<PageObjects>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

export { expect, type Page, type Locator, type Response } from '@playwright/test';
