import { test as base } from '@playwright/test';
import LoginPage from './pages/login.page';
import HomePage from './pages/customer/home.page';
import ProductCustomerPage from './pages/customer/product.page';
import CartCustomerPage from './pages/customer/cart.page';
import PayCustomerPage from './pages/customer/pay.page';
import OrderCustomerPage from './pages/customer/order.page';
import BillEmployPage from './pages/employee/bill.page';
import MaterialPage from './pages/admin/material.page';
import BrandPage from './pages/admin/brand.page';
import PersonalPage from './pages/customer/personal.page';

export type PageObjects = {
  homePage: HomePage;
  loginPage: LoginPage;
  productCustomerPage: ProductCustomerPage;
  cartCustomerPage: CartCustomerPage;
  payCustomerPage: PayCustomerPage;
  orderCustomerPage: OrderCustomerPage;
  billEmployPage: BillEmployPage;
  materialPage: MaterialPage;
  brandPage: BrandPage;
  personalPage: PersonalPage;
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
  productCustomerPage: async ({ page }, use) => {
    const productCustomerPage = new ProductCustomerPage(page);
    await use(productCustomerPage);
  },
  cartCustomerPage: async ({ page }, use) => {
    const cartCustomerPage = new CartCustomerPage(page);
    await use(cartCustomerPage);
  },
  payCustomerPage: async ({ page }, use) => {
    const payCustomerPage = new PayCustomerPage(page);
    await use(payCustomerPage);
  },
  orderCustomerPage: async ({ page }, use) => {
    const orderCustomerPage = new OrderCustomerPage(page);
    await use(orderCustomerPage);
  },
  billEmployPage: async ({ page }, use) => {
    const billEmployPage = new BillEmployPage(page);
    await use(billEmployPage);
  },
  materialPage: async ({ page }, use) => {
    const materialPage = new MaterialPage(page);
    await use(materialPage);
  },
  brandPage: async ({ page }, use) => {
    const brandPage = new BrandPage(page);
    await use(brandPage);
  },
  personalPage: async ({ page }, use) => {
    const personalPage = new PersonalPage(page);
    await use(personalPage);
  }
});

export { expect, type Page, type Locator, type Response } from '@playwright/test';
