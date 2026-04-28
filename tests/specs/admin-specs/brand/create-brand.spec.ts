import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();
import { faker } from '@faker-js/faker';

test.describe("Brand Management - Create & Validation", { tag: "@brand" }, () => {
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

  test("TC020 - Create new brand if not exists", async ({ brandPage }) => {
    await brandPage.waitForPageLoad();
    const brand = faker.company.name();
    await brandPage.brand_searchInput.fill(brand);
    await brandPage.brand_searchInput.press('Enter');
    await brandPage.page.waitForLoadState('networkidle');
    const isEmpty = await brandPage.noResultsMessage.isVisible();

    if (isEmpty) {
      await brandPage.add_button.click();
      await brandPage.attributeModalComponent.createAttribute("Brand", brand);
      await expect(brandPage.toastMessage.success_message.first()).toBeVisible();
    } else {
      console.log(`Brand đã tồn tại: ${brand} → auto pass`);
    }
  });

  test("TC021 - Validate brand name is required (empty value)", async ({ brandPage }) => {
    await test.step("Submit empty brand name", async () => {
      await brandPage.waitForPageLoad();
      await brandPage.add_button.click();
      await brandPage.attributeModalComponent.createAttribute("Brand", "");
    });

    await test.step("Verify error message is displayed", async () => {
      await expect(brandPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC022 - Validate brand name exceeds max length (255 chars)", async ({ brandPage }) => {
    const name = faker.string.alphanumeric(255);
    await test.step("Enter brand name with 255 characters", async () => {
      await brandPage.waitForPageLoad();
      await brandPage.add_button.click();
      await brandPage.attributeModalComponent.createAttribute("Brand", name);
    });

    await test.step("Verify validation error is displayed", async () => {
      await expect(brandPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC023 - Validate brand name with only spaces", async ({ brandPage }) => {
    const name = "     ";
    await test.step("Enter brand name with only spaces", async () => {
      await brandPage.waitForPageLoad();
      await brandPage.add_button.click();
      await brandPage.attributeModalComponent.createAttribute("Brand", name);
    });

    await test.step("Verify validation error is displayed", async () => {
      await expect(brandPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC024 - Validate duplicate brand name", async ({ brandPage }) => {
    const name = "Nike";
    await test.step("Create brand with name 'Nike'", async () => {
      await brandPage.waitForPageLoad();
      await brandPage.add_button.click();
      await brandPage.attributeModalComponent.createAttribute("Brand", name);
      await brandPage.page.waitForLoadState("networkidle");
      await brandPage.attributeModalComponent.cancel_button.click();
    });
    await test.step("Attempt to create duplicate brand", async () => {
      await brandPage.add_button.click();
      await brandPage.attributeModalComponent.createAttribute("Brand", name);
    });
    await test.step("Verify duplicate error message", async () => {
      await expect(brandPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC025 - Cancel create brand modal", async ({ brandPage }) => {

    await test.step("Open brand page", async () => {
      await brandPage.waitForPageLoad();
    });

    await test.step("Open create brand modal", async () => {
      await brandPage.add_button.click();
    });

    await test.step("Cancel modal", async () => {
      await brandPage.attributeModalComponent.cancel_button.click();
    });

    await test.step("Verify modal is closed", async () => {
      await expect(brandPage.attributeModalComponent.cancel_button).not.toBeVisible();
    });
  });
  
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
