import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();

test.describe("sleeve Management - Search", { tag: "@sleeve" }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_ADMIN_USERNAME!,
      process.env.TB_ADMIN_PASSWORD!,
    );
    await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/admin/dashboard`);
    await loginPage.menuBar.submenu.sleeves.click();
    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/attribute/sleeve`,
    );
  });

  test("TC1 - Search sleeve successfully", async ({ sleevePage }) => {
    await test.step("Open sleeve page", async () => {
      await sleevePage.waitForPageLoad();
    });

    await test.step("Search existing sleeve", async () => {
      const keyword = "Tay thể thao";

      await sleevePage.sleeve_searchInput.fill(keyword);
      await sleevePage.sleeve_searchInput.press("Enter");
    });

    await test.step("Verify search result is displayed", async () => {
      const row = sleevePage.getRowByName("Tay thể thao").first();
      await expect(row).toBeVisible();
      await expect(row).toContainText("Tay thể thao");
    });
  });

  test("TC2 - Search sleeve not found", async ({ sleevePage }) => {
    await test.step("Open sleeve page", async () => {
      await sleevePage.waitForPageLoad();
    });

    await test.step("Search non-existing sleeve", async () => {
      const keyword = "sleeve_Not_Exist_12345";

      await sleevePage.sleeve_searchInput.fill(keyword);
      await sleevePage.sleeve_searchInput.press("Enter");
    });

    await test.step("Verify empty state is displayed", async () => {
      await expect(sleevePage.noResultsMessage).toBeVisible();
    });

    await test.step("Verify no table data is shown", async () => {
      await expect(sleevePage.noResultsMessage).toHaveCount(1);
    });
  });
  
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
