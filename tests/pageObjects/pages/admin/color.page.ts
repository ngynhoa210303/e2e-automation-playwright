import { BasePage } from '../../base.page';

export default class ColorPage extends BasePage {
  readonly color_searchInput = this.page.locator("//input[@placeholder='Tìm kiếm màu sắc...']")
  readonly add_button = this.page.locator('//button[contains(text(),"Thêm Mới")]');
  readonly noResultsMessage = this.page.locator("//td[normalize-space(text())='Không tìm thấy dữ liệu']");
  
  async open() {
    await super.open('/admin/attribute/color');
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
