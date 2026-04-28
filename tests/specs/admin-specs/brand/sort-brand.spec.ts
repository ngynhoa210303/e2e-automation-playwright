import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();

test.describe("Brand Management - Sort", { tag: "@brand" }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_ADMIN_USERNAME!,
      process.env.TB_ADMIN_PASSWORD!,
    );
    await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/admin/dashboard`);
    await loginPage.menuBar.submenu.brands.click();
    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/brand`,
    );
  });
  test("TC034 - Sort brand by name (Tên Thương Hiệu)", async ({ brandPage }) => {

    await test.step("Open brand page", async () => {
      await brandPage.waitForPageLoad();
    });

    await test.step("Get initial list order", async () => {
      await brandPage.page.selectOption("#entries", "50");
      const initialNames = await brandPage.page
        .locator("//tbody//tr//td[3]")
        .allTextContents();

      expect(initialNames.length).toBeGreaterThan(1);
    });

    await test.step("Click sort by name", async () => {
      await brandPage.page
        .locator("//th[contains(.,'Tên Thương Hiệu')]")
        .click();
    });
    const errorToast = brandPage.toastMessage.fail_message.first();
    await expect(errorToast).not.toBeVisible();
    await test.step("Verify list is sorted", async () => {
      const sortedNames = await brandPage.page
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
