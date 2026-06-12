import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();

test.describe("Size Management - Search", { tag: "@size" }, () => {
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

  test("TC1 - Search size successfully", async ({ sizePage }) => {
    await test.step("Open size page", async () => {
      await sizePage.waitForPageLoad();
    });

    await test.step("Search existing size", async () => {
      const keyword = "XXXS";

      await sizePage.size_searchInput.fill(keyword);
      await sizePage.size_searchInput.press("Enter");
    });

    await test.step("Verify search result is displayed", async () => {
      const row = sizePage.getRowByName("XXXS").first();
      await expect(row).toBeVisible();
      await expect(row).toContainText("XXXS");
    });
  });

  test("TC2 - Search size not found", async ({ sizePage }) => {
    await test.step("Open size page", async () => {
      await sizePage.waitForPageLoad();
    });

    await test.step("Search non-existing size", async () => {
      const keyword = "size_Not_Exist_12345";

      await sizePage.size_searchInput.fill(keyword);
      await sizePage.size_searchInput.press("Enter");
    });

    await test.step("Verify empty state is displayed", async () => {
      await expect(sizePage.noResultsMessage).toBeVisible();
    });

    await test.step("Verify no table data is shown", async () => {
      await expect(sizePage.noResultsMessage).toHaveCount(1);
    });
  });
  
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
