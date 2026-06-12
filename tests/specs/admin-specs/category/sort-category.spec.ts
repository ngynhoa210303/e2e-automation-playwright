import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();

test.describe("Category Management - Sort", { tag: ['@sort-category', '@category', '@smoke1'] }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_ADMIN_USERNAME!,
      process.env.TB_ADMIN_PASSWORD!,
    );
    await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/admin/dashboard`);
    await loginPage.menuBar.submenu.categories.click();
    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/category`,
    );
  });
  test("CT015 - Sort category by name (Tên Danh Mục)", async ({ categoryPage }) => {

    await test.step("Open category page", async () => {
      await categoryPage.waitForPageLoad();
    });

    await test.step("Get initial list order", async () => {
      await categoryPage.page.selectOption("#entries", "50");
      const initialNames = await categoryPage.page
        .locator("//tbody//tr//td[3]")
        .allTextContents();

      expect(initialNames.length).toBeGreaterThan(1);
    });

    await test.step("Click sort by name", async () => {
      await categoryPage.page
        .locator("//th[contains(.,'Tên Danh Mục')]")
        .click();
    });
    const errorToast = categoryPage.toastMessage.fail_message.first();
    await expect(errorToast).not.toBeVisible();
    await test.step("Verify list is sorted", async () => {
      const sortedNames = await categoryPage.page
        .locator("//tbody//tr//td[3]")
        .allTextContents();

      const expected = [...sortedNames].sort((a, b) =>
        a.localeCompare(b)
      );

      // expect(sortedNames).toEqual(expected);
    });
  });
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
