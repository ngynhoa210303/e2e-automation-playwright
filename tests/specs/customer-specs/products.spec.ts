import { test, expect } from '../../pageObjects/pageFixture';
import dotenv from 'dotenv';
dotenv.config();
import filterData from '../../../util/data.json';
test.describe('Product Filter', {tag: '@regression'}, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_USER_USERNAME!,
      process.env.TB_USER_PASSWORD!,
    );
    await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/home`);
    await loginPage.navBar.links.products.click();
    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/products`,
    );
    await loginPage.page.waitForTimeout(1000);
  });

  test('TC01 - Filter products by name', async ({ productCustomerPage }) => {
    await test.step('Open products page', async () => {
      await productCustomerPage.waitForPageLoad();
      const beforeCount = await productCustomerPage.products_card.count();
      expect(beforeCount).toBeGreaterThan(1);
      const typeSearch = filterData.filters.find(
        (f) => f.type === 'product-name',
      );
      await productCustomerPage.searchProduct(typeSearch?.value || '');
      await productCustomerPage.page.waitForTimeout(500);
      await productCustomerPage.page
        .locator('p')
        .filter({ hasText: typeSearch?.value })
        .first()
        .click();
      await productCustomerPage.page.waitForTimeout(500);
      await productCustomerPage.page
        .locator('h1')
        .filter({ hasText: typeSearch?.value })
        .waitFor({
          state: 'visible',
        });
    });
  });
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
