import { BasePageComponent } from '../base.pageComponent';

export default class MenuBar extends BasePageComponent {
  readonly menu = {
    salePOS: this.page.locator("//a[@href='/admin/salePOS']"),
    bills: this.page.locator("//span[contains(text(),'Quản lý hóa đơn')]/following::div[1]"),
    products: this.page.locator("//span[contains(text(),'Sản phẩm')]/following::div[1]"),
    accounts: this.page.locator("//span[contains(text(),'Tài khoản')]/following::div[1]"),
    vouchers: this.page.locator("//a[@href='/admin/voucher']")
  };
  readonly submenu = {
    billPOS: this.page.locator("//a[@href='/admin/order/pos']"),
    billOnl: this.page.locator("//a[@href='/admin/order/online']"),
    productLists: this.page.locator("//a[@href='/admin/product']"),
    productCreate: this.page.locator("//a[@href='/admin/product/create']"),
    categories: this.page.locator("//a[@href='/admin/category']"),
    brands: this.page.locator("//a[@href='/admin/brand']"),
    collars: this.page.locator("//a[@href='/admin/attribute/collar']"),
    materials: this.page.locator("//a[@href='/admin/material']"),
    colors: this.page.locator("//a[@href='/admin/attribute/color']"),
    sizes: this.page.locator("//a[@href='/admin/attribute/size']"),
    sleeves: this.page.locator("//a[@href='/admin/attribute/sleeve']"),
    promotions: this.page.locator("//a[@href='/admin/attribute/promotion']"),
    customers: this.page.locator("//a[@href='/admin/customer']"),
    employees: this.page.locator("//a[@href='/admin/employee']"),
  };
 
}
