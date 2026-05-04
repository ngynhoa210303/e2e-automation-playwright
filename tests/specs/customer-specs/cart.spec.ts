import { test, expect } from '../../pageObjects/pageFixture';
import dotenv from 'dotenv';
dotenv.config();

import filterData from '../../../util/data.json';
import {
  formatPriceUS,
  getDataFromObjectJsonFile,
} from '../../common/commons';

test.describe( 'Cart - Add / Update / Remove',{ tag: '@cart' }, () => {
    test.beforeEach(async ({ loginPage, cartCustomerPage, homePage }) => {
      await loginPage.open();

      await loginPage.login(
        process.env.TB_USER_USERNAME_2!,
        process.env.TB_USER_PASSWORD_2!,
      );
      await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/home`);

      // Clear cart trước mỗi test
      await loginPage.navBar.links.cart.click();
      await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/cart`);
      await cartCustomerPage.clearCartBeforeTest();

      await cartCustomerPage.continue_shopping_button.click();
      await expect(homePage.page).toHaveURL(`${process.env.TB_BASE_URL}/home`);
    });

    test.afterEach(async ({ homePage }) => {
      await homePage.close();
    });

    test('TC010 - View product detail', async ({
      productCustomerPage,
      loginPage,
      homePage,
      cartCustomerPage
    }) => {
      await cartCustomerPage.openProductDetail(productCustomerPage, loginPage, homePage);

      const expectedName = getDataFromObjectJsonFile(
        filterData.products,
        'name',
      );

      await expect(
        productCustomerPage.products_detail_product_name,
      ).toHaveText(expectedName);
    });
    test('TC011 - Add product to cart', async ({
      productCustomerPage,
      cartCustomerPage,
      loginPage,
      homePage,
    }) => {
      await cartCustomerPage.openProductDetail(productCustomerPage, loginPage, homePage);

      await cartCustomerPage.addProductToCart(productCustomerPage, cartCustomerPage);

      await loginPage.navBar.links.cart.click();

      await expect(cartCustomerPage.product_name).toBeVisible();
    });
    test('TC012 - Update quantity', async ({
      productCustomerPage,
      cartCustomerPage,
      loginPage,
      homePage,
    }) => {
      await cartCustomerPage.openProductDetail(productCustomerPage, loginPage, homePage);
      await cartCustomerPage.addProductToCart(productCustomerPage, cartCustomerPage);
      await loginPage.navBar.links.cart.click();
      await cartCustomerPage.plus_button.click();
      await expect(cartCustomerPage.quantity_of_product).toHaveValue('2');
      const price = getDataFromObjectJsonFile(filterData.products, 'price');
      await expect(cartCustomerPage.price_of_many_product).toHaveText(
        formatPriceUS(price * 2) + '₫',
      );
      await cartCustomerPage.minus_button.click();
      await expect(cartCustomerPage.quantity_of_product).toHaveValue('1');
    });
    test('TC013 - Remove product from cart', async ({
      productCustomerPage,
      cartCustomerPage,
      loginPage,
      homePage,
    }) => {
      await cartCustomerPage.openProductDetail(productCustomerPage, loginPage, homePage);
      await cartCustomerPage.addProductToCart(productCustomerPage, cartCustomerPage);
      await loginPage.navBar.links.cart.click();
      await cartCustomerPage.delete_button.first().click();
      await expect(cartCustomerPage.emptyCartMessage).toBeVisible();
    });

    test('TC014 - Full flow: Add → Update → Remove', async ({
      productCustomerPage,
      cartCustomerPage,
      loginPage,
      homePage,
    }) => {
      await cartCustomerPage.openProductDetail(productCustomerPage, loginPage, homePage);
      await cartCustomerPage.addProductToCart(productCustomerPage, cartCustomerPage);
      await loginPage.navBar.links.cart.click();
      await cartCustomerPage.plus_button.click();
      await cartCustomerPage.delete_button.first().click();
      await expect(cartCustomerPage.emptyCartMessage).toBeVisible();
    });
  },
);