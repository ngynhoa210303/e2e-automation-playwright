import { expect } from '@playwright/test';
import { BasePage } from '../../base.page';

export default class CartCustomerPage extends BasePage {
  readonly product_card = this.page.locator(
    "//div[@class='space-y-4']//div[contains(@class,'bg-white')]",
  );
  readonly product_attributes = this.page
    .locator(
      "//div[@class='space-y-4']//div[contains(@class,'bg-white')]//span[contains(@class,'bg-gray-100 px-2')]",
    )
    .first();
  readonly price_of_a_product = this.page.locator(
    '(//div[contains(@class,"hidden sm:block")]//div)[1]',
  );
  readonly price_of_many_product = this.page.locator(
    "(//div[@class='text-right w-24']//div)[1]",
  );
  readonly quantity_of_product = this.page.locator(
    "(//div[@class='flex items-center']//input)[1]",
  );
  readonly product_name = this.page.locator(
    "//div[@class='space-y-4']//div[contains(@class,'bg-white')]//h3",
  );
  readonly product_brand = this.page.locator(
    "//div[@class='space-y-4']//div[contains(@class,'bg-white')]//span[contains(@class,'bg-blue-50 text-[#1E3A8A]')]",
  );
  readonly continue_shopping_button = this.page.locator(
    "//button[contains(text(),'Tiếp tục mua sắm')]",
  );
  readonly add_to_card_button = this.page.locator("//button[contains(text(),'Thêm vào giỏ')]")
  readonly buy_now_button = this.page.locator("//button[normalize-space(text())='Mua Ngay']")
  readonly buy_button = this.page.locator("//button[normalize-space(text())='Mua Hàng']")
  readonly plus_button = this.page.locator("//button[normalize-space(text())='+']")
  readonly minus_button = this.page.locator("//button[normalize-space(text())='-']")
  readonly delete_button = this.page.locator("//button[@title='Xóa sản phẩm']");
  readonly emptyCartMessage = this.page.locator("//h2[normalize-space(text())='Giỏ hàng trống']");

  async open() {
    await super.open('/cart');
  }
  async clearCartBeforeTest() {
    const toast = this.page.locator(
      "//div[contains(@class,'Toastify__toast--success')]",
    );
    while ((await this.delete_button.count()) > 0) {
      await this.delete_button.first().click();
      await expect(toast.first()).toBeVisible();
      await expect(toast.first()).toBeHidden();
    }
  }
}
