import { test, expect } from "../../../pageObjects/pageFixture";
import dotenv from "dotenv";
dotenv.config();
import { faker } from '@faker-js/faker';

test.describe("sleeve Management - Create & Validation", { tag: "@sleeve" }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(
      process.env.TB_ADMIN_USERNAME!,
      process.env.TB_ADMIN_PASSWORD!,
    );
    await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/admin/dashboard`);
    await loginPage.menuBar.submenu.sleeves.click();
    await expect(loginPage.page).toHaveURL(
      `${process.env.TB_BASE_URL}/admin/attribute/sleeve`,
    );
  });

  test("TC1 - Create new sleeve if not exists", async ({ sleevePage }) => {
    await sleevePage.waitForPageLoad();
    const sleeve = faker.company.name();
    await sleevePage.sleeve_searchInput.fill(sleeve);
    await sleevePage.sleeve_searchInput.press('Enter');
    await sleevePage.page.waitForLoadState('networkidle');
    const isEmpty = await sleevePage.noResultsMessage.isVisible();

    if (isEmpty) {
      await sleevePage.add_button.click();
      await sleevePage.attributeModalComponent.createAttribute("Sleeve", sleeve);
      await expect(sleevePage.toastMessage.success_message.first()).toBeVisible();
    } else {
      console.log(`sleeve đã tồn tại: ${sleeve} → auto pass`);
    }
  });

  test("TC2 - Validate sleeve name is required (empty value)", async ({ sleevePage }) => {
    await test.step("Submit empty sleeve name", async () => {
      await sleevePage.waitForPageLoad();
      await sleevePage.add_button.click();
      await sleevePage.attributeModalComponent.createAttribute("Sleeve", "");
    });

    await test.step("Verify error message is displayed", async () => {
      await expect(sleevePage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC3 - Validate sleeve name exceeds max length (255 chars)", async ({ sleevePage }) => {
    const name = faker.string.alphanumeric(255);
    await test.step("Enter sleeve name with 255 characters", async () => {
      await sleevePage.waitForPageLoad();
      await sleevePage.add_button.click();
      await sleevePage.attributeModalComponent.createAttribute("Sleeve", name);
    });

    await test.step("Verify validation error is displayed", async () => {
      await expect(sleevePage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC4 - Validate sleeve name with only spaces", async ({ sleevePage }) => {
    const name = "     ";
    await test.step("Enter sleeve name with only spaces", async () => {
      await sleevePage.waitForPageLoad();
      await sleevePage.add_button.click();
      await sleevePage.attributeModalComponent.createAttribute("Sleeve", name);
    });

    await test.step("Verify validation error is displayed", async () => {
      await expect(sleevePage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC5 - Validate duplicate sleeve name", async ({ sleevePage }) => {
    const name = "Tay phồng nhẹ";
    await test.step("Create sleeve with name 'Tay phồng nhẹ'", async () => {
      await sleevePage.waitForPageLoad();
      await sleevePage.add_button.click();
      await sleevePage.attributeModalComponent.createAttribute("Sleeve", name);
      await sleevePage.page.waitForLoadState("networkidle");
      await sleevePage.attributeModalComponent.cancel_button.click();
    });
    await test.step("Attempt to create duplicate sleeve", async () => {
      await sleevePage.add_button.click();
      await sleevePage.attributeModalComponent.createAttribute("Sleeve", name);
    });
    await test.step("Verify duplicate error message", async () => {
      await expect(sleevePage.toastMessage.fail_message.first()).toBeVisible();
    });
  });

  test("TC6 - Cancel create sleeve modal", async ({ sleevePage }) => {

    await test.step("Open sleeve page", async () => {
      await sleevePage.waitForPageLoad();
    });

    await test.step("Open create sleeve modal", async () => {
      await sleevePage.add_button.click();
    });

    await test.step("Cancel modal", async () => {
      await sleevePage.attributeModalComponent.cancel_button.click();
    });

    await test.step("Verify modal is closed", async () => {
      await expect(sleevePage.attributeModalComponent.cancel_button).not.toBeVisible();
    });
  });
  
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
