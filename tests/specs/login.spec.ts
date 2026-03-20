import { test, expect } from '../pageObjects/pageFixture';
import dotenv from 'dotenv';
dotenv.config();

test.describe('Test Login page', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
    await homePage.cookiePopup.allow_cookie();
    await homePage.menu.click();
    await homePage.menu_login.click();
  });

  test('Test Login button disable if user not input email and password', {tag: '@regression'}, async ({ homePage, loginPage }) => {
    await test.step('Check Login button disable', async () => {
      await expect(loginPage.btn_signIn).toBeDisabled();
    });

    await test.step('Login with invalid email', async () => {
      await loginPage.login('invalidEmail@manage', String(process.env.AL_TEST_ACCOUNT_PASSWORD));
    });
    await test.step('Check error invalid email', async () => {
      await expect(loginPage.error_incorrectEmail).toBeVisible();
    });

    await test.step('Login with invalid password', async () => {
      await loginPage.login(String(process.env.AL_TEST_ACCOUNT_EMAIL), 'invalidPassword');
    });
    await test.step('Check error incorrect password display', async () => {
      await expect(loginPage.error_incorrectPassword).toBeVisible();
    });

    await test.step('Login with valid email and password', async () => {
      await loginPage.login(String(process.env.AL_TEST_ACCOUNT_EMAIL), String(process.env.AL_TEST_ACCOUNT_PASSWORD));
    });
    await test.step('Check login success notification display', async () => {
      await expect(loginPage.noti_login_success).toBeVisible();
    });
  });

  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
