import { BasePage } from '../../base.page';

export default class OrderCustomerPage extends BasePage {
  readonly order_list_order_id = this.page.locator("//td[@class='px-8 py-6']//span");
  readonly order_detail_subtotal = this.page.locator("//span[text()='Tổng tiền hàng:']/following-sibling::span");
  readonly order_detail_total_payment = this.page.locator("//span[text()='Tổng thanh toán:']/following-sibling::span");
  readonly order_detail_shipping_fee = this.page.locator("//span[text()='Phí vận chuyển:']/following-sibling::span");
  readonly order_detail_close_button = this.page.locator("//button[contains(@class,'text-white/70 hover:text-white')]");

  async open() {
    await super.open('/order');
  }
}
