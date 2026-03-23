import { BasePage } from '../base.page';

export default class LoginPage extends BasePage {
  readonly txt_username= this.page.locator("//input[@type='text']");
  readonly txt_password = this.page.locator("//input[@type='password']");
  readonly btn_login = this.page.locator("button[type='submit']");
  readonly error_incorrectLogin = this.page.locator(
    "(//div[contains(@class,'w-full max-w-md')]//div)[2]"
  );

  async login(username: string, password: string) {
    await Promise.all([
      await this.txt_username.fill(username),
      await this.txt_password.fill(password)
    ])
    await this.btn_login.click();
  }

  async open() {
    await super.open('/login');
  }
}
