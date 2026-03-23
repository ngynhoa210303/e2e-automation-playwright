import { test, expect } from '../../pageObjects/pageFixture';
import dotenv from 'dotenv';
dotenv.config();
import filterData from '../../../util/data.json';
import {
  formatPrice,
  formatPriceUS,
  getDataFromAnyJsonFile,
  getDataFromObjectJsonFile,
} from '../../common/commons';

test.describe(
  'User adds a product to cart, update quantity and remove product from cart',
  { tag: '@cart' },
  () => {
    test.beforeEach(async ({ loginPage, cartCustomerPage, homePage }) => {
      await loginPage.open();
      await loginPage.login(
        process.env.TB_USER_USERNAME_2!,
        process.env.TB_USER_PASSWORD_2!,
      );
      await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/home`);
      await loginPage.navBar.links.cart.click();
      await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/cart`);
      await cartCustomerPage.waitForPageLoad();
      await cartCustomerPage.clearCartBeforeTest();
      await cartCustomerPage.continue_shopping_button.click();
      await expect(homePage.page).toHaveURL(`${process.env.TB_BASE_URL}/home`);
    });

    test('Add product to cart - update quantity - remove product from cart', async ({
      productCustomerPage,
      loginPage,
      homePage,
      cartCustomerPage,
    }) => {
      await test.step('Open products page', async () => {
        await loginPage.navBar.links.products.click();
        await expect(homePage.page).toHaveURL(
          `${process.env.TB_BASE_URL}/products`,
        );
      });
      await test.step('Choose product detail page', async () => {
        const typeSearch = await getDataFromAnyJsonFile(
          filterData,
          'product-name',
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
        const expectedName = getDataFromObjectJsonFile(
          filterData.products,
          'name',
        );
        await expect(
          productCustomerPage.products_detail_product_name,
        ).toHaveText(expectedName);
        const expectedCollarName = getDataFromObjectJsonFile(
          filterData.products,
          'collar',
        );
        await expect(
          productCustomerPage.products_detail_collar_name,
        ).toHaveText(expectedCollarName);
        const expectedSleeveName = getDataFromObjectJsonFile(
          filterData.products,
          'sleeve',
        );
        await expect(
          productCustomerPage.products_detail_sleeve_name,
        ).toHaveText(expectedSleeveName);
        const expectedBrandName = getDataFromObjectJsonFile(
          filterData.products,
          'brand',
        );
        await expect(productCustomerPage.products_detail_brand_name).toHaveText(
          expectedBrandName,
        );
        const expectedPrice = getDataFromObjectJsonFile(
          filterData.products,
          'price',
        );
        await expect(productCustomerPage.products_detail_price).toHaveText(
          formatPrice(expectedPrice)+ '₫',
        );

        const expectedColorName = getDataFromObjectJsonFile(
          filterData.products,
          'color',
        );
        await expect(productCustomerPage.products_detail_color_name).toHaveText(
          expectedColorName,
        );
        const expectedSizeName = getDataFromObjectJsonFile(
          filterData.products,
          'size',
        );
        await expect(productCustomerPage.products_detail_size_name).toHaveText(
          expectedSizeName,
        );
      });
      await test.step('Add product to cart', async () => {
        await cartCustomerPage.add_to_card_button.click();
        await expect(cartCustomerPage.toastMessage.success_message.first()).toBeVisible();
        await expect(cartCustomerPage.toastMessage.success_message.first()).toBeHidden();
      });
      await test.step('Verify product in cart', async () => {
        await loginPage.navBar.links.cart.click();
        await expect(loginPage.page).toHaveURL(
          `${process.env.TB_BASE_URL}/cart`,
        );
        await cartCustomerPage.product_name.scrollIntoViewIfNeeded();
        await expect(cartCustomerPage.product_name).toHaveText(
          getDataFromObjectJsonFile(filterData.products, 'name'),
        );
        await expect(cartCustomerPage.price_of_a_product).toHaveText(
          formatPriceUS(
            getDataFromObjectJsonFile(filterData.products, 'price'),
          )+ '₫',
        );
        await expect(cartCustomerPage.product_brand).toHaveText(
          getDataFromObjectJsonFile(filterData.products, 'brand'),
        );
        await expect(cartCustomerPage.product_attributes).toHaveText(
          getDataFromObjectJsonFile(filterData.products, 'size') +
            ' - ' +
            getDataFromObjectJsonFile(filterData.products, 'color') +
            ' - ' +
            getDataFromObjectJsonFile(filterData.products, 'collar') +
            ' - ' +
            getDataFromObjectJsonFile(filterData.products, 'sleeve'),
        );
      });
      await test.step('Update quantity', async () => {
        await cartCustomerPage.plus_button.click();
        await expect(cartCustomerPage.quantity_of_product).toHaveValue('2');
        await expect(cartCustomerPage.price_of_many_product).toHaveText(
          formatPriceUS(
            getDataFromObjectJsonFile(filterData.products, 'price') * 2,
          )+ '₫',
        );
      });
      await cartCustomerPage.minus_button.click();
      await expect(cartCustomerPage.quantity_of_product).toHaveValue('1');
      await expect(cartCustomerPage.price_of_many_product).toHaveText(
        formatPriceUS(
          getDataFromObjectJsonFile(filterData.products, 'price') * 1,
        )+ '₫',
      );
      await test.step('Remove product from cart', async () => {
        await cartCustomerPage.delete_button.first().click();
        await expect(cartCustomerPage.toastMessage.success_message.first()).toBeVisible();
        await expect(cartCustomerPage.toastMessage.success_message.first()).toBeHidden();
        await expect(cartCustomerPage.emptyCartMessage).toBeVisible();
      });
    });
  },
);
test.afterEach(async ({ homePage }) => {
  await homePage.close();
});
