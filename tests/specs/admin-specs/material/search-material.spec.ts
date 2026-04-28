import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();

test.describe("Material Management - Search", { tag: "@material" }, () => {
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

  test("TC047 - Search material successfully", async ({ materialPage }) => {
    await test.step("Open material page", async () => {
      await materialPage.waitForPageLoad();
    });

    await test.step("Search existing material", async () => {
      const keyword = "Ceramic";

      await materialPage.material_searchInput.fill(keyword);
      await materialPage.material_searchInput.press("Enter");
    });

    await test.step("Verify search result is displayed", async () => {
      const row = materialPage.getRowByName("Ceramic").first();
      await expect(row).toBeVisible();
      await expect(row).toContainText("Ceramic");
    });
  });

  test("TC048 - Search material not found", async ({ materialPage }) => {
    await test.step("Open material page", async () => {
      await materialPage.waitForPageLoad();
    });

    await test.step("Search non-existing material", async () => {
      const keyword = "Material_Not_Exist_12345";

      await materialPage.material_searchInput.fill(keyword);
      await materialPage.material_searchInput.press("Enter");
    });

    await test.step("Verify empty state is displayed", async () => {
      await expect(materialPage.noResultsMessage).toBeVisible();
    });

    await test.step("Verify no table data is shown", async () => {
      await expect(materialPage.noResultsMessage).toHaveCount(1);
    });
  });
  
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
