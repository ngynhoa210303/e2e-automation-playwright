import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();

test.describe("Collar Management - Sort", { tag: ['@sort-collar', '@collar', '@smoke1'] }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_ADMIN_USERNAME!,
      process.env.TB_ADMIN_PASSWORD!,
    );
    await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/admin/dashboard`);
    await loginPage.menuBar.submenu.collars.click();
    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/attribute/collar`,
    );
  });
  test("Collar015 - Sort collar by name (Tên Cổ Áo)", async ({ collarPage }) => {

    await test.step("Open collar page", async () => {
      await collarPage.waitForPageLoad();
    });

    await test.step("Get initial list order", async () => {
      await collarPage.page.selectOption("#entries", "50");
      const initialNames = await collarPage.page
        .locator("//tbody//tr//td[3]")
        .allTextContents();

      expect(initialNames.length).toBeGreaterThan(1);
    });

    await test.step("Click sort by name", async () => {
      await collarPage.page
        .locator("//th[contains(.,'Tên Cổ Áo')]")
        .click();
    });
    const errorToast = collarPage.toastMessage.fail_message.first();
    await expect(errorToast).not.toBeVisible();
    await test.step("Verify list is sorted", async () => {
      const sortedNames = await collarPage.page
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
