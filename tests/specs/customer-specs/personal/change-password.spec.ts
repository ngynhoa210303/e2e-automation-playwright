// import { test, expect } from '../../../pageObjects/pageFixture';
// import dotenv from 'dotenv';
// dotenv.config();
// const username = "hoanghoa";
// const passwordTest = "123456";
// test.describe('Personal - Change Password', { tag: '@changepassword' }, () => {
//   test.beforeEach(async ({ loginPage }) => {
//     await loginPage.open();
//     await loginPage.login(
//       username,
//       passwordTest,
//     );
//     await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/home`);
//     await loginPage.navBar.userAvatar.click();
//     await loginPage.navBar.userAvatar_dropdown.information.click();
//   });

//   test("TC056 - Change password successfully", async ({ personalPage }) => {
//     const oldPass = passwordTest;
//     const newPass = "NewPassword123!";

//     await test.step("Open change password form", async () => {
//       await personalPage.clickEditInformation();
//     });

//     await test.step("Enter valid password info", async () => {
//       await personalPage.change_password(oldPass, newPass, newPass);
//       await personalPage.btn_save.click();
//     });
//     await test.step("Confirm change password action", async () => {
//       await expect(personalPage.page.locator("//h3[text()='Xác nhận đổi mật khẩu']/following-sibling::p")).toBeVisible();
//       await personalPage.confirm_btn.click();
//     });
//     await test.step("Verify password change success", async () => {
//       await expect(personalPage.toastMessage.success_message.first()).toBeVisible();
//     });
//     await test.step("Revert password back to original", async () => {
//       await personalPage.clickEditInformation();
//       await personalPage.change_password(newPass, oldPass, oldPass);
//       await personalPage.btn_save.click();
//       await personalPage.confirm_btn.click();
//       await expect(personalPage.toastMessage.success_message.first()).toBeVisible();
//     });
//   });

//   test("TC057 - Wrong current password", async ({ personalPage }) => {
//     const wrongOldPass = "WrongPass123!";
//     const newPass = "New123!";
//     const originalPass = "123456";

//     await test.step("Open change password form", async () => {
//       await personalPage.clickEditInformation();
//     });

//     await test.step("Enter wrong current password and submit", async () => {
//       await personalPage.change_password(wrongOldPass, newPass, newPass);
//       await personalPage.btn_save.click();
//       await personalPage.confirm_btn.click();
//     });

//     await test.step("Verify system does NOT allow password change", async () => {
//       const errorToast = personalPage.toastMessage.fail_message.first();
//       const successToast = personalPage.toastMessage.success_message.first();

//       const isErrorVisible = await errorToast.isVisible().catch(() => false);
//       const isSuccessVisible = await successToast.isVisible().catch(() => false);

//       if (isErrorVisible) {
//         await expect(errorToast).toContainText("Mật khẩu hiện tại không đúng");
//       } else if (isSuccessVisible) {
//         await test.step("Revert password back to original (cleanup)", async () => {
//           await expect(successToast).toBeHidden()
//           await personalPage.clickEditInformation();
//           await personalPage.change_password(newPass, originalPass, originalPass);
//           await personalPage.btn_save.click();
//           await personalPage.confirm_btn.click();
//           await expect(personalPage.toastMessage.success_message.first()).toBeVisible();
//         });

//         throw new Error("BUG: System allowed password change with wrong current password!");
//       } else {
//         throw new Error("No toast message displayed");
//       }
//     });
//   });

//   test("TC058 - Validate confirm password mismatch", async ({ personalPage }) => {
//     await test.step("Open change password form", async () => {
//       await personalPage.clickEditInformation();
//     });

//     await test.step("Enter mismatched confirm password", async () => {
//       await personalPage.change_password(
//         passwordTest,
//         "New123!",
//         "Different123!"
//       );
//       await personalPage.btn_save.click();
//     });

//     await test.step("Verify error message displayed", async () => {
//       await expect(personalPage.toastMessage.fail_message.first())
//         .toContainText("Mật khẩu mới và xác nhận mật khẩu không khớp!");
//     });
//   });

//   test("TC059 - Validate password format (too short)", async ({ personalPage }) => {
//     await test.step("Open change password form", async () => {
//       await personalPage.clickEditInformation();
//     });

//     await test.step("Enter invalid password format", async () => {
//       await personalPage.change_password(
//         passwordTest,
//         "a",
//         "a"
//       );
//       await personalPage.btn_save.click();
//     });

//     await test.step("Verify validation message displayed", async () => {
//       await expect(personalPage.toastMessage.fail_message.first())
//         .toContainText("Mật khẩu mới phải có ít nhất 6 ký tự!");
//     });
//   });

//   test("TC060 - Cancel change password form", async ({ personalPage }) => {
//     await test.step("Open change password form", async () => {
//       await personalPage.clickEditInformation();
//     });

//     await test.step("Enter password information", async () => {
//       await personalPage.change_password(
//         passwordTest,
//         "NewPassword123!",
//         "NewPassword123!"
//       );
//     });

//     await test.step("Click cancel button", async () => {
//       await personalPage.btn_cancel.click();
//     });

//     await test.step("Verify form is closed", async () => {
//       await expect(personalPage.txt_currentPassword).not.toBeVisible();
//     });

//     await test.step("Verify no success message displayed", async () => {
//       await expect(
//         personalPage.toastMessage.success_message.first()
//       ).not.toBeVisible();
//     });
//   });

//   test("TC061 - Cancel does not change password", async ({ personalPage, homePage, loginPage }) => {
//     await test.step("Open change password form", async () => {
//       await personalPage.clickEditInformation();
//     });

//     await test.step("Enter new password then cancel", async () => {
//       await personalPage.change_password(
//         passwordTest,
//         "NewPassword123!",
//         "NewPassword123!"
//       );

//       await personalPage.btn_cancel.click();
//     });

//     await test.step("Logout system", async () => {
//       await homePage.logout();
//     });

//     await test.step("Login with new password should fail", async () => {
//       await loginPage.login(
//         username,
//         "NewPassword123!"
//       );
//       await expect(loginPage.error_incorrectLogin).toBeVisible();
//     });
//   });

//   test.afterEach(async ({ homePage }) => {
//     await homePage.close();
//   });
// // });