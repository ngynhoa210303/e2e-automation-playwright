import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();
import { faker } from "@faker-js/faker";

test.describe("sleeve Management - Update", { tag: "@update-sleeve" }, () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_ADMIN_USERNAME!,
      process.env.TB_ADMIN_PASSWORD!,
    );

    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/dashboard`
    );

    await loginPage.menuBar.submenu.sleeves.click();

    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/attribute/sleeve`
    );
  });

  async function createsleeveIfNotExists(sleevePage: any, name: string) {
    await sleevePage.sleeve_searchInput.fill(name);
    await sleevePage.sleeve_searchInput.press("Enter");
    await sleevePage.page.waitForLoadState("networkidle");
    const isEmpty = await sleevePage.noResultsMessage.isVisible();
    if (isEmpty) {
      await sleevePage.add_button.click();
      await sleevePage.attributeModalComponent.createAttribute("Sleeve", name);
      await expect(sleevePage.toastMessage.success_message.first()).toBeVisible();
      await expect(sleevePage.toastMessage.success_message).toBeHidden();
    }
  }

  test("TC1 - Update sleeve name successfully", async ({ sleevePage }) => {
    const oldName = "Dài tay";
    const newName = `sleeve_${faker.string.alphanumeric(5)}`;

    await test.step("Prepare sleeve data", async () => {
      await sleevePage.waitForPageLoad();
      await createsleeveIfNotExists(sleevePage, oldName);
    });

    await test.step("Search and open edit modal", async () => {
      await sleevePage.sleeve_searchInput.fill(oldName);
      await sleevePage.sleeve_searchInput.press("Enter");
      await sleevePage.page.waitForLoadState("networkidle");
      await sleevePage.getEditButtonByName(oldName).click();
    });

    await test.step("Update sleeve name", async () => {
      await sleevePage.attributeModalComponent.updateAttribute("Sleeve", newName);
    });

    await test.step("Verify update success", async () => {
      await expect(sleevePage.toastMessage.success_message.first()).toBeVisible();
      await expect(sleevePage.toastMessage.success_message).toBeHidden();
      await sleevePage.sleeve_searchInput.fill(newName);
      await sleevePage.sleeve_searchInput.press("Enter");
      await sleevePage.page.waitForLoadState("networkidle");
      await expect(sleevePage.getRowByName(newName)).toBeVisible();
    });
    await test.step("Revert Update", async () => {
      await sleevePage.sleeve_searchInput.fill(newName);
      await sleevePage.sleeve_searchInput.press("Enter");
      await sleevePage.page.waitForLoadState("networkidle");
      await sleevePage.getEditButtonByName(newName).click();
      await sleevePage.attributeModalComponent.updateAttribute("Sleeve", oldName);
    });
  });

  test("TC2 - Validate update with empty name", async ({ sleevePage }) => {
    const name = "Tay basic";

    await test.step("Prepare sleeve", async () => {
      await sleevePage.waitForPageLoad();
      await createsleeveIfNotExists(sleevePage, name);
    });

    await test.step("Open edit modal", async () => {
      await sleevePage.sleeve_searchInput.fill(name);
      await sleevePage.sleeve_searchInput.press("Enter");
      await sleevePage.getEditButtonByName(name).click();
    });

    await test.step("Submit empty name", async () => {
      await sleevePage.attributeModalComponent.updateAttribute("Sleeve", "");
    });

    await test.step("Verify error message", async () => {
      await expect(sleevePage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC3 - Validate update with duplicate name", async ({ sleevePage }) => {
    const name1 = "Tay ngắn";
    const name2 = "Tay xẻ";

    await test.step("Prepare 2 sleeves", async () => {
      await sleevePage.waitForPageLoad();
      await createsleeveIfNotExists(sleevePage, name1);
      await createsleeveIfNotExists(sleevePage, name2);
    });

    await test.step("Edit sleeve to duplicate name", async () => {
      await sleevePage.sleeve_searchInput.fill(name2);
      await sleevePage.sleeve_searchInput.press("Enter");

      await sleevePage.getEditButtonByName(name2).click();
      await sleevePage.attributeModalComponent.updateAttribute("Sleeve", name1);
    });

    await test.step("Verify duplicate error", async () => {
      await expect(sleevePage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC4 - Verify updated sleeve persists after reload", async ({ sleevePage }) => {
    const oldName = "Tay ngắn";
    const newName = `sleeve_${faker.string.alphanumeric(5)}`;

    await test.step("Prepare sleeve", async () => {
      await sleevePage.waitForPageLoad();
      await createsleeveIfNotExists(sleevePage, oldName);
    });

    await test.step("Update sleeve", async () => {
      await sleevePage.sleeve_searchInput.fill(oldName);
      await sleevePage.sleeve_searchInput.press("Enter");
      await sleevePage.getEditButtonByName(oldName).click();
      await sleevePage.attributeModalComponent.updateAttribute("Sleeve", newName);
      await expect(sleevePage.toastMessage.success_message.first()).toBeVisible();
      await expect(sleevePage.toastMessage.success_message).toBeHidden();
    });

    await test.step("Reload page", async () => {
      await sleevePage.page.reload();
      await sleevePage.waitForPageLoad();
    });

    await test.step("Verify updated data still exists", async () => {
      await sleevePage.sleeve_searchInput.fill(newName);
      await sleevePage.sleeve_searchInput.press("Enter");

      await expect(sleevePage.getRowByName(newName)).toBeVisible();
    });
    await test.step("Revert Update", async () => {
      await sleevePage.sleeve_searchInput.fill(newName);
      await sleevePage.sleeve_searchInput.press("Enter");
      await sleevePage.page.waitForLoadState("networkidle");
      await sleevePage.getEditButtonByName(newName).click();
      await sleevePage.attributeModalComponent.updateAttribute("Sleeve", oldName);
    });
  });

  test("TC5 - Toggle sleeve status successfully", async ({ sleevePage }) => {
    let oldStatus: string | null;
    let newStatus: string | null;
    const name = "Tay phồng nhẹ";

    await test.step("Open sleeve page and search item", async () => {
      await sleevePage.waitForPageLoad();

      await sleevePage.sleeve_searchInput.fill(name);
      await sleevePage.sleeve_searchInput.press("Enter");
    });

    await test.step("Get current status of toggle", async () => {
      const toggleInput = sleevePage.getToggleByName(name).first();
      oldStatus = await toggleInput.getAttribute("aria-checked");
    });

    await test.step("Toggle sleeve status", async () => {
      const toggleInput = sleevePage.getToggleByName(name).first();
      const toggle = toggleInput.locator("xpath=ancestor::div[1]");
      await toggle.click();
    });

    await test.step("Verify success toast appears with correct message", async () => {
      const toast = sleevePage.toastMessage.success_message.first();
      await expect(toast).toBeVisible();
      await expect(toast).toContainText(
        "Thay đổi trạng thái thành công"
      );
    });

    await test.step("Verify toast disappears", async () => {
      await expect(sleevePage.toastMessage.success_message).toBeHidden();
    });

    await test.step("Verify toggle status is updated", async () => {
      const toggleInput = sleevePage.getToggleByName(name).first();

      await expect(async () => {
        newStatus = await toggleInput.getAttribute("aria-checked");
        expect(newStatus).not.toBe(oldStatus);
      }).toPass();
    });
  });

  test("TC6 - Verify sleeve status persists after reload", async ({ sleevePage }) => {
    let oldStatus: string | null;
    let newStatus: string | null;
    let statusAfterReload: string | null;
    const name = "Tay lỡ";

    await test.step("Open sleeve page and search item", async () => {
      await sleevePage.waitForPageLoad();

      await sleevePage.sleeve_searchInput.fill(name);
      await sleevePage.sleeve_searchInput.press("Enter");
    });

    await test.step("Get current toggle status", async () => {
      const toggleInput = sleevePage.getToggleByName(name).first();
      oldStatus = await toggleInput.getAttribute("aria-checked");
    });

    await test.step("Toggle sleeve status", async () => {
      const toggleInput = sleevePage.getToggleByName(name).first();
      const toggle = toggleInput.locator("xpath=ancestor::div[1]");

      await toggle.click();

      await expect(sleevePage.toastMessage.success_message.first()).toBeVisible();
    });

    await test.step("Verify status changed after toggle", async () => {
      const toggleInput = sleevePage.getToggleByName(name).first();

      await expect(async () => {
        newStatus = await toggleInput.getAttribute("aria-checked");
        expect(newStatus).not.toBe(oldStatus);
      }).toPass();
    });

    await test.step("Reload page", async () => {
      await sleevePage.page.reload();
      await sleevePage.waitForPageLoad();
    });

    await test.step("Search item again after reload", async () => {
      await sleevePage.sleeve_searchInput.fill(name);
      await sleevePage.sleeve_searchInput.press("Enter");
    });

    await test.step("Verify status persisted after reload", async () => {
      const toggleInput = sleevePage.getToggleByName(name).first();
      statusAfterReload = await toggleInput.getAttribute("aria-checked");

      expect(statusAfterReload).toBe(newStatus);
    });
  });
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});