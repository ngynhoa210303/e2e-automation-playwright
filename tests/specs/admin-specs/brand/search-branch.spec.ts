import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();

test.describe("Brand Management - Search", { tag: "@brand" }, () => {
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
  test("TC032 - Search brand successfully", async ({ brandPage }) => {

    await test.step("Open brand page", async () => {
      await brandPage.waitForPageLoad();
    });

    await test.step("Search existing brand", async () => {
      const keyword = "Bruen Inc";

      await brandPage.brand_searchInput.fill(keyword);
      await brandPage.brand_searchInput.press("Enter");
    });

    await test.step("Verify search result is displayed", async () => {
      const row = brandPage.getRowByName("Bruen Inc").first();
      await expect(row).toBeVisible();
      await expect(row).toContainText("Bruen Inc");
    });
  });
  test("TC033 - Search brand not found", async ({ brandPage }) => {

    await test.step("Open brand page", async () => {
      await brandPage.waitForPageLoad();
    });

    await test.step("Search non-existing brand", async () => {
      const keyword = "Brand_Not_Exist_12345";

      await brandPage.brand_searchInput.fill(keyword);
      await brandPage.brand_searchInput.press("Enter");
    });

    await test.step("Verify empty state is displayed", async () => {
      await expect(brandPage.noResultsMessage).toBeVisible();
    });

    await test.step("Verify no table data is shown", async () => {
      await expect(brandPage.noResultsMessage).toHaveCount(1);
    });
  });
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
