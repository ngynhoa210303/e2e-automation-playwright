import { BasePage } from '../../base.page';

export default class PayCustomerPage extends BasePage {
  readonly phone_number_input = this.page.locator('input[name="phone"]');
  readonly address_option = this.page.locator('//div[@class="space-y-3 mb-4"]//div[contains(@class,"p-4 rounded-xl")]');
  readonly product_name = this.page.locator('//h3[contains(@class,"text-sm font-bold")]');
  readonly product_quantity = this.page.locator('//div[contains(@class,"flex justify-between")]//p[1]');
  readonly product_price = this.page.locator("//p[contains(@class,'text-xs font-semibold')]/following-sibling::p[1]");
  readonly estimated_price = this.page.locator("//span[text()='Tạm tính']/following-sibling::span");
  readonly shipping_fee = this.page.locator("//span[text()='Phí vận chuyển']/following-sibling::span");
  readonly total_fee = this.page.locator("//span[text()='Tổng cộng']/following-sibling::span");
  readonly order_button = this.page.locator('//button[contains(text(),"Đặt Hàng")]');
  readonly cofirm_total_cost = this.page.locator("//p[@class='text-gray-500 mb-6']//span[1]");

  async open() {
    await super.open('/pay');
  }
}
