import { BasePageComponent } from "../base.pageComponent";

export default class ChangePassword extends BasePageComponent {
    readonly txt_currentPassword = this.page.locator("input[name='currentPassword']")
    readonly txt_newPassword = this.page.locator("input[name='newPassword']")
    readonly txt_confirmPassword = this.page.locator("input[name='confirmPassword']")
    readonly btn_done = this.page.locator("button[type='submit']")
    readonly btn_cancel = this.page.locator("//button[text()='Cancel']")
    readonly noti_passwordChangeSuccees = this.page.locator("//div[text()='Your password has been changed successfully.']")
    readonly noti_btn_close = this.page.locator("//button[text()='Close']")

    async change_password(old_password: string, new_password: string) {
        await this.txt_currentPassword.fill(old_password)
        await this.txt_newPassword.fill(new_password)
        await this.txt_confirmPassword.fill(new_password)
        await this.btn_done.click()
    }
}