import { BasePage } from '../../base.page';

export default class MaterialPage extends BasePage {
  readonly material_searchInput = this.page.locator("//input[@placeholder='Tìm kiếm chất liệu...']")
  readonly add_button = this.page.locator('//button[contains(text(),"Thêm Mới")]');
  readonly noResultsMessage = this.page.locator("//td[normalize-space(text())='Không tìm thấy dữ liệu']");
  
  async open() {
    await super.open('/admin/material');
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
