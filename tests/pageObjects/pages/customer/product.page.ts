import { BasePage } from '../../base.page';

export default class ProductCustomerPage extends BasePage {
  readonly select_category = this.page.locator('[name="category"]');
  readonly products_card = this.page.locator('//div[contains(@class,"p-4 flex")]');
  readonly products_detail_product_name = this.page.locator(`//div[contains(@class,'flex items-center')]/following-sibling::h1[1]`);
  readonly products_detail_collar_name = this.page.locator(`(//span[contains(@class,'text-sm font-bold')]/following-sibling::select)[1]`);
  readonly products_detail_sleeve_name = this.page.locator(`(//span[contains(@class,'text-sm font-bold')]/following-sibling::select)[2]`);
  readonly products_detail_brand_name = this.page.locator(`//div[@class='flex items-center gap-2 mb-2']//span`);
  readonly products_detail_price= this.page.locator(`(//div[contains(@class,'flex justify-between')]//span)[1]`);
  readonly products_detail_color_name = this.page.locator("//span[normalize-space(text())='Màu sắc']//parent::div//button[1]");
  readonly products_detail_size_name = this.page.locator("//button[contains(@class,'shadow-md transform scale-105')]");

  async searchProduct(searchTerm: string) {
    await this.navBar.searchInput.fill(searchTerm);
  }

  async open() {
    await super.open('/products');
  }
}
