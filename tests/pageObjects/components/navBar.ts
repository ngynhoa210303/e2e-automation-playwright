import { BasePageComponent } from '../base.pageComponent';

export default class NavBar extends BasePageComponent {
  readonly links = {
    home: this.page.locator("(//span[text()='Home'])[1]"),
    upcoming_event: this.page.locator("(//span[text()='Upcoming Events'])[1]"),
    on_demand: this.page.locator("(//span[text()='On-Demand'])[1]"),
    aurora_live_members: this.page.locator("(//span[text()='Aurora Live Members'])[1]"),
    contact_us: this.page.locator("(//span[text()='Contact us'])[1]"),
  };

  readonly userAvatar = this.page.locator("(//div[contains(@class, 'MuiAvatar-root')])[1]");

  readonly userAvatar_dropdown = {
    profile: this.page.locator("(//li[text()='Profile'])[2]"),
    password: this.page.locator("(//li[text()='Password'])[2]"),
    your_favs: this.page.locator("(//li[text()='Your favourites'])[2]"),
    send_feedback: this.page.locator("(//li[text()='Send feedback'])[2]"),
    exclusive_invitations: this.page.locator("(//li[text()='Exclusive Invitations'])[2]"),
    logout: this.page.locator("(//li[text()='Logout'])[2]"),
  };

  readonly searchInput = this.page.locator('Search for products...');
}
