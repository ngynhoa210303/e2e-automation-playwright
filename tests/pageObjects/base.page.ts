import { Locator, type Page } from '@playwright/test';
import NavBar from './components/navBar';
import AllowCookiesPopup from './components/allowCookiesPopup';
import Filter from './components/filter';
import ModalComponent from './components/confirmation_modal';
import dotenv from 'dotenv';
import ChangePassword from './components/changePasswordPopup';
import ToastMessage from './components/toast-message';
dotenv.config();

export abstract class BasePage {
  public navBar: NavBar;
  public cookiePopup: AllowCookiesPopup;
  public filter: Filter;
  public modalConfirm: ModalComponent;
  public toastMessage: ToastMessage;
  public changePassword: ChangePassword;
  public baseUrl = process.env.TB_BASE_URL || 'https://mrbip.vn';

  constructor(readonly page: Page) {
    this.navBar = new NavBar(this.page);
    this.cookiePopup = new AllowCookiesPopup(this.page);
    this.filter = new Filter(this.page);
    this.modalConfirm = new ModalComponent(this.page);
    this.toastMessage = new ToastMessage(this.page);
    this.changePassword = new ChangePassword(this.page);
  }

  async open(path: string) {
    await this.page.goto(this.baseUrl + path, { waitUntil: 'domcontentloaded' });
  }

  async close() {
    await this.page.close();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle', { timeout: 10000 });
  }

  async pause_test() {
    await this.page.pause();
  }

  async reload_page() {
    await this.page.reload({waitUntil: 'domcontentloaded'})
  }
}
