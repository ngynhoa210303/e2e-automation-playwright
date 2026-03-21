import { BasePage } from '../../base.page';

export default class HomePage extends BasePage {
  readonly menu = this.page.locator('div.relative.group\/user.cursor-pointer').locator('div').nth(0)
  readonly shop_name = this.page.locator('div.hidden.sm\:flex.flex-col').locator('p').nth(1);

  async open() {
    await super.open('/home');
  }
  async logout() {
    await this.navBar.userAvatar.click();
    await this.navBar.btn_logout.click();
  }
}
