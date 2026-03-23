import { BasePage } from "../../base.page";

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
  readonly products_card = this.page.locator(
    '//div[contains(@class,"p-4 flex")]',
  );
  readonly select_color = this.page.locator('[name="color"]');
  readonly select_price = this.page.locator('[name="price"]');
  readonly select_brand = this.page.locator('[name="brand"]');
  readonly select_size = this.page.locator('[name="size"]');
  readonly select_collar = this.page.locator('[name="collar"]');
  readonly select_sleeve = this.page.locator('[name="sleeve"]');
  readonly minPrice = this.page.locator('input[placeholder="Từ"]');
  readonly maxPrice = this.page.locator('input[placeholder="Đến"]');
  readonly resetButton = this.page.locator('button:has-text("Đặt lại")');

  async clickResetButton() {
    await this.resetButton.click();
  }
  async searchProduct(searchTerm: string) {
    await this.navBar.searchInput.fill(searchTerm);
  }
  async selectCategory(category: string) {
    await this.select_category.selectOption({ label: category });
  }
  async selectBrand(value: string) {
    await this.select_brand.selectOption({ label: value });
  }
  async selectColor(value: string) {
    await this.select_color.selectOption({ label: value });
  }
  async selectSize(value: string) {
    await this.select_size.selectOption({ label: value });
  }
  async selectSleeve(value: string) {
    await this.select_sleeve.selectOption({ label: value });
  }
  async selectCollar(value: string) {
    await this.select_collar.selectOption({ label: value });
  }
  async filterByPrice(min: string, max: string) {
    await this.minPrice.waitFor({ state: 'visible' });
    await this.minPrice.fill(min);
    await this.maxPrice.waitFor({ state: 'visible' });
    await this.maxPrice.fill(max);
    await this.page.keyboard.press("Enter");
  }

  async open() {
    await super.open("/products");
  }
}
