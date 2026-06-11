import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();

test.describe("size Management - Sort", { tag: "@size" }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_ADMIN_USERNAME!,
      process.env.TB_ADMIN_PASSWORD!,
    );
    await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/admin/dashboard`);
    await loginPage.menuBar.submenu.sizes.click();
    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/attribute/size`,
    );
  });
  
  test("TC1 - Sort size by name (Tên Size)", async ({ sizePage }) => {
    await test.step("Open size page", async () => {
      await sizePage.waitForPageLoad();
    });

    await test.step("Get initial list order", async () => {
      await sizePage.page.selectOption("#entries", "50");
      const initialNames = await sizePage.page
        .locator("//tbody//tr//td[3]")
        .allTextContents();

      expect(initialNames.length).toBeGreaterThan(1);
    });

    await test.step("Click sort by name", async () => {
      await sizePage.page
        .locator("//th[contains(.,'Tên Size')]")
        .click();
    });
    const errorToast = sizePage.toastMessage.fail_message.first();
    await expect(errorToast).not.toBeVisible();
    await test.step("Verify list is sorted", async () => {
      const sortedNames = await sizePage.page
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
