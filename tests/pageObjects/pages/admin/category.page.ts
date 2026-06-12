import { BasePage } from '../../base.page';

export default class CategoryPage extends BasePage {
  readonly category_searchInput = this.page.locator("//input[@placeholder='Tìm kiếm danh mục...']")
  readonly add_button = this.page.locator('//button[contains(text(),"Thêm Mới")]');
  readonly noResultsMessage = this.page.locator("//td[normalize-space(text())='Không tìm thấy dữ liệu']");
  
  async open() {
    await super.open('/admin/category');
  }
  getEditButtonByName(name: string) {
    return this.page.locator(`//tr[td[normalize-space()="${name}"]]//button[@title='Chỉnh sửa']`);
  }

  getRowByName(name: string) {
    return this.page.locator(`//tr[td[normalize-space()="${name}"]]`);
  }
  getToggleByName(name: string) {
  return this.page.locator(
    `//tr[td[normalize-space()="${name}"]]//input[@role="switch"]`
  );
}
}
