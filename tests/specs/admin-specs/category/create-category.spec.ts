import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();
import { faker } from '@faker-js/faker';

test.describe("Category Management - Create & Validation", { tag: ['@create-category', '@category', '@smoke1'] }, () => {
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

  test("CT01 - Create new category if not exists", async ({ categoryPage }) => {
    await categoryPage.waitForPageLoad();
    const category = "Áo polo";
    await categoryPage.category_searchInput.fill(category);
    await categoryPage.category_searchInput.press('Enter');
    await categoryPage.page.waitForLoadState('networkidle');
    const isEmpty = await categoryPage.noResultsMessage.isVisible();

    if (isEmpty) {
      await categoryPage.add_button.click();
      await categoryPage.attributeModalComponent.createAttribute("Danh Mục", category);
      await expect(categoryPage.toastMessage.success_message.first()).toBeVisible();
    } else {
      console.log(`Category already exists: ${category} → auto pass`);
    }
  });

  test("CT02 - Validate category name is required (empty value)", async ({ categoryPage }) => {
    await test.step("Submit empty category name", async () => {
      await categoryPage.waitForPageLoad();
      await categoryPage.add_button.click();
      await categoryPage.attributeModalComponent.createAttribute("Danh Mục", "");
    });

    await test.step("Verify error message is displayed", async () => {
      await expect(categoryPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("CT03 - Validate category name exceeds max length (255 chars)", async ({ categoryPage }) => {
    const name = faker.string.alphanumeric(255);
    await test.step("Enter category name with 255 characters", async () => {
      await categoryPage.waitForPageLoad();
      await categoryPage.add_button.click();
      await categoryPage.attributeModalComponent.createAttribute("Danh Mục", name);
    });

    await test.step("Verify validation error is displayed", async () => {
      await expect(categoryPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("CT04 - Validate category name with only spaces", async ({ categoryPage }) => {
    const name = "     ";
    await test.step("Enter category name with only spaces", async () => {
      await categoryPage.waitForPageLoad();
      await categoryPage.add_button.click();
      await categoryPage.attributeModalComponent.createAttribute("Danh Mục", name);
    });

    await test.step("Verify validation error is displayed", async () => {
      await expect(categoryPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("CT05 - Validate duplicate category name", async ({ categoryPage }) => {
    const name = "Áo Henley";
    await test.step("Create category with name 'Áo Henley'", async () => {
      await categoryPage.waitForPageLoad();
      await categoryPage.add_button.click();
      await categoryPage.attributeModalComponent.createAttribute("Danh Mục", name);
      await categoryPage.page.waitForLoadState("networkidle");
      await categoryPage.attributeModalComponent.cancel_button.click();
    });
    await test.step("Attempt to create duplicate category", async () => {
      await categoryPage.add_button.click();
      await categoryPage.attributeModalComponent.createAttribute("Danh Mục", name);
    });
    await test.step("Verify duplicate error message", async () => {
      await expect(categoryPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("CT06 - Cancel create category modal", async ({ categoryPage }) => {

    await test.step("Open category page", async () => {
      await categoryPage.waitForPageLoad();
    });

    await test.step("Open create category modal", async () => {
      await categoryPage.add_button.click();
    });

    await test.step("Cancel modal", async () => {
      await categoryPage.attributeModalComponent.cancel_button.click();
    });

    await test.step("Verify modal is closed", async () => {
      await expect(categoryPage.attributeModalComponent.cancel_button).not.toBeVisible();
    });
  });
  
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
