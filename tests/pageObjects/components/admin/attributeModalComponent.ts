import { BasePageComponent } from '../../base.pageComponent';

export default class AttributeModalComponent extends BasePageComponent {
  readonly cancel_button = this.page.locator("//button[normalize-space(text())='Hủy bỏ']");
  readonly add_button = this.page.locator("//button[contains(text(),'Thêm mới')]");
  readonly update_button = this.page.locator("//button[text()='Hủy bỏ']/following-sibling::button");
  async createAttribute(nameView: string, nameAttribute: string) {
    await this.page.locator(`//div[@aria-label='Thêm ${nameView}']//input`).fill(nameAttribute);
    await Promise.all([
      this.add_button.click(),
    ]);
  }
  async updateAttribute(nameView: string, nameAttribute: string) {
    await this.page.locator(`//div[@aria-label='Cập nhật ${nameView}']//input`).fill(nameAttribute);
    await Promise.all([
      this.update_button.click(),
    ]);
  }
}

