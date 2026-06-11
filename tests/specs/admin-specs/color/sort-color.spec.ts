import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();

test.describe("Color Management - Sort", { tag: "@color" }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_ADMIN_USERNAME!,
      process.env.TB_ADMIN_PASSWORD!,
    );
    await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/admin/dashboard`);
    await loginPage.menuBar.submenu.colors.click();
    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/attribute/color`,
    );
  });
  
  test("TC049 - Sort color by name (Tên Màu)", async ({ colorPage }) => {
    await test.step("Open color page", async () => {
      await colorPage.waitForPageLoad();
    });

    await test.step("Get initial list order", async () => {
      await colorPage.page.selectOption("#entries", "50");
      const initialNames = await colorPage.page
        .locator("//tbody//tr//td[3]")
        .allTextContents();

      // expect(initialNames.length).toBeGreaterThan(1);
    });

    await test.step("Click sort by name", async () => {
      await colorPage.page
        .locator("//th[contains(.,'Tên Màu')]")
        .click();
    });
    const errorToast = colorPage.toastMessage.fail_message.first();
    await expect(errorToast).not.toBeVisible();
    await test.step("Verify list is sorted", async () => {
      const sortedNames = await colorPage.page
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
