import { BasePage } from '../../base.page';

export default class BillEmployPage extends BasePage {
  readonly search_input = this.page.locator("//input[@placeholder='Tìm kiếm mã đơn, tên khách hàng...']");
  readonly order_list_first_row_order_id = this.page.locator("//tbody/tr[1]//td[3]//span");
  readonly order_detail_button = this.page.locator("//button[@title='Chi tiết đơn hàng']");
  readonly order_detail_confirm_button_on_progressbar = this.page.locator("//button[@title='Xác nhận đơn hàng (trừ kho)']");
  readonly order_detail_confirm_button = this.page.locator("//button[normalize-space(text())='Xác nhận']");
  readonly order_detail_confirmed_badge = this.page.locator('span').filter({ hasText: 'Đã xác nhận' }).first();
  readonly order_detail_product_price = this.page.locator("//td[text()='Tổng tiền trước khi áp voucher:']/following-sibling::td");
  readonly order_detail_shipping_fee = this.page.locator("//td[text()='Phí giao hàng:']/following-sibling::td");
  readonly order_detail_total_price = this.page.locator("//td[text()='Tổng tiền sau khi áp voucher:']/following-sibling::td");

  async open() {
    await super.open('/home');
  }
  async searchByOrderId(orderId: string) {
    await this.search_input.fill(orderId);
    await this.search_input.press('Enter');
  }
}
