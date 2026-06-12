import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();
import { faker } from "@faker-js/faker";

test.describe("Material Management - Update", { tag: "@update-material" }, () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_ADMIN_USERNAME!,
      process.env.TB_ADMIN_PASSWORD!,
    );

    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/dashboard`
    );

    await loginPage.menuBar.submenu.materials.click();

    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/material`
    );
  });

  async function createMaterialIfNotExists(materialPage: any, name: string) {
    await materialPage.material_searchInput.fill(name);
    await materialPage.material_searchInput.press("Enter");
    await materialPage.page.waitForLoadState("networkidle");
    const isEmpty = await materialPage.noResultsMessage.isVisible();
    if (isEmpty) {
      await materialPage.add_button.click();
      await materialPage.attributeModalComponent.createAttribute("Material", name);
      await expect(materialPage.toastMessage.success_message.first()).toBeVisible();
      await expect(materialPage.toastMessage.success_message).toBeHidden();
    }
  }

  test("TC041 - Update material name successfully", async ({ materialPage }) => {
    const oldName = faker.commerce.productMaterial();
    const newName = `Mat_${faker.string.alphanumeric(5)}`;

    await test.step("Prepare material data", async () => {
      await materialPage.waitForPageLoad();
      await createMaterialIfNotExists(materialPage, oldName);
    });

    await test.step("Search and open edit modal", async () => {
      await materialPage.material_searchInput.fill(oldName);
      await materialPage.material_searchInput.press("Enter");
      await materialPage.page.waitForLoadState("networkidle");
      await materialPage.getEditButtonByName(oldName).click();
    });

    await test.step("Update material name", async () => {
      await materialPage.attributeModalComponent.updateAttribute("Material", newName);
    });

    await test.step("Verify update success", async () => {
      await expect(materialPage.toastMessage.success_message.first()).toBeVisible();
      await expect(materialPage.toastMessage.success_message).toBeHidden();
      await materialPage.material_searchInput.fill(newName);
      await materialPage.material_searchInput.press("Enter");
      await materialPage.page.waitForLoadState("networkidle");
      await expect(materialPage.getRowByName(newName)).toBeVisible();
    });
    await test.step("Revert Update", async () => {
      await materialPage.material_searchInput.fill(newName);
      await materialPage.material_searchInput.press("Enter");
      await materialPage.page.waitForLoadState("networkidle");
      await materialPage.getEditButtonByName(newName).click();
      await materialPage.attributeModalComponent.updateAttribute("Material", oldName);
    });
  });

  test("TC042 - Validate update with empty name", async ({ materialPage }) => {
    const name = faker.commerce.productMaterial();

    await test.step("Prepare material", async () => {
      await materialPage.waitForPageLoad();
      await createMaterialIfNotExists(materialPage, name);
    });

    await test.step("Open edit modal", async () => {
      await materialPage.material_searchInput.fill(name);
      await materialPage.material_searchInput.press("Enter");
      await materialPage.getEditButtonByName(name).click();
    });

    await test.step("Submit empty name", async () => {
      await materialPage.attributeModalComponent.updateAttribute("Material", "");
    });

    await test.step("Verify error message", async () => {
      await expect(materialPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC043 - Validate update with duplicate name", async ({ materialPage }) => {
    const name1 = faker.commerce.productMaterial();
    const name2 = faker.commerce.productMaterial();

    await test.step("Prepare 2 materials", async () => {
      await materialPage.waitForPageLoad();
      await createMaterialIfNotExists(materialPage, name1);
      await createMaterialIfNotExists(materialPage, name2);
    });

    await test.step("Edit material to duplicate name", async () => {
      await materialPage.material_searchInput.fill(name2);
      await materialPage.material_searchInput.press("Enter");

      await materialPage.getEditButtonByName(name2).click();
      await materialPage.attributeModalComponent.updateAttribute("Material", name1);
    });

    await test.step("Verify duplicate error", async () => {
      await expect(materialPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC044 - Verify updated material persists after reload", async ({ materialPage }) => {
    const oldName = faker.commerce.productMaterial();
    const newName = `Mat_${faker.string.alphanumeric(5)}`;

    await test.step("Prepare material", async () => {
      await materialPage.waitForPageLoad();
      await createMaterialIfNotExists(materialPage, oldName);
    });

    await test.step("Update material", async () => {
      await materialPage.material_searchInput.fill(oldName);
      await materialPage.material_searchInput.press("Enter");
      await materialPage.getEditButtonByName(oldName).click();
      await materialPage.attributeModalComponent.updateAttribute("Material", newName);
      await expect(materialPage.toastMessage.success_message.first()).toBeVisible();
      await expect(materialPage.toastMessage.success_message).toBeHidden();
    });

    await test.step("Reload page", async () => {
      await materialPage.page.reload();
      await materialPage.waitForPageLoad();
    });

    await test.step("Verify updated data still exists", async () => {
      await materialPage.material_searchInput.fill(newName);
      await materialPage.material_searchInput.press("Enter");

      await expect(materialPage.getRowByName(newName)).toBeVisible();
    });
    await test.step("Revert Update", async () => {
      await materialPage.material_searchInput.fill(newName);
      await materialPage.material_searchInput.press("Enter");
      await materialPage.page.waitForLoadState("networkidle");
      await materialPage.getEditButtonByName(newName).click();
      await materialPage.attributeModalComponent.updateAttribute("Material", oldName);
    });
  });

  test("TC045 - Toggle material status successfully", async ({ materialPage }) => {

    let oldStatus: string | null;
    let newStatus: string | null;
    const name = "Ceramic";

    await test.step("Open material page and search item", async () => {
      await materialPage.waitForPageLoad();

      await materialPage.material_searchInput.fill(name);
      await materialPage.material_searchInput.press("Enter");
    });

    await test.step("Get current status of toggle", async () => {
      const toggleInput = materialPage.getToggleByName(name).first();
      oldStatus = await toggleInput.getAttribute("aria-checked");
    });

    await test.step("Toggle material status", async () => {
      const toggleInput = materialPage.getToggleByName(name).first();
      const toggle = toggleInput.locator("xpath=ancestor::div[1]");

      await toggle.click();
    });

    await test.step("Verify success toast appears with correct message", async () => {
      const toast = materialPage.toastMessage.success_message.first();

      await expect(toast).toBeVisible();
      await expect(toast).toContainText(
        "Cập nhật trạng thái chất liệu thành công"
      );
    });

    await test.step("Verify toast disappears", async () => {
      await expect(materialPage.toastMessage.success_message).toBeHidden();
    });

    await test.step("Verify toggle status is updated", async () => {
      const toggleInput = materialPage.getToggleByName(name).first();

      await expect(async () => {
        newStatus = await toggleInput.getAttribute("aria-checked");
        expect(newStatus).not.toBe(oldStatus);
      }).toPass();
    });
  });

  test("TC046 - Verify material status persists after reload", async ({ materialPage }) => {

    let oldStatus: string | null;
    let newStatus: string | null;
    let statusAfterReload: string | null;
    const name = "Rubber";

    await test.step("Open material page and search item", async () => {
      await materialPage.waitForPageLoad();

      await materialPage.material_searchInput.fill(name);
      await materialPage.material_searchInput.press("Enter");
    });

    await test.step("Get current toggle status", async () => {
      const toggleInput = materialPage.getToggleByName(name).first();
      oldStatus = await toggleInput.getAttribute("aria-checked");
    });

    await test.step("Toggle material status", async () => {
      const toggleInput = materialPage.getToggleByName(name).first();
      const toggle = toggleInput.locator("xpath=ancestor::div[1]");

      await toggle.click();

      await expect(materialPage.toastMessage.success_message.first()).toBeVisible();
    });

    await test.step("Verify status changed after toggle", async () => {
      const toggleInput = materialPage.getToggleByName(name).first();

      await expect(async () => {
        newStatus = await toggleInput.getAttribute("aria-checked");
        expect(newStatus).not.toBe(oldStatus);
      }).toPass();
      await expect(materialPage.toastMessage.success_message.first()).toBeHidden()
    });

    await test.step("Reload page", async () => {
      await materialPage.page.reload();
      await materialPage.waitForPageLoad();
    });

    await test.step("Search item again after reload", async () => {
      await materialPage.material_searchInput.fill(name);
      await materialPage.material_searchInput.press("Enter");
    });

    await test.step("Verify status persisted after reload", async () => {
      const toggleInput = materialPage.getToggleByName(name).first();
      statusAfterReload = await toggleInput.getAttribute("aria-checked");

      expect(statusAfterReload).toBe(newStatus);
    });
  });
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});