import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();

test.describe("Category Management - Search", { tag: ['@search-category', '@category', '@smoke1'] }, () => {
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
  test("CT013 - Search category successfully", async ({ categoryPage }) => {

    await test.step("Open category page", async () => {
      await categoryPage.waitForPageLoad();
    });

    await test.step("Search existing category", async () => {
      const keyword = "Áo len";

      await categoryPage.category_searchInput.fill(keyword);
      await categoryPage.category_searchInput.press("Enter");
    });

    await test.step("Verify search result is displayed", async () => {
      const row = categoryPage.getRowByName("Áo len").first();
      await expect(row).toBeVisible();
      await expect(row).toContainText("Áo len");
    });
  });
  test("CT014 - Search category not found", async ({ categoryPage }) => {

    await test.step("Open category page", async () => {
      await categoryPage.waitForPageLoad();
    });

    await test.step("Search non-existing category", async () => {
      const keyword = "Category_Not_Exist_12345";

      await categoryPage.category_searchInput.fill(keyword);
      await categoryPage.category_searchInput.press("Enter");
    });

    await test.step("Verify empty state is displayed", async () => {
      await expect(categoryPage.noResultsMessage).toBeVisible();
    });

    await test.step("Verify no table data is shown", async () => {
      await expect(categoryPage.noResultsMessage).toHaveCount(1);
    });
  });
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
