import { test, expect } from '../../pageObjects/pageFixture';
import dotenv from 'dotenv';
dotenv.config();
test.describe('Checkout Flow', { tag: '@pay' }, () => {
  test.describe.configure({ mode: 'serial' });
  test.beforeEach(async ({ loginPage, cartCustomerPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_USER_USERNAME!,
      process.env.TB_USER_PASSWORD!,
    );
    await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/home`);
    await loginPage.navBar.links.cart.click();
    await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/cart`);
    await cartCustomerPage.waitForPageLoad();
    await cartCustomerPage.clearCartBeforeTest();
    await cartCustomerPage.continue_shopping_button.click();
    await expect(cartCustomerPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/home`,
    );
    await loginPage.navBar.links.products.click();
    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/products`,
    );
  });

  test('TC015 - Buy Now', async ({
    productCustomerPage,
    cartCustomerPage,
    payCustomerPage,
    orderCustomerPage,
  }) => {
    await productCustomerPage.openAndVerifyProduct();
    await cartCustomerPage.buy_now_button.click();
    await expect(cartCustomerPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/pay`,
    );
    const rawText = await payCustomerPage.product_quantity.innerText();
    const quantity = Number(rawText.replace(/[^\d]/g, ''));
    await payCustomerPage.verifyPayment(payCustomerPage, quantity);
    await payCustomerPage.placeOrder(
      payCustomerPage,
      cartCustomerPage,
      quantity,
    );
    await expect(payCustomerPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/order`,
    );

    await expect(orderCustomerPage.order_list_order_id.first()).toBeVisible();
  });
  test('TC016 - Cart Flow', async ({
    productCustomerPage,
    cartCustomerPage,
    payCustomerPage,
    loginPage,
    orderCustomerPage,
  }) => {
    await productCustomerPage.openAndVerifyProduct();
    await cartCustomerPage.add_to_card_button.click();
    await expect(
      cartCustomerPage.toastMessage.success_message.first(),
    ).toBeVisible();
    await loginPage.navBar.links.cart.click();
    await cartCustomerPage.buy_button.click();
    await expect(cartCustomerPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/pay`,
    );
    const rawText = await payCustomerPage.product_quantity.innerText();
    const quantity = Number(rawText.replace(/[^\d]/g, ''));
    await payCustomerPage.verifyPayment(payCustomerPage, quantity);
    await payCustomerPage.placeOrder(
      payCustomerPage,
      cartCustomerPage,
      quantity,
    );

    await expect(payCustomerPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/order`,
    );
    await expect(orderCustomerPage.order_list_order_id.first()).toBeVisible();
  });
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
