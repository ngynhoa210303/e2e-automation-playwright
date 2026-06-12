import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();
import { faker } from '@faker-js/faker';

test.describe("Color Management - Create & Validation", { tag: "@create-color" }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_ADMIN_USERNAME!,
      process.env.TB_ADMIN_PASSWORD!,
    );
    await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/admin/dashboard`);
    await loginPage.menuBar.submenu.colors.click();
    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/attribute/color`,
    );
  });

  test("TC1 - Create new color if not exists", async ({ colorPage }) => {
    await colorPage.waitForPageLoad();
    const color = faker.color.human();
    await colorPage.color_searchInput.fill(color);
    await colorPage.color_searchInput.press('Enter');
    await colorPage.page.waitForLoadState('networkidle');
    const isEmpty = await colorPage.noResultsMessage.isVisible();

    if (isEmpty) {
      await colorPage.add_button.click();
      await colorPage.attributeModalComponent.createAttribute("Color", color);
      await expect(colorPage.toastMessage.success_message.first()).toBeVisible();
    } else {
      console.log(`Color đã tồn tại: ${color} → auto pass`);
    }
  });

  test("TC2 - Validate color name is required (empty value)", async ({ colorPage }) => {
    await test.step("Submit empty color name", async () => {
      await colorPage.waitForPageLoad();
      await colorPage.add_button.click();
      await colorPage.attributeModalComponent.createAttribute("Color", "");
    });

    await test.step("Verify error message is displayed", async () => {
      await expect(colorPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC3 - Validate color name exceeds max length (255 chars)", async ({ colorPage }) => {
    const name = faker.string.alphanumeric(255);
    await test.step("Enter Color name with 255 characters", async () => {
      await colorPage.waitForPageLoad();
      await colorPage.add_button.click();
      await colorPage.attributeModalComponent.createAttribute("Color", name);
    });

    await test.step("Verify validation error is displayed", async () => {
      await expect(colorPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC4 - Validate Color name with only spaces", async ({ colorPage }) => {
    const name = "     ";
    await test.step("Enter Color name with only spaces", async () => {
      await colorPage.waitForPageLoad();
      await colorPage.add_button.click();
      await colorPage.attributeModalComponent.createAttribute("Color", name);
    });

    await test.step("Verify validation error is displayed", async () => {
      await expect(colorPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC5 - Validate duplicate color name", async ({ colorPage }) => {
    const name = "Pagac - Braun";
    await test.step("Create Color with name 'Pagac - Braun'", async () => {
      await colorPage.waitForPageLoad();
      await colorPage.add_button.click();
      await colorPage.attributeModalComponent.createAttribute("Color", name);
      await colorPage.page.waitForLoadState("networkidle");
      await colorPage.attributeModalComponent.cancel_button.click();
    });
    await test.step("Attempt to create duplicate Color", async () => {
      await colorPage.add_button.click();
      await colorPage.attributeModalComponent.createAttribute("Color", name);
    });
    await test.step("Verify duplicate error message", async () => {
      await expect(colorPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC6 - Cancel create color modal", async ({ colorPage }) => {

    await test.step("Open color page", async () => {
      await colorPage.waitForPageLoad();
    });

    await test.step("Open create Color modal", async () => {
      await colorPage.add_button.click();
    });

    await test.step("Cancel modal", async () => {
      await colorPage.attributeModalComponent.cancel_button.click();
    });

    await test.step("Verify modal is closed", async () => {
      await expect(colorPage.attributeModalComponent.cancel_button).not.toBeVisible();
    });
  });
  
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
