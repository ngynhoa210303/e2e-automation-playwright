import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();
import { faker } from "@faker-js/faker";

test.describe("Brand Management - Update", { tag: "@update-material" }, () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_ADMIN_USERNAME!,
      process.env.TB_ADMIN_PASSWORD!,
    );

    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/dashboard`
    );

    await loginPage.menuBar.submenu.brands.click();

    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/brand`
    );
  });

  async function createBrandIfNotExists(brandPage: any, name: string) {
    await brandPage.brand_searchInput.fill(name);
    await brandPage.brand_searchInput.press("Enter");
    await brandPage.page.waitForLoadState("networkidle");
    const isEmpty = await brandPage.noResultsMessage.isVisible();
    if (isEmpty) {
      await brandPage.add_button.click();
      await brandPage.attributeModalComponent.createAttribute("Brand", name);
      await expect(brandPage.toastMessage.success_message.first()).toBeVisible();
      await expect(brandPage.toastMessage.success_message).toBeHidden();
    }
  }

  test("TC026 - Update brand name successfully", async ({ brandPage }) => {
    const oldName = faker.company.name();
    const newName = `Brand_${faker.string.alphanumeric(5)}`;

    await test.step("Prepare brand data", async () => {
      await brandPage.waitForPageLoad();
      await createBrandIfNotExists(brandPage, oldName);
    });

    await test.step("Search and open edit modal", async () => {
      await brandPage.brand_searchInput.fill(oldName);
      await brandPage.brand_searchInput.press("Enter");
      await brandPage.page.waitForLoadState("networkidle");
      await brandPage.getEditButtonByName(oldName).click();
    });

    await test.step("Update brand name", async () => {
      await brandPage.attributeModalComponent.updateAttribute("Brand", newName);
    });

    await test.step("Verify update success", async () => {
      await expect(brandPage.toastMessage.success_message.first()).toBeVisible();
      await expect(brandPage.toastMessage.success_message).toBeHidden();
      await brandPage.brand_searchInput.fill(newName);
      await brandPage.brand_searchInput.press("Enter");
      await brandPage.page.waitForLoadState("networkidle");
      await expect(brandPage.getRowByName(newName)).toBeVisible();
    });
    await test.step("Revert Update", async () => {
      await brandPage.brand_searchInput.fill(newName);
      await brandPage.brand_searchInput.press("Enter");
      await brandPage.page.waitForLoadState("networkidle");
      await brandPage.getEditButtonByName(newName).click();
      await brandPage.attributeModalComponent.updateAttribute("Brand", oldName);
    });
  });

  test("TC027 - Validate update with empty name", async ({ brandPage }) => {
    const name = faker.company.name();

    await test.step("Prepare brand", async () => {
      await brandPage.waitForPageLoad();
      await createBrandIfNotExists(brandPage, name);
    });

    await test.step("Open edit modal", async () => {
      await brandPage.brand_searchInput.fill(name);
      await brandPage.brand_searchInput.press("Enter");
      await brandPage.getEditButtonByName(name).click();
    });

    await test.step("Submit empty name", async () => {
      await brandPage.attributeModalComponent.updateAttribute("Brand", "");
    });

    await test.step("Verify error message", async () => {
      await expect(brandPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC028 - Validate update with duplicate name", async ({ brandPage }) => {
    const name1 = faker.company.name();
    const name2 = faker.company.name();

    await test.step("Prepare 2 brands", async () => {
      await brandPage.waitForPageLoad();
      await createBrandIfNotExists(brandPage, name1);
      await createBrandIfNotExists(brandPage, name2);
    });

    await test.step("Edit brand to duplicate name", async () => {
      await brandPage.brand_searchInput.fill(name2);
      await brandPage.brand_searchInput.press("Enter");

      await brandPage.getEditButtonByName(name2).click();
      await brandPage.attributeModalComponent.updateAttribute("Brand", name1);
    });

    await test.step("Verify duplicate error", async () => {
      await expect(brandPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC029 - Verify updated brand persists after reload", async ({ brandPage }) => {
    const oldName = faker.company.name();
    const newName = `Brand_${faker.string.alphanumeric(5)}`;

    await test.step("Prepare brand", async () => {
      await brandPage.waitForPageLoad();
      await createBrandIfNotExists(brandPage, oldName);
    });

    await test.step("Update brand", async () => {
      await brandPage.brand_searchInput.fill(oldName);
      await brandPage.brand_searchInput.press("Enter");
      await brandPage.getEditButtonByName(oldName).click();
      await brandPage.attributeModalComponent.updateAttribute("Brand", newName);
      await expect(brandPage.toastMessage.success_message.first()).toBeVisible();
      await expect(brandPage.toastMessage.success_message).toBeHidden();
    });

    await test.step("Reload page", async () => {
      await brandPage.page.reload();
      await brandPage.waitForPageLoad();
    });

    await test.step("Verify updated data still exists", async () => {
      await brandPage.brand_searchInput.fill(newName);
      await brandPage.brand_searchInput.press("Enter");

      await expect(brandPage.getRowByName(newName)).toBeVisible();
    });
    await test.step("Revert Update", async () => {
      await brandPage.brand_searchInput.fill(newName);
      await brandPage.brand_searchInput.press("Enter");
      await brandPage.page.waitForLoadState("networkidle");
      await brandPage.getEditButtonByName(newName).click();
      await brandPage.attributeModalComponent.updateAttribute("Brand", oldName);
    });
  });

  test("TC030 - Toggle brand status successfully", async ({ brandPage }) => {
    let oldStatus: string | null;
    let newStatus: string | null;
    const name = "Bruen Inc";

    await test.step("Open brand page and search item", async () => {
      await brandPage.waitForPageLoad();

      await brandPage.brand_searchInput.fill(name);
      await brandPage.brand_searchInput.press("Enter");
    });

    await test.step("Get current status of toggle", async () => {
      const toggleInput = brandPage.getToggleByName(name).first();
      oldStatus = await toggleInput.getAttribute("aria-checked");
    });

    await test.step("Toggle brand status", async () => {
      const toggleInput = brandPage.getToggleByName(name).first();
      const toggle = toggleInput.locator("xpath=ancestor::div[1]");
      await toggle.click();
    });

    await test.step("Verify success toast appears with correct message", async () => {
      const toast = brandPage.toastMessage.success_message.first();
      await expect(toast).toBeVisible();
      await expect(toast).toContainText(
        "Thay đổi trạng thái thương hiệu thành công"
      );
    });

    await test.step("Verify toast disappears", async () => {
      await expect(brandPage.toastMessage.success_message).toBeHidden();
    });

    await test.step("Verify toggle status is updated", async () => {
      const toggleInput = brandPage.getToggleByName(name).first();

      await expect(async () => {
        newStatus = await toggleInput.getAttribute("aria-checked");
        expect(newStatus).not.toBe(oldStatus);
      }).toPass();
    });
  });

  test("TC031 - Verify brand status persists after reload", async ({ brandPage }) => {
    let oldStatus: string | null;
    let newStatus: string | null;
    let statusAfterReload: string | null;
    const name = "Bruen Inc";

    await test.step("Open brand page and search item", async () => {
      await brandPage.waitForPageLoad();

      await brandPage.brand_searchInput.fill(name);
      await brandPage.brand_searchInput.press("Enter");
    });

    await test.step("Get current toggle status", async () => {
      const toggleInput = brandPage.getToggleByName(name).first();
      oldStatus = await toggleInput.getAttribute("aria-checked");
    });

    await test.step("Toggle brand status", async () => {
      const toggleInput = brandPage.getToggleByName(name).first();
      const toggle = toggleInput.locator("xpath=ancestor::div[1]");

      await toggle.click();

      await expect(brandPage.toastMessage.success_message.first()).toBeVisible();
    });

    await test.step("Verify status changed after toggle", async () => {
      const toggleInput = brandPage.getToggleByName(name).first();

      await expect(async () => {
        newStatus = await toggleInput.getAttribute("aria-checked");
        expect(newStatus).not.toBe(oldStatus);
      }).toPass();
    });

    await test.step("Reload page", async () => {
      await brandPage.page.reload();
      await brandPage.waitForPageLoad();
    });

    await test.step("Search item again after reload", async () => {
      await brandPage.brand_searchInput.fill(name);
      await brandPage.brand_searchInput.press("Enter");
    });

    await test.step("Verify status persisted after reload", async () => {
      const toggleInput = brandPage.getToggleByName(name).first();
      statusAfterReload = await toggleInput.getAttribute("aria-checked");

      expect(statusAfterReload).toBe(newStatus);
    });
  });
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});