import { Locator, type Page } from '@playwright/test';
import NavBar from './components/navBar';
import AllowCookiesPopup from './components/allowCookiesPopup';
import Filter from './components/filter';
import Search from './components/search';
import dotenv from 'dotenv';
import ChangePassword from './components/changePasswordPopup';
dotenv.config();


export abstract class BasePage {
  public navBar: NavBar;
  public cookiePopup: AllowCookiesPopup;
  public filter: Filter;
  public search: Search;
  public changePassword: ChangePassword;
  public baseUrl = process.env.BASE_URL || 'https://alpha.auroralive.com';

  constructor(readonly page: Page) {
    this.navBar = new NavBar(this.page);
    this.cookiePopup = new AllowCookiesPopup(this.page);
    this.filter = new Filter(this.page);
    this.search = new Search(this.page);
    this.changePassword = new ChangePassword(this.page);
  }

  async open(path: string) {
    await this.page.goto(this.baseUrl + path, { waitUntil: 'domcontentloaded' });
  }

  async close() {
    await this.page.close();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle') 
  }

  async pause_test() {
    await this.page.pause();
  }

  async reload_page() {
    await this.page.reload({waitUntil: 'domcontentloaded'})
  }
}
