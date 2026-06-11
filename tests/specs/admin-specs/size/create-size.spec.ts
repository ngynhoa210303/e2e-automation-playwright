import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();
import { faker } from '@faker-js/faker';

test.describe("size Management - Create & Validation", { tag: "@size" }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_ADMIN_USERNAME!,
      process.env.TB_ADMIN_PASSWORD!,
    );
    await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/admin/dashboard`);
    await loginPage.menuBar.submenu.sizes.click();
    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/attribute/size`,
    );
  });

  test("TC1 - Create new size if not exists", async ({ sizePage }) => {
    await sizePage.waitForPageLoad();
    const size = faker.company.name();
    await sizePage.size_searchInput.fill(size);
    await sizePage.size_searchInput.press('Enter');
    await sizePage.page.waitForLoadState('networkidle');
    const isEmpty = await sizePage.noResultsMessage.isVisible();

    if (isEmpty) {
      await sizePage.add_button.click();
      await sizePage.attributeModalComponent.createAttribute("Size", size);
      await expect(sizePage.toastMessage.success_message.first()).toBeVisible();
    } else {
      console.log(`size đã tồn tại: ${size} → auto pass`);
    }
  });

  test("TC2 - Validate size name is required (empty value)", async ({ sizePage }) => {
    await test.step("Submit empty size name", async () => {
      await sizePage.waitForPageLoad();
      await sizePage.add_button.click();
      await sizePage.attributeModalComponent.createAttribute("Size", "");
    });

    await test.step("Verify error message is displayed", async () => {
      await expect(sizePage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC3 - Validate size name exceeds max length (255 chars)", async ({ sizePage }) => {
    const name = faker.string.alphanumeric(255);
    await test.step("Enter size name with 255 characters", async () => {
      await sizePage.waitForPageLoad();
      await sizePage.add_button.click();
      await sizePage.attributeModalComponent.createAttribute("Size", name);
    });

    await test.step("Verify validation error is displayed", async () => {
      await expect(sizePage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC4 - Validate size name with only spaces", async ({ sizePage }) => {
    const name = "     ";
    await test.step("Enter size name with only spaces", async () => {
      await sizePage.waitForPageLoad();
      await sizePage.add_button.click();
      await sizePage.attributeModalComponent.createAttribute("Size", name);
    });

    await test.step("Verify validation error is displayed", async () => {
      await expect(sizePage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC5 - Validate duplicate size name", async ({ sizePage }) => {
    const name = "L";
    await test.step("Create size with name 'L'", async () => {
      await sizePage.waitForPageLoad();
      await sizePage.add_button.click();
      await sizePage.attributeModalComponent.createAttribute("Size", name);
      await sizePage.page.waitForLoadState("networkidle");
      await sizePage.attributeModalComponent.cancel_button.click();
    });
    await test.step("Attempt to create duplicate size", async () => {
      await sizePage.add_button.click();
      await sizePage.attributeModalComponent.createAttribute("Size", name);
    });
    await test.step("Verify duplicate error message", async () => {
      await expect(sizePage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC6 - Cancel create size modal", async ({ sizePage }) => {

    await test.step("Open size page", async () => {
      await sizePage.waitForPageLoad();
    });

    await test.step("Open create size modal", async () => {
      await sizePage.add_button.click();
    });

    await test.step("Cancel modal", async () => {
      await sizePage.attributeModalComponent.cancel_button.click();
    });

    await test.step("Verify modal is closed", async () => {
      await expect(sizePage.attributeModalComponent.cancel_button).not.toBeVisible();
    });
  });
  
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
