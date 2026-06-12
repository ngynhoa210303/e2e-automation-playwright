import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();
import { faker } from '@faker-js/faker';

test.describe("Collar Management - Create & Validation", { tag: ['@create-collar', '@collar', '@smoke1'] }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_ADMIN_USERNAME!,
      process.env.TB_ADMIN_PASSWORD!,
    );
    await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/admin/dashboard`);
    await loginPage.menuBar.submenu.collars.click();
    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/attribute/collar`,
    );
  });

  test("Collar01 - Create new collar if not exists", async ({ collarPage }) => {
    await collarPage.waitForPageLoad();
    const collar = "Cổ cài nút";
    await collarPage.collar_searchInput.fill(collar);
    await collarPage.collar_searchInput.press('Enter');
    await collarPage.page.waitForLoadState('networkidle');
    const isEmpty = await collarPage.noResultsMessage.isVisible();

    if (isEmpty) {
      await collarPage.add_button.click();
      await collarPage.attributeModalComponent.createAttribute("Collar", collar);
      await expect(collarPage.toastMessage.success_message.first()).toBeVisible();
    } else {
      console.log(`Collar already exists: ${collar} → auto pass`);
    }
  });

  test("Collar02 - Validate collar name is required (empty value)", async ({ collarPage }) => {
    await test.step("Submit empty collar name", async () => {
      await collarPage.waitForPageLoad();
      await collarPage.add_button.click();
      await collarPage.attributeModalComponent.createAttribute("Collar", "");
    });

    await test.step("Verify error message is displayed", async () => {
      await expect(collarPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("Collar03 - Validate collar name exceeds max length (255 chars)", async ({ collarPage }) => {
    const name = faker.string.alphanumeric(255);
    await test.step("Enter collar name with 255 characters", async () => {
      await collarPage.waitForPageLoad();
      await collarPage.add_button.click();
      await collarPage.attributeModalComponent.createAttribute("Collar", name);
    });

    await test.step("Verify validation error is displayed", async () => {
      await expect(collarPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("Collar04 - Validate collar name with only spaces", async ({ collarPage }) => {
    const name = "     ";
    await test.step("Enter collar name with only spaces", async () => {
      await collarPage.waitForPageLoad();
      await collarPage.add_button.click();
      await collarPage.attributeModalComponent.createAttribute("Collar", name);
    });

    await test.step("Verify validation error is displayed", async () => {
      await expect(collarPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("Collar05 - Validate duplicate collar name", async ({ collarPage }) => {
    const name = "Cổ cài nút";
    await test.step("Create collar with name 'Cổ cài nút'", async () => {
      await collarPage.waitForPageLoad();
      await collarPage.add_button.click();
      await collarPage.attributeModalComponent.createAttribute("Collar", name);
      await collarPage.page.waitForLoadState("networkidle");
      await collarPage.attributeModalComponent.cancel_button.click();
    });
    await test.step("Attempt to create duplicate collar", async () => {
      await collarPage.add_button.click();
      await collarPage.attributeModalComponent.createAttribute("Collar", name);
    });
    await test.step("Verify duplicate error message", async () => {
      await expect(collarPage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("Collar06 - Cancel create collar modal", async ({ collarPage }) => {

    await test.step("Open collar page", async () => {
      await collarPage.waitForPageLoad();
    });

    await test.step("Open create collar modal", async () => {
      await collarPage.add_button.click();
    });

    await test.step("Cancel modal", async () => {
      await collarPage.attributeModalComponent.cancel_button.click();
    });

    await test.step("Verify modal is closed", async () => {
      await expect(collarPage.attributeModalComponent.cancel_button).not.toBeVisible();
    });
  });
  
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
