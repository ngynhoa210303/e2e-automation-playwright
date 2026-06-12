import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();

test.describe("Collar Management - Search", { tag: ['@search-collar', '@collar', '@smoke1'] }, () => {
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
  test("Collar013 - Search collar successfully", async ({ collarPage }) => {

    await test.step("Open collar page", async () => {
      await collarPage.waitForPageLoad();
    });

    await test.step("Search existing collar", async () => {
      const keyword = "Cổ tim";

      await collarPage.collar_searchInput.fill(keyword);
      await collarPage.collar_searchInput.press("Enter");
    });

    await test.step("Verify search result is displayed", async () => {
      const row = collarPage.getRowByName("Cổ tim").first();
      await expect(row).toBeVisible();
      await expect(row).toContainText("Cổ tim");
    });
  });
  test("Collar014 - Search collar not found", async ({ collarPage }) => {

    await test.step("Open collar page", async () => {
      await collarPage.waitForPageLoad();
    });

    await test.step("Search non-existing collar", async () => {
      const keyword = "Collar_Not_Exist_12345";

      await collarPage.collar_searchInput.fill(keyword);
      await collarPage.collar_searchInput.press("Enter");
    });

    await test.step("Verify empty state is displayed", async () => {
      await expect(collarPage.noResultsMessage).toBeVisible();
    });

    await test.step("Verify no table data is shown", async () => {
      await expect(collarPage.noResultsMessage).toHaveCount(1);
    });
  });
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
