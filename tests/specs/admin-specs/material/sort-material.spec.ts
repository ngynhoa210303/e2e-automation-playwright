import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();

test.describe("Material Management - Sort", { tag: "@material" }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_ADMIN_USERNAME!,
      process.env.TB_ADMIN_PASSWORD!,
    );
    await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/admin/dashboard`);
    await loginPage.menuBar.submenu.materials.click();
    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/material`,
    );
  });
  
  test("TC049 - Sort material by name (Tên Chất Liệu)", async ({ materialPage }) => {
    await test.step("Open material page", async () => {
      await materialPage.waitForPageLoad();
    });

    await test.step("Get initial list order", async () => {
      await materialPage.page.selectOption("#entries", "50");
      const initialNames = await materialPage.page
        .locator("//tbody//tr//td[3]")
        .allTextContents();

      expect(initialNames.length).toBeGreaterThan(1);
    });

    await test.step("Click sort by name", async () => {
      await materialPage.page
        .locator("//th[contains(.,'Tên Chất Liệu')]")
        .click();
    });
    const errorToast = materialPage.toastMessage.fail_message.first();
    await expect(errorToast).not.toBeVisible();
    await test.step("Verify list is sorted", async () => {
      const sortedNames = await materialPage.page
        .locator("//tbody//tr//td[3]")
        .allTextContents();

      const expected = [...sortedNames].sort((a, b) =>
        a.localeCompare(b)
      );

      expect(sortedNames).toEqual(expected);
    });
  });
  
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
