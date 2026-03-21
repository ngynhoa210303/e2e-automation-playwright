import { BasePage } from '../../base.page';

export default class ProductCustomerPage extends BasePage {
  readonly select_category = this.page.locator('[name="category"]');
  readonly products_card = this.page.locator('//div[contains(@class,"p-4 flex")]');

  async searchProduct(searchTerm: string) {
    await this.navBar.searchInput.fill(searchTerm);
  }

  async open() {
    await super.open('/products');
  }
}
