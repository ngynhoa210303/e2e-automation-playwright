import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();
import { faker } from "@faker-js/faker";

test.describe("color Management - Update", { tag: "@update-color" }, () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_ADMIN_USERNAME!,
      process.env.TB_ADMIN_PASSWORD!,
    );

    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/dashboard`
    );

    await loginPage.menuBar.submenu.colors.click();

    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/attribute/color`
    );
  });

  async function createcolorIfNotExists(colorPage: any, name: string) {
    await colorPage.color_searchInput.fill(name);
    await colorPage.color_searchInput.press("Enter");
    await colorPage.page.waitForLoadState("networkidle");
    const isEmpty = await colorPage.noResultsMessage.isVisible();
    if (isEmpty) {
      await colorPage.add_button.click();
      await colorPage.attributeModalComponent.createAttribute("Color", name);
      await expect(colorPage.toastMessage.success_message.first()).toBeVisible();
      await expect(colorPage.toastMessage.success_message).toBeHidden();
    }
  }

  test("TC1 - Update color name successfully", async ({ colorPage }) => {
    const oldName = "Đỏ đô";
    const newName = `Color_${faker.string.alphanumeric(5)}`;

    await test.step("Prepare color data", async () => {
      await colorPage.waitForPageLoad();
      await createcolorIfNotExists(colorPage, oldName);
    });

    await test.step("Search and open edit modal", async () => {
      await colorPage.color_searchInput.fill(oldName);
      await colorPage.color_searchInput.press("Enter");
      await colorPage.page.waitForLoadState("networkidle");
      await colorPage.getEditButtonByName(oldName).click();
    });

    await test.step("Update color name", async () => {
      await colorPage.attributeModalComponent.updateAttribute("Color", newName);
    });

    await test.step("Verify update success", async () => {
      await expect(colorPage.toastMessage.success_message.first()).toBeVisible();
      await expect(colorPage.toastMessage.success_message).toBeHidden();
      await colorPage.color_searchInput.fill(newName);
      await colorPage.color_searchInput.press("Enter");
      await colorPage.page.waitForLoadState("networkidle");
      await expect(colorPage.getRowByName(newName)).toBeVisible();
    });
    await test.step("Revert Update", async () => {
      await colorPage.color_searchInput.fill(newName);
      await colorPage.color_searchInput.press("Enter");
      await colorPage.page.waitForLoadState("networkidle");
      await colorPage.getEditButtonByName(newName).click();
      await colorPage.attributeModalComponent.updateAttribute("Color", oldName);
    });
  });

  test("TC2 - Validate update with empty name", async ({ colorPage }) => {
    const name = "Xanh rêu";

    await test.step("Prepare color", async () => {
      await colorPage.waitForPageLoad();
      await createcolorIfNotExists(colorPage, name);
    });

    await test.step("Open edit modal", async () => {
      await colorPage.color_searchInput.fill(name);
      await colorPage.color_searchInput.press("Enter");
      await colorPage.getEditButtonByName(name).click();
    });

    await test.step("Submit empty name", async () => {
      await colorPage.attributeModalComponent.updateAttribute("Color", "");
    });

    await test.step("Verify error message", async () => {
      await expect(colorPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC3 - Validate update with duplicate name", async ({ colorPage }) => {
    const name1 = "Hồng pastel";
    const name2 = "Tím";

    await test.step("Prepare 2 colors", async () => {
      await colorPage.waitForPageLoad();
      await createcolorIfNotExists(colorPage, name1);
      await createcolorIfNotExists(colorPage, name2);
    });

    await test.step("Edit color to duplicate name", async () => {
      await colorPage.color_searchInput.fill(name2);
      await colorPage.color_searchInput.press("Enter");

      await colorPage.getEditButtonByName(name2).click();
      await colorPage.attributeModalComponent.updateAttribute("Color", name1);
    });

    await test.step("Verify duplicate error", async () => {
      await expect(colorPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC4 - Verify updated color persists after reload", async ({ colorPage }) => {
    const oldName = "Vàng";
    const newName = `Color_${faker.string.alphanumeric(5)}`;

    await test.step("Prepare color", async () => {
      await colorPage.waitForPageLoad();
      await createcolorIfNotExists(colorPage, oldName);
    });

    await test.step("Update color", async () => {
      await colorPage.color_searchInput.fill(oldName);
      await colorPage.color_searchInput.press("Enter");
      await colorPage.getEditButtonByName(oldName).click();
      await colorPage.attributeModalComponent.updateAttribute("Color", newName);
      await expect(colorPage.toastMessage.success_message.first()).toBeVisible();
      await expect(colorPage.toastMessage.success_message).toBeHidden();
    });

    await test.step("Reload page", async () => {
      await colorPage.page.reload();
      await colorPage.waitForPageLoad();
    });

    await test.step("Verify updated data still exists", async () => {
      await colorPage.color_searchInput.fill(newName);
      await colorPage.color_searchInput.press("Enter");

      await expect(colorPage.getRowByName(newName)).toBeVisible();
    });
    await test.step("Revert Update", async () => {
      await colorPage.color_searchInput.fill(newName);
      await colorPage.color_searchInput.press("Enter");
      await colorPage.page.waitForLoadState("networkidle");
      await colorPage.getEditButtonByName(newName).click();
      await colorPage.attributeModalComponent.updateAttribute("Color", oldName);
    });
  });

  test("TC5 - Toggle color status successfully", async ({ colorPage }) => {
    let oldStatus: string | null;
    let newStatus: string | null;
    const name = "Color_Fiqms";

    await test.step("Open color page and search item", async () => {
      await colorPage.waitForPageLoad();

      await colorPage.color_searchInput.fill(name);
      await colorPage.color_searchInput.press("Enter");
    });

    await test.step("Get current status of toggle", async () => {
      const toggleInput = colorPage.getToggleByName(name).first();
      oldStatus = await toggleInput.getAttribute("aria-checked");
    });

    await test.step("Toggle color status", async () => {
      const toggleInput = colorPage.getToggleByName(name).first();
      const toggle = toggleInput.locator("xpath=ancestor::div[1]");
      await toggle.click();
    });

    await test.step("Verify success toast appears with correct message", async () => {
      const toast = colorPage.toastMessage.success_message.first();
      await expect(toast).toBeVisible();
      // await expect(toast).toContainText(
      //   "Thay đổi trạng thái thương hiệu thành công"
      // );
    });

    await test.step("Verify toast disappears", async () => {
      await expect(colorPage.toastMessage.success_message).toBeHidden();
    });

    await test.step("Verify toggle status is updated", async () => {
      const toggleInput = colorPage.getToggleByName(name).first();

      await expect(async () => {
        newStatus = await toggleInput.getAttribute("aria-checked");
        expect(newStatus).not.toBe(oldStatus);
      }).toPass();
    });
  });

  test("TC6 - Verify color status persists after reload", async ({ colorPage }) => {
    let oldStatus: string | null;
    let newStatus: string | null;
    let statusAfterReload: string | null;
    const name = "Will - Keeling";

    await test.step("Open color page and search item", async () => {
      await colorPage.waitForPageLoad();

      await colorPage.color_searchInput.fill(name);
      await colorPage.color_searchInput.press("Enter");
    });

    await test.step("Get current toggle status", async () => {
      const toggleInput = colorPage.getToggleByName(name).first();
      oldStatus = await toggleInput.getAttribute("aria-checked");
    });

    await test.step("Toggle color status", async () => {
      const toggleInput = colorPage.getToggleByName(name).first();
      const toggle = toggleInput.locator("xpath=ancestor::div[1]");

      await toggle.click();

      await expect(colorPage.toastMessage.success_message.first()).toBeVisible();
    });

    await test.step("Verify status changed after toggle", async () => {
      const toggleInput = colorPage.getToggleByName(name).first();

      await expect(async () => {
        newStatus = await toggleInput.getAttribute("aria-checked");
        expect(newStatus).not.toBe(oldStatus);
      }).toPass();
    });

    await test.step("Reload page", async () => {
      await colorPage.page.reload();
      await colorPage.waitForPageLoad();
    });

    await test.step("Search item again after reload", async () => {
      await colorPage.color_searchInput.fill(name);
      await colorPage.color_searchInput.press("Enter");
    });

    await test.step("Verify status persisted after reload", async () => {
      const toggleInput = colorPage.getToggleByName(name).first();
      statusAfterReload = await toggleInput.getAttribute("aria-checked");

      expect(statusAfterReload).toBe(newStatus);
    });
  });
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});