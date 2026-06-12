import { test, expect } from '../pageObjects/pageFixture';
import dotenv from 'dotenv';

dotenv.config();

const identifiers = [
  {
    type: 'username',
    value: process.env.TB_USER_USERNAME!,
  },
  {
    type: 'email',
    value: process.env.TB_USER_EMAIL!,
  },
];

test.describe('Authentication - Login', { tag: '@login' }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  /**
   * TC01 - TC02: Login success (username + email)
   */
  identifiers.forEach(({ type, value }, index) => {
    test(`TC0${index + 1} - Login success with ${type}`, async ({
      loginPage,
      homePage,
      page,
    }) => {
      await loginPage.login(value, process.env.TB_USER_PASSWORD!);
      await expect(page).toHaveURL(`${process.env.TB_BASE_URL}/home`);

      await homePage.logout();
      await expect(page).toHaveURL(`${process.env.TB_BASE_URL}/login`);
    });
  });

  test('TC03 - Login fail with empty credentials', async ({ loginPage }) => {
    await loginPage.btn_login.click();
    // await expect(loginPage.error_incorrectLogin).toBeVisible();
  });

  test('TC04 - Login fail with wrong password', async ({ loginPage }) => {
    await loginPage.login(process.env.TB_USER_USERNAME!, 'wrongPassword123');
    await expect(loginPage.error_incorrectLogin).toBeVisible();
  });

  test('TC05 - Login fail with wrong username', async ({ loginPage }) => {
    await loginPage.login('wrongUser123', process.env.TB_USER_PASSWORD!);
    await expect(loginPage.error_incorrectLogin).toBeVisible();
  });

  test('TC06 - Login fail with non-existent account', async ({ loginPage }) => {
    await loginPage.login('notexist@gmail.com', 'random123');
    await expect(loginPage.error_incorrectLogin).toBeVisible();
  });

  test('TC07 - Login fail with disabled account', async ({ loginPage }) => {
    await loginPage.login(
      process.env.TB_DISABLED_USERNAME!,
      process.env.TB_DISABLED_PASSWORD!,
    );
    // await expect(loginPage.error_accountDisabled).toBeVisible();
  });

  test.afterEach(async ({ loginPage }) => {
    await loginPage.close();
  });
});

test.describe('Authorization - Role Permission', { tag: '@login' },  () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test(
    'TC08 - Admin can access admin dashboard',
    async ({ loginPage, page }) => {
      await loginPage.login(
        process.env.TB_ADMIN_USERNAME!,
        process.env.TB_ADMIN_PASSWORD!,
      );
      await expect(page).not.toHaveURL(/login/);
      await page.goto(`${process.env.TB_BASE_URL}/admin/dashboard`);
      await expect(page).toHaveURL(
        `${process.env.TB_BASE_URL}/admin/dashboard`,
      );
    },
  );

  test('TC09 - User cannot access admin page', async ({ loginPage, page }) => {
    await loginPage.login(
      process.env.TB_USER_USERNAME!,
      process.env.TB_USER_PASSWORD!,
    );

    await page.goto(`${process.env.TB_BASE_URL}/admin/dashboard`);
    await expect(page).not.toHaveURL(
      `${process.env.TB_BASE_URL}/admin/dashboard`,
    );
  });
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
