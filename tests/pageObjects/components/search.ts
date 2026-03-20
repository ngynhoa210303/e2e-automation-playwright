import { Locator } from "@playwright/test";
import { BasePageComponent } from "../base.pageComponent";

export default class Search extends BasePageComponent {
    readonly txt_search = this.page.locator('//input[@placeholder="Search..."]')

    async search_item(item_name: string) {
        await this.txt_search.fill(item_name)
    }
}