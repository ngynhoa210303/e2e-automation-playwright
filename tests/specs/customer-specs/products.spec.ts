import { test, expect } from "../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();
import filterData from '../../../util/data.json';
test.describe('Product Filter', {tag: '@regression'}, () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_USER_USERNAME!,
      process.env.TB_USER_PASSWORD!,
    );
    await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/home`);
    await loginPage.navBar.links.products.click();
    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/products`,
    );
    await loginPage.page.waitForTimeout(1000);
  });

  test("TC01 - Filter products by name", async ({ productCustomerPage }) => {
    await test.step("Open products page", async () => {
      await productCustomerPage.waitForPageLoad();
      const beforeCount = await productCustomerPage.products_card.count();
      expect(beforeCount).toBeGreaterThan(1);
      const typeSearch = filterData.filters.find(
        (f) => f.type === "product-name",
      );
      await productCustomerPage.searchProduct(typeSearch?.value || "");
      await productCustomerPage.page.waitForTimeout(500);
      await productCustomerPage.page
        .locator("p")
        .filter({ hasText: typeSearch?.value })
        .first()
        .click();
      await productCustomerPage.page.waitForTimeout(500);
      await productCustomerPage.page
        .locator("h1")
        .filter({ hasText: typeSearch?.value })
        .waitFor({
          state: "visible",
        });
    });
  });
  test("TC02 - Filter products by more options", async ({
    productCustomerPage,
  }) => {
    const getFilter = (type: string) => {
      const f = filterData.filters.find((f) => f.type === type);
      if (!f) throw new Error(`Missing filter: ${type}`);
      return f;
    };
    await test.step("Filter by category", async () => {
      const beforeCount = await productCustomerPage.products_card.count();

      const filter = getFilter("category");

      await productCustomerPage.selectCategory(filter.value);
      await productCustomerPage.waitForPageLoad();

      const afterCount = await productCustomerPage.products_card.count();

      expect(afterCount).toBeGreaterThan(0);
      expect(afterCount).toBeLessThanOrEqual(beforeCount);
    });
    await test.step("Filter by prices", async () => {
      await expect(productCustomerPage.minPrice).toBeVisible();
      const filter = getFilter("price");
      const [min, max] = filter.value.split("-");

      await productCustomerPage.filterByPrice(min, max);

      await expect(productCustomerPage.products_card.first()).toBeVisible();

      const priceTexts = await productCustomerPage.products_card
        .locator(".product-price")
        .allInnerTexts();

      for (const text of priceTexts) {
        const price = parseInt(text.replace(/\D/g, ""));

        expect(price).toBeGreaterThanOrEqual(Number(min));
        expect(price).toBeLessThanOrEqual(Number(max));
      }
    });

    await test.step("Filter by brand", async () => {
      const beforeCount = await productCustomerPage.products_card.count();

      const filter = getFilter("brand");

      await productCustomerPage.selectBrand(filter.value);
      await productCustomerPage.waitForPageLoad();

      const afterCount = await productCustomerPage.products_card.count();

      expect(afterCount).toBeGreaterThan(0);
      expect(afterCount).toBeLessThanOrEqual(beforeCount);
    });
    await test.step("Filter by color", async () => {
      const beforeCount = await productCustomerPage.products_card.count();

      const filter = getFilter("color");

      await productCustomerPage.selectColor(filter.value);
      await productCustomerPage.waitForPageLoad();

      const afterCount = await productCustomerPage.products_card.count();

      expect(afterCount).toBeGreaterThan(0);
      expect(afterCount).toBeLessThanOrEqual(beforeCount);
    });
    await test.step("Filter by size", async () => {
      const beforeCount = await productCustomerPage.products_card.count();

      const filter = getFilter("size");

      await productCustomerPage.selectSize(filter.value);
      await productCustomerPage.waitForPageLoad();

      const afterCount = await productCustomerPage.products_card.count();

      expect(afterCount).toBeGreaterThan(0);
      expect(afterCount).toBeLessThanOrEqual(beforeCount);
    });
    await test.step("Filter by collar style", async () => {
      const beforeCount = await productCustomerPage.products_card.count();

      const filter = getFilter("collar style");

      await productCustomerPage.selectCollar(filter.value);
      await productCustomerPage.waitForPageLoad();

      const afterCount = await productCustomerPage.products_card.count();

      expect(afterCount).toBeGreaterThan(0);
      expect(afterCount).toBeLessThanOrEqual(beforeCount);
    });
    await test.step("Filter by sleeve", async () => {
      const beforeCount = await productCustomerPage.products_card.count();

      const filter = getFilter("sleeve");

      await productCustomerPage.selectSleeve(filter.value);
      await productCustomerPage.waitForPageLoad();

      const afterCount = await productCustomerPage.products_card.count();

      expect(afterCount).toBeGreaterThan(0);
      expect(afterCount).toBeLessThanOrEqual(beforeCount);
    });
  });
  test("TC03 - Reset all filters", async ({ productCustomerPage }) => {
    const getFilter = (type: string) => {
      const f = filterData.filters.find((f) => f.type === type);
      if (!f) throw new Error(`Missing filter: ${type}`);
      return f;
    };

     await test.step("Apply filters", async () => {
      const category = getFilter("category");
      const price = getFilter("price");

      const [min, max] = price.value.split("-");

      await productCustomerPage.selectCategory(category.value);
      await productCustomerPage.filterByPrice(min, max);

      await productCustomerPage.waitForPageLoad();
    });

    let filteredCount = 0;

    await test.step("Get filtered count", async () => {
      filteredCount = await productCustomerPage.products_card.count();
      expect(filteredCount).toBeGreaterThan(0);
    });

    await test.step("Click reset", async () => {
      await productCustomerPage.clickResetButton();
    });

    await expect(productCustomerPage.products_card.first()).toBeVisible();

    await test.step("Verify UI reset", async () => {
      await expect(productCustomerPage.minPrice).toHaveValue("");
      await expect(productCustomerPage.maxPrice).toHaveValue("");

      await expect(productCustomerPage.select_category).toHaveValue("");
    });

    await test.step("Verify product list reset", async () => {
      const resetCount = await productCustomerPage.products_card.count();

      expect(resetCount).toBeGreaterThanOrEqual(filteredCount);
    });
  });
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
