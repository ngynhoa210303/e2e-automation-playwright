import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();

test.describe("Color Management - Search", { tag: "@color" }, () => {
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

  test("TC1 - Search color successfully", async ({ colorPage }) => {
    await test.step("Open color page", async () => {
      await colorPage.waitForPageLoad();
    });

    await test.step("Search existing color", async () => {
      const keyword = "Will - Keeling";

      await colorPage.color_searchInput.fill(keyword);
      await colorPage.color_searchInput.press("Enter");
    });

    await test.step("Verify search result is displayed", async () => {
      const row = colorPage.getRowByName("Will - Keeling").first();
      await expect(row).toBeVisible();
      await expect(row).toContainText("Will - Keeling");
    });
  });

  test("TC2 - Search color not found", async ({ colorPage }) => {
    await test.step("Open color page", async () => {
      await colorPage.waitForPageLoad();
    });

    await test.step("Search non-existing color", async () => {
      const keyword = "color_Not_Exist_12345";

      await colorPage.color_searchInput.fill(keyword);
      await colorPage.color_searchInput.press("Enter");
    });

    await test.step("Verify empty state is displayed", async () => {
      await expect(colorPage.noResultsMessage).toBeVisible();
    });

    await test.step("Verify no table data is shown", async () => {
      await expect(colorPage.noResultsMessage).toHaveCount(1);
    });
  });
  
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
