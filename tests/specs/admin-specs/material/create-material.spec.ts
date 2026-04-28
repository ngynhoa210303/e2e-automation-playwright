import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();
import { faker } from '@faker-js/faker';

test.describe("Material Management - Create & Validation", { tag: "@material" }, () => {
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
  test("TC035 - Create new material if not exists", async ({ materialPage }) => {
    await materialPage.waitForPageLoad();
    const material = faker.commerce.productMaterial();
    await materialPage.material_searchInput.fill(material);
    await materialPage.material_searchInput.press('Enter');
    await materialPage.page.waitForLoadState('networkidle');
    const isEmpty = await materialPage.noResultsMessage.isVisible();

    if (isEmpty) {
      await materialPage.add_button.click();
      await materialPage.attributeModalComponent.createAttribute("Material", material);
      await expect(materialPage.toastMessage.success_message.first()).toBeVisible();
    } else {
      console.log(`Material đã tồn tại: ${material} → auto pass`);
    }
  });
  test("TC036 - Validate material name is required (empty value)", async ({ materialPage }) => {
    await test.step("Submit empty material name", async () => {
      await materialPage.waitForPageLoad();
      await materialPage.add_button.click();
      await materialPage.attributeModalComponent.createAttribute("Material", "");
    });

    await test.step("Verify error message is displayed", async () => {
      await expect(materialPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });
  test("TC037 - Validate material name exceeds max length (255 chars)", async ({ materialPage }) => {
    const name = faker.string.alphanumeric(255);
    await test.step("Enter material name with 255 characters", async () => {
      await materialPage.waitForPageLoad();
      await materialPage.add_button.click();
      await materialPage.attributeModalComponent.createAttribute("Material", name);
    });

    await test.step("Verify validation error is displayed", async () => {
      await expect(materialPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });
  test("TC038 - Validate material name with only spaces", async ({ materialPage }) => {
    const name = "     ";
    await test.step("Enter material name with only spaces", async () => {
      await materialPage.waitForPageLoad();
      await materialPage.add_button.click();
      await materialPage.attributeModalComponent.createAttribute("Material", name);
    });

    await test.step("Verify validation error is displayed", async () => {
      await expect(materialPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });
  test("TC039 - Validate duplicate material name", async ({ materialPage }) => {
    const name = "Cotton";
    await test.step("Create material with name 'Cotton'", async () => {
      await materialPage.waitForPageLoad();
      await materialPage.add_button.click();
      await materialPage.attributeModalComponent.createAttribute("Material", name);
      await materialPage.page.waitForLoadState("networkidle");
      await materialPage.attributeModalComponent.cancel_button.click();
    });
    await test.step("Attempt to create duplicate material", async () => {
      await materialPage.add_button.click();
      await materialPage.attributeModalComponent.createAttribute("Material", name);
    });
    await test.step("Verify duplicate error message", async () => {
      await expect(materialPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });
  test("TC040 - Cancel create material modal", async ({ materialPage }) => {

    await test.step("Open material page", async () => {
      await materialPage.waitForPageLoad();
    });

    await test.step("Open create material modal", async () => {
      await materialPage.add_button.click();
    });

    await test.step("Cancel modal", async () => {
      await materialPage.attributeModalComponent.cancel_button.click();
    });

    await test.step("Verify modal is closed", async () => {
      await expect(materialPage.attributeModalComponent.cancel_button).not.toBeVisible();
    });
  });
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
