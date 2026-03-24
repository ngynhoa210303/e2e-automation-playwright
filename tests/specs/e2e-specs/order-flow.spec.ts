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
test.describe('Order Flow', { tag: '@confirm-order' }, () => {
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

  test('TC21 - Verify staff can view the correct order created by customer', async ({
    productCustomerPage,
    cartCustomerPage,
    payCustomerPage,
    orderCustomerPage,
    loginPage,
    homePage,
    billEmployPage,
  }) => {
    await test.step('Search product,verify product details and buy now', async () => {
      const typeSearch = await getDataFromAnyJsonFile(
        filterData,
        'product-name',
      );
      await productCustomerPage.searchProduct(typeSearch?.value || '');
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
      await expect(productCustomerPage.products_detail_product_name).toHaveText(
        expectedName,
      );
      const expectedCollarName = getDataFromObjectJsonFile(
        filterData.products,
        'collar',
      );
      await expect(productCustomerPage.products_detail_collar_name).toHaveText(
        expectedCollarName,
      );
      const expectedSleeveName = getDataFromObjectJsonFile(
        filterData.products,
        'sleeve',
      );
      await expect(productCustomerPage.products_detail_sleeve_name).toHaveText(
        expectedSleeveName,
      );
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
        formatPrice(expectedPrice) + '₫',
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
      await cartCustomerPage.buy_now_button.click();
      await expect(cartCustomerPage.page).toHaveURL(
        `${process.env.TB_BASE_URL}/pay`,
      );
    });
    const rawText = await payCustomerPage.product_quantity.innerText();
    const quantity = Number(rawText.replace(/[^\d]/g, ''));
    await test.step('Pricing on payment page', async () => {
      await payCustomerPage.address_option.first().click();
      await expect(payCustomerPage.product_name).toHaveText(
        getDataFromObjectJsonFile(filterData.products, 'name'),
      );
      await expect(payCustomerPage.product_price).toHaveText(
        formatPriceUS(getDataFromObjectJsonFile(filterData.products, 'price')) +
          '₫',
      );
      await expect(payCustomerPage.product_quantity).toHaveText('x1');
      await expect(payCustomerPage.estimated_price).toHaveText(
        formatPriceUS(
          getDataFromObjectJsonFile(filterData.products, 'price') * quantity,
        ) + '₫',
      );
      await expect(payCustomerPage.shipping_fee).toHaveText(
        formatPriceUS(getDataFromObjectJsonFile(filterData.pay, 'ship-fee')) +
          '₫',
      );
      await expect(payCustomerPage.total_fee).toHaveText(
        formatPriceUS(
          getDataFromObjectJsonFile(filterData.products, 'price') * quantity +
            getDataFromObjectJsonFile(filterData.pay, 'ship-fee'),
        ) + '₫',
      );
    });
    await test.step('Place order and confirm payment', async () => {
      await payCustomerPage.order_button.click();
      await expect(payCustomerPage.cofirm_total_cost).toHaveText(
        formatPriceUS(
          getDataFromObjectJsonFile(filterData.products, 'price') * quantity +
            getDataFromObjectJsonFile(filterData.pay, 'ship-fee'),
        ) + '₫',
      );
      await payCustomerPage.modalConfirm.yes_button.click();
      await expect(
        cartCustomerPage.toastMessage.success_message.first(),
      ).toBeVisible();
      await expect(
        cartCustomerPage.toastMessage.success_message.first(),
      ).toBeHidden();
      await expect(payCustomerPage.page).toHaveURL(
        `${process.env.TB_BASE_URL}/order`,
      );
    });
    const orderId = await orderCustomerPage.order_list_order_id
      .first()
      .innerText();
    await test.step('Verify order created successfully and details are correct', async () => {
      await orderCustomerPage.order_list_order_id.first().click();
      await orderCustomerPage.order_detail_subtotal.scrollIntoViewIfNeeded();
      await expect(orderCustomerPage.order_detail_subtotal).toHaveText(
        formatPrice(
          getDataFromObjectJsonFile(filterData.products, 'price') * quantity,
        ) + ' ₫',
      );
      await expect(orderCustomerPage.order_detail_total_payment).toHaveText(
        formatPrice(
          getDataFromObjectJsonFile(filterData.products, 'price') * quantity +
            getDataFromObjectJsonFile(filterData.pay, 'ship-fee'),
        ) + ' ₫',
      );
      await expect(orderCustomerPage.order_detail_shipping_fee).toHaveText(
        formatPrice(getDataFromObjectJsonFile(filterData.pay, 'ship-fee')) +
          ' ₫',
      );
      await orderCustomerPage.order_detail_close_button.click();
    });
    await test.step('Switch to staff account and verify order details', async () => {
      await homePage.navBar.userAvatar.hover();
      await expect(homePage.navBar.btn_logout).toBeVisible();
      await homePage.navBar.btn_logout.click();
      await loginPage.login(
        process.env.TB_STAFF_USERNAME!,
        process.env.TB_STAFF_PASSWORD!,
      );
      await expect(loginPage.page).toHaveURL(
        `${process.env.TB_BASE_URL}/admin/salePOS`,
      );
      await loginPage.menuBar.menu.bills.click();
      await loginPage.menuBar.submenu.billOnl.click();
      await billEmployPage.searchByOrderId(orderId);
      await billEmployPage.order_detail_button.first().click();
      await expect(billEmployPage.order_detail_product_price).toHaveText(
        formatPrice(
          getDataFromObjectJsonFile(filterData.products, 'price') * quantity,
        ) + ' ₫',
      );
      await expect(billEmployPage.order_detail_shipping_fee).toHaveText(
        formatPrice(
          getDataFromObjectJsonFile(filterData.pay, 'ship-fee'),
        ) + ' ₫',
      );
      await expect(billEmployPage.order_detail_total_price).toHaveText(
        formatPrice(
          getDataFromObjectJsonFile(filterData.products, 'price') * quantity +
            getDataFromObjectJsonFile(filterData.pay, 'ship-fee'),
        ) + ' ₫',
      );
    });
  });
});
