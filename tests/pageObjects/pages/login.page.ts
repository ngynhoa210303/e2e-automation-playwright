import { BasePage } from '../base.page';

export default class LoginPage extends BasePage {
  readonly txt_username= this.page.locator("//input[@type='text']");
  readonly txt_password = this.page.locator("//input[@type='password']");
  readonly btn_login = this.page.locator("button[type='submit']");
  readonly error_incorrectLogin = this.page.locator(
    "//div[normalize-space(text())='Tên đăng nhập hoặc mật khẩu không đúng']"
  );
  readonly error_accountDisabled = this.page.locator(
    "//div[normalize-space(text())='Tài khoản của bạn đã bị vô hiệu hóa']"
  );

async login(username: string, password: string) {
  await this.txt_username.fill(username);
  await this.txt_password.fill(password);
  await this.page.waitForTimeout(500);

  await Promise.all([
    this.btn_login.click(),
  ]);
}

  async open() {
    await super.open('/login');
  }
}
