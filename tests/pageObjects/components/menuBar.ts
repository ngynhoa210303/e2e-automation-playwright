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
    customers: this.page.locator("//a[@href='/admin/customer']"),
  };
 
}
