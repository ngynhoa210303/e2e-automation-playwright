import { BasePage } from '../base.page';

export default class LoginPage extends BasePage {
  readonly txt_email = this.page.locator("input[name='email']");
  readonly txt_password = this.page.locator("input[name='password']");
  readonly btn_signIn = this.page.locator("button[type='submit']");
  readonly noti_login_success = this.page.locator(
    '//div[contains(@class, "toast--success")]//div[text()="Logged in successfully"]',
  );
  readonly error_incorrectEmail = this.page.locator(
    "//input[@name='email']/parent::div/following-sibling::p[text()='You have entered an incorrect email or password.']"
  );
  readonly error_incorrectPassword = this.page.locator(
    "//input[@name='password']/parent::div/following-sibling::p[text()='You have entered an incorrect password.']"
  );

  async login(email: string, password: string) {
    await Promise.all([
      await this.txt_email.fill(email),
      await this.txt_password.fill(password)
    ])
    await this.btn_signIn.click();
  }

  async open() {
    await super.open('/auth/login');
  }
}
