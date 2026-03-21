import { test, expect } from '../pageObjects/pageFixture';
import dotenv from 'dotenv';

dotenv.config();

const accounts = [
  {
    role: 'admin',
    username: process.env.TB_ADMIN_USERNAME!,
    password: process.env.TB_ADMIN_PASSWORD!,
    url: `${process.env.TB_BASE_URL}/admin/dashboard`,
  },
  {
    role: 'user',
    username: process.env.TB_USER_USERNAME!,
    password: process.env.TB_USER_PASSWORD!,
    url: `${process.env.TB_BASE_URL}/home`,
  },
];

test.describe('Authentication - Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  accounts.forEach(({ role, username, password, url }, index) => {
    test(`TC0${index + 1}  - Login success with ${role}`, async ({
      loginPage,
      homePage,
      page,
    }) => {
      await test.step(`Login with ${role}`, async () => {
        await loginPage.login(username, password);
      });

      await test.step('Verify redirect after login', async () => {
        await expect(page).toHaveURL(`${url}`);
      });

      await test.step('Logout', async () => {
        await homePage.logout();
        await expect(page).toHaveURL(`${process.env.TB_BASE_URL}/login`);
      });
    });
  });
  test('TC04 - Login fail with empty credentials', async ({ loginPage }) => {
    await test.step('Click login without entering credentials', async () => {
      await loginPage.btn_login.click();
    });

    await test.step('Verify validation message', async () => {
      await expect(loginPage.error_incorrectLogin).toBeVisible();
    });
  });
  test('TC03 - Login fail with wrong password', async ({ loginPage }) => {
    await test.step('Enter invalid credentials', async () => {
      await loginPage.login('wrongUser', 'wrongPassword');
    });

    await test.step('Verify error message', async () => {
      await expect(loginPage.error_incorrectLogin).toBeVisible();
    });
  });
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});

test.describe('Authorization - Role Permission', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('TC05 - Admin can access admin dashboard', async ({
    loginPage,
    page,
  }) => {
    await test.step('Login with admin account', async () => {
      await loginPage.login(
        String(process.env.TB_ADMIN_USERNAME),
        String(process.env.TB_ADMIN_PASSWORD),
      );
    });

    await test.step('Access admin dashboard', async () => {
      await page.goto(`${process.env.TB_BASE_URL}/admin/dashboard`);
    });

    await test.step('Verify admin page accessible', async () => {
      await expect(page).toHaveURL(
        `${process.env.TB_BASE_URL}/admin/dashboard`,
      );
    });
  });
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });

  test('TC06 - User cannot access admin page', async ({ loginPage, page }) => {
    await test.step('Login with user account', async () => {
      await loginPage.login(
        process.env.TB_USER_USERNAME!,
        process.env.TB_USER_PASSWORD!,
      );
    });

    await test.step('Try accessing admin page', async () => {
      await page.goto(`${process.env.TB_BASE_URL}/admin/dashboard`);
    });

    await test.step('Verify access denied or redirect', async () => {
      await expect(page).not.toHaveURL(
        `${process.env.TB_BASE_URL}/admin/dashboard`,
      );
    });
  });
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
