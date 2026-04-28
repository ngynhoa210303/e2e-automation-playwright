import { BasePage } from "../../base.page";

export default class PersonalPage extends BasePage {
    readonly information_username = this.page.locator("//label[text()='Tên đăng nhập']/following-sibling::p")
    readonly information_fullname_input = this.page.locator("input[name='fullname']")
    readonly information_fullname = this.page.locator("//label[text()='Họ và tên']/following-sibling::p")
    readonly information_email = this.page.locator("//label[text()='Email']/following-sibling::p")
    readonly information_email_input = this.page.locator("input[name='email']")
    readonly information_phone = this.page.locator("//label[text()='Số điện thoại']/following-sibling::p")
    readonly information_phone_input = this.page.locator("input[name='phone']")
    readonly btn_changePassword = this.page.locator("//button[contains(text(),'Chỉnh sửa thông tin')]")
    readonly btn_save = this.page.locator("//button[contains(text(),'Lưu thay đổi')]")
    readonly txt_currentPassword = this.page.locator("input[name='oldPassword']")
    readonly txt_newPassword = this.page.locator("input[name='newPassword']")
    readonly txt_confirmPassword = this.page.locator("input[name='confirmNewPassword']")
    readonly btn_cancel = this.page.locator("//button[contains(text(),'Hủy')]")
    readonly confirm_cancel_btn = this.page.locator("//button[contains(text(),'Hủy')]")
    readonly confirm_btn = this.page.locator("//button[contains(text(),'Xác nhận')]")

    async clickEditInformation() {
        await this.btn_changePassword.click();
    }

    async updateProfile(fullname: string, email: string, phone: string) {
        await this.information_fullname_input.fill(fullname);
        await this.information_email_input.fill(email);
        await this.information_phone_input.fill(phone);
        await this.btn_save.click();
    }
    async change_password(old_password: string, new_password: string, confirm_password: string) {
        await this.txt_currentPassword.fill(old_password)
        await this.txt_newPassword.fill(new_password)
        await this.txt_confirmPassword.fill(confirm_password)
    }
}