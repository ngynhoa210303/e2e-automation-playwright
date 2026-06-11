import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();
import { faker } from "@faker-js/faker";

test.describe("size Management - Update", { tag: "@update-size" }, () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_ADMIN_USERNAME!,
      process.env.TB_ADMIN_PASSWORD!,
    );

    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/dashboard`
    );

    await loginPage.menuBar.submenu.sizes.click();

    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/attribute/size`
    );
  });

  async function createsizeIfNotExists(sizePage: any, name: string) {
    await sizePage.size_searchInput.fill(name);
    await sizePage.size_searchInput.press("Enter");
    await sizePage.page.waitForLoadState("networkidle");
    const isEmpty = await sizePage.noResultsMessage.isVisible();
    if (isEmpty) {
      await sizePage.add_button.click();
      await sizePage.attributeModalComponent.createAttribute("Size", name);
      await expect(sizePage.toastMessage.success_message.first()).toBeVisible();
      await expect(sizePage.toastMessage.success_message).toBeHidden();
    }
  }

  test("TC1 - Update size name successfully", async ({ sizePage }) => {
    const oldName = faker.company.name();
    const newName = `Size_${faker.string.alphanumeric(5)}`;

    await test.step("Prepare size data", async () => {
      await sizePage.waitForPageLoad();
      await createsizeIfNotExists(sizePage, oldName);
    });

    await test.step("Search and open edit modal", async () => {
      await sizePage.size_searchInput.fill(oldName);
      await sizePage.size_searchInput.press("Enter");
      await sizePage.page.waitForLoadState("networkidle");
      await sizePage.getEditButtonByName(oldName).click();
    });

    await test.step("Update size name", async () => {
      await sizePage.attributeModalComponent.updateAttribute("Size", newName);
    });

    await test.step("Verify update success", async () => {
      await expect(sizePage.toastMessage.success_message.first()).toBeVisible();
      await expect(sizePage.toastMessage.success_message).toBeHidden();
      await sizePage.size_searchInput.fill(newName);
      await sizePage.size_searchInput.press("Enter");
      await sizePage.page.waitForLoadState("networkidle");
      await expect(sizePage.getRowByName(newName)).toBeVisible();
    });
    await test.step("Revert Update", async () => {
      await sizePage.size_searchInput.fill(newName);
      await sizePage.size_searchInput.press("Enter");
      await sizePage.page.waitForLoadState("networkidle");
      await sizePage.getEditButtonByName(newName).click();
      await sizePage.attributeModalComponent.updateAttribute("Size", oldName);
    });
  });

  test("TC2- Validate update with empty name", async ({ sizePage }) => {
    const name = faker.company.name();

    await test.step("Prepare size", async () => {
      await sizePage.waitForPageLoad();
      await createsizeIfNotExists(sizePage, name);
    });

    await test.step("Open edit modal", async () => {
      await sizePage.size_searchInput.fill(name);
      await sizePage.size_searchInput.press("Enter");
      await sizePage.getEditButtonByName(name).click();
    });

    await test.step("Submit empty name", async () => {
      await sizePage.attributeModalComponent.updateAttribute("Size", "");
    });

    await test.step("Verify error message", async () => {
      await expect(sizePage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC3 - Validate update with duplicate name", async ({ sizePage }) => {
    const name1 = faker.company.name();
    const name2 = faker.company.name();

    await test.step("Prepare 2 sizes", async () => {
      await sizePage.waitForPageLoad();
      await createsizeIfNotExists(sizePage, name1);
      await createsizeIfNotExists(sizePage, name2);
    });

    await test.step("Edit size to duplicate name", async () => {
      await sizePage.size_searchInput.fill(name2);
      await sizePage.size_searchInput.press("Enter");

      await sizePage.getEditButtonByName(name2).click();
      await sizePage.attributeModalComponent.updateAttribute("Size", name1);
    });

    await test.step("Verify duplicate error", async () => {
      await expect(sizePage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC4 - Verify updated size persists after reload", async ({ sizePage }) => {
    const oldName = faker.company.name();
    const newName = `size_${faker.string.alphanumeric(5)}`;

    await test.step("Prepare size", async () => {
      await sizePage.waitForPageLoad();
      await createsizeIfNotExists(sizePage, oldName);
    });

    await test.step("Update size", async () => {
      await sizePage.size_searchInput.fill(oldName);
      await sizePage.size_searchInput.press("Enter");
      await sizePage.getEditButtonByName(oldName).click();
      await sizePage.attributeModalComponent.updateAttribute("Size", newName);
      await expect(sizePage.toastMessage.success_message.first()).toBeVisible();
      await expect(sizePage.toastMessage.success_message).toBeHidden();
    });

    await test.step("Reload page", async () => {
      await sizePage.page.reload();
      await sizePage.waitForPageLoad();
    });

    await test.step("Verify updated data still exists", async () => {
      await sizePage.size_searchInput.fill(newName);
      await sizePage.size_searchInput.press("Enter");

      await expect(sizePage.getRowByName(newName)).toBeVisible();
    });
    await test.step("Revert Update", async () => {
      await sizePage.size_searchInput.fill(newName);
      await sizePage.size_searchInput.press("Enter");
      await sizePage.page.waitForLoadState("networkidle");
      await sizePage.getEditButtonByName(newName).click();
      await sizePage.attributeModalComponent.updateAttribute("Size", oldName);
    });
  });

  test("TC5 - Toggle size status successfully", async ({ sizePage }) => {
    let oldStatus: string | null;
    let newStatus: string | null;
    const name = "Predovic Inc";

    await test.step("Open size page and search item", async () => {
      await sizePage.waitForPageLoad();

      await sizePage.size_searchInput.fill(name);
      await sizePage.size_searchInput.press("Enter");
    });

    await test.step("Get current status of toggle", async () => {
      const toggleInput = sizePage.getToggleByName(name).first();
      oldStatus = await toggleInput.getAttribute("aria-checked");
    });

    await test.step("Toggle size status", async () => {
      const toggleInput = sizePage.getToggleByName(name).first();
      const toggle = toggleInput.locator("xpath=ancestor::div[1]");
      await toggle.click();
    });

    await test.step("Verify success toast appears with correct message", async () => {
      const toast = sizePage.toastMessage.success_message.first();
      await expect(toast).toBeVisible();
    //   await expect(toast).toContainText(
    //     "Thay đổi trạng thái thương hiệu thành công"
    //   );
    });

    await test.step("Verify toast disappears", async () => {
      await expect(sizePage.toastMessage.success_message).toBeHidden();
    });

    await test.step("Verify toggle status is updated", async () => {
      const toggleInput = sizePage.getToggleByName(name).first();

      await expect(async () => {
        newStatus = await toggleInput.getAttribute("aria-checked");
        expect(newStatus).not.toBe(oldStatus);
      }).toPass();
    });
  });

  test("TC6 - Verify size status persists after reload", async ({ sizePage }) => {
    let oldStatus: string | null;
    let newStatus: string | null;
    let statusAfterReload: string | null;
    const name = "Predovic Inc";

    await test.step("Open size page and search item", async () => {
      await sizePage.waitForPageLoad();

      await sizePage.size_searchInput.fill(name);
      await sizePage.size_searchInput.press("Enter");
    });

    await test.step("Get current toggle status", async () => {
      const toggleInput = sizePage.getToggleByName(name).first();
      oldStatus = await toggleInput.getAttribute("aria-checked");
    });

    await test.step("Toggle size status", async () => {
      const toggleInput = sizePage.getToggleByName(name).first();
      const toggle = toggleInput.locator("xpath=ancestor::div[1]");

      await toggle.click();

      await expect(sizePage.toastMessage.success_message.first()).toBeVisible();
    });

    await test.step("Verify status changed after toggle", async () => {
      const toggleInput = sizePage.getToggleByName(name).first();

      await expect(async () => {
        newStatus = await toggleInput.getAttribute("aria-checked");
        expect(newStatus).not.toBe(oldStatus);
      }).toPass();
    });

    await test.step("Reload page", async () => {
      await sizePage.page.reload();
      await sizePage.waitForPageLoad();
    });

    await test.step("Search item again after reload", async () => {
      await sizePage.size_searchInput.fill(name);
      await sizePage.size_searchInput.press("Enter");
    });

    await test.step("Verify status persisted after reload", async () => {
      const toggleInput = sizePage.getToggleByName(name).first();
      statusAfterReload = await toggleInput.getAttribute("aria-checked");

      expect(statusAfterReload).toBe(newStatus);
    });
  });
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});