import { BasePage } from '../base.page';

export default class HomePage extends BasePage {
  readonly menu = this.page.locator("//*[contains(@class, 'Header___StyledMenu')]");
  readonly menu_login = this.page.locator("//*[contains(@class, 'MenuLandingPageModal') and text() = 'Log-in']");
  readonly btn_login_here = this.page.locator("(//p[text()='Log-in here'])[1]")
  readonly userAvatar = this.page.locator("div[class*='Avatar']");
  readonly btn_logout = this.page.locator("//li[text()='Logout']");

  async open() {
    await super.open('/');
  }
}
