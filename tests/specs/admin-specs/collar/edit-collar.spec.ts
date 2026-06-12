import { test, expect } from '../../../pageObjects/pageFixture';
import dotenv from 'dotenv';
dotenv.config();
import { faker } from '@faker-js/faker';

test.describe(
  'Collar Management - Update',
  { tag: ['@update-collar', '@collar', '@smoke1'] },
  () => {
    test.beforeEach(async ({ loginPage }) => {
      await loginPage.open();
      await loginPage.login(
        process.env.TB_ADMIN_USERNAME!,
        process.env.TB_ADMIN_PASSWORD!,
      );

      await expect(loginPage.page).toHaveURL(
        `${process.env.TB_BASE_URL}/admin/dashboard`,
      );

      await loginPage.menuBar.submenu.collars.click();

      await expect(loginPage.page).toHaveURL(
        `${process.env.TB_BASE_URL}/admin/attribute/collar`,
      );
    });

    async function createCollarIfNotExists(collarPage: any, name: string) {
      await collarPage.collar_searchInput.fill(name);
      await collarPage.collar_searchInput.press('Enter');
      await collarPage.page.waitForLoadState('networkidle');
      const isEmpty = await collarPage.noResultsMessage.isVisible();
      if (isEmpty) {
        await collarPage.add_button.click();
        await collarPage.attributeModalComponent.createAttribute(
          'Collar',
          name,
        );
        await expect(
          collarPage.toastMessage.success_message.first(),
        ).toBeVisible();
        await expect(collarPage.toastMessage.success_message).toBeHidden();
      }
    }

    test('Collar07 - Update collar name successfully', async ({
      collarPage,
    }) => {
      const oldName = "Cổ Vuông";
      const newName = `Collar_${faker.string.alphanumeric(5)}`;

      await test.step('Prepare collar data', async () => {
        await collarPage.waitForPageLoad();
        await createCollarIfNotExists(collarPage, oldName);
      });

      await test.step('Search and open edit modal', async () => {
        await collarPage.collar_searchInput.fill(oldName);
        await collarPage.collar_searchInput.press('Enter');
        await collarPage.page.waitForLoadState('networkidle');
        await collarPage.getEditButtonByName(oldName).click();
      });

      await test.step('Update collar name', async () => {
        await collarPage.attributeModalComponent.updateAttribute(
          'Collar',
          newName,
        );
      });

      await test.step('Verify update success', async () => {
        await expect(
          collarPage.toastMessage.success_message.first(),
        ).toBeVisible();
        await expect(collarPage.toastMessage.success_message).toBeHidden();
        await collarPage.collar_searchInput.fill(newName);
        await collarPage.collar_searchInput.press('Enter');
        await collarPage.page.waitForLoadState('networkidle');
        await expect(collarPage.getRowByName(newName)).toBeVisible();
      });
      await test.step('Revert Update', async () => {
        await collarPage.collar_searchInput.fill(newName);
        await collarPage.collar_searchInput.press('Enter');
        await collarPage.page.waitForLoadState('networkidle');
        await collarPage.getEditButtonByName(newName).click();
        await collarPage.attributeModalComponent.updateAttribute(
          'Collar',
          oldName,
        );
      });
    });

    test('Collar08 - Validate update with empty name', async ({
      collarPage,
    }) => {
      const name = "Cổ chữ V";

      await test.step('Prepare collar data', async () => {
        await collarPage.waitForPageLoad();
        await createCollarIfNotExists(collarPage, name);
      });

      await test.step('Open edit modal', async () => {
        await collarPage.collar_searchInput.fill(name);
        await collarPage.collar_searchInput.press('Enter');
        await collarPage.getEditButtonByName(name).click();
      });

      await test.step('Submit empty name', async () => {
        await collarPage.attributeModalComponent.updateAttribute(
          'Collar',
          '',
        );
      });

      await test.step('Verify error message', async () => {
        await expect(
          collarPage.toastMessage.fail_message.first(),
        ).toBeVisible();
      });
    });

    test('Collar09 - Validate update with duplicate name', async ({
      collarPage,
    }) => {
      const name1 = "Cổ cài nút";
      const name2 = "Cổ chữ V";

      await test.step('Prepare 2 collars', async () => {
        await collarPage.waitForPageLoad();
        await createCollarIfNotExists(collarPage, name1);
        await createCollarIfNotExists(collarPage, name2);
      });

      await test.step('Edit collar to duplicate name', async () => {
        await collarPage.collar_searchInput.fill(name2);
        await collarPage.collar_searchInput.press('Enter');

        await collarPage.getEditButtonByName(name2).click();
        await collarPage.attributeModalComponent.updateAttribute(
          'Collar',
          name1,
        );
      });

      await test.step('Verify duplicate error', async () => {
        await expect(
          collarPage.toastMessage.fail_message.first(),
        ).toBeVisible();
      });
    });

    test('Collar10 - Verify updated collar persists after reload', async ({
      collarPage,
    }) => {
      const oldName = "Cổ tròn"
      const newName = `collar_${faker.string.alphanumeric(5)}`;

      await test.step('Prepare collar', async () => {
        await collarPage.waitForPageLoad();
        await createCollarIfNotExists(collarPage, oldName);
      });

      await test.step('Update collar', async () => {
        await collarPage.collar_searchInput.fill(oldName);
        await collarPage.collar_searchInput.press('Enter');
        await collarPage.getEditButtonByName(oldName).click();
        await collarPage.attributeModalComponent.updateAttribute(
          'Collar',
          newName,
        );
        await expect(
          collarPage.toastMessage.success_message.first(),
        ).toBeVisible();
        await expect(collarPage.toastMessage.success_message).toBeHidden();
      });

      await test.step('Reload page', async () => {
        await collarPage.page.reload();
        await collarPage.waitForPageLoad();
      });

      await test.step('Verify updated data still exists', async () => {
        await collarPage.collar_searchInput.fill(newName);
        await collarPage.collar_searchInput.press('Enter');

        await expect(collarPage.getRowByName(newName)).toBeVisible();
      });
      await test.step('Revert Update', async () => {
        await collarPage.collar_searchInput.fill(newName);
        await collarPage.collar_searchInput.press('Enter');
        await collarPage.page.waitForLoadState('networkidle');
        await collarPage.getEditButtonByName(newName).click();
        await collarPage.attributeModalComponent.updateAttribute(
          'Collar',
          oldName,
        );
      });
    });

    test('Collar11 - Toggle brand status successfully', async ({ collarPage }) => {
      let oldStatus: string | null;
      let newStatus: string | null;
      const name = 'Cổ tim';

      await test.step('Open brand page and search item', async () => {
        await collarPage.waitForPageLoad();

        await collarPage.collar_searchInput.fill(name);
        await collarPage.collar_searchInput.press('Enter');
      });

      await test.step('Get current status of toggle', async () => {
        const toggleInput = collarPage.getToggleByName(name).first();
        oldStatus = await toggleInput.getAttribute('aria-checked');
      });

      await test.step('Toggle brand status', async () => {
        const toggleInput = collarPage.getToggleByName(name).first();
        const toggle = toggleInput.locator('xpath=ancestor::div[1]');
        await toggle.click();
      });

      await test.step('Verify success toast appears with correct message', async () => {
        const toast = collarPage.toastMessage.success_message.first();
        await expect(toast).toBeVisible();
        await expect(toast).toContainText(
          'Thay đổi trạng thái thành công',
        );
      });

      await test.step('Verify toast disappears', async () => {
        await expect(collarPage.toastMessage.success_message).toBeHidden();
      });

      await test.step('Verify toggle status is updated', async () => {
        const toggleInput = collarPage.getToggleByName(name).first();

        await expect(async () => {
          newStatus = await toggleInput.getAttribute('aria-checked');
          expect(newStatus).not.toBe(oldStatus);
        }).toPass();
      });
    });

    test('Collar12 - Verify brand status persists after reload', async ({
      collarPage,
    }) => {
      let oldStatus: string | null;
      let newStatus: string | null;
      let statusAfterReload: string | null;
      const name = 'Cổ thun';

      await test.step('Open brand page and search item', async () => {
        await collarPage.waitForPageLoad();

        await collarPage.collar_searchInput.fill(name);
        await collarPage.collar_searchInput.press('Enter');
      });

      await test.step('Get current toggle status', async () => {
        const toggleInput = collarPage.getToggleByName(name).first();
        oldStatus = await toggleInput.getAttribute('aria-checked');
      });

      await test.step('Toggle brand status', async () => {
        const toggleInput = collarPage.getToggleByName(name).first();
        const toggle = toggleInput.locator('xpath=ancestor::div[1]');

        await toggle.click();

        await expect(
          collarPage.toastMessage.success_message.first(),
        ).toBeVisible();
      });

      await test.step('Verify status changed after toggle', async () => {
        const toggleInput = collarPage.getToggleByName(name).first();

        await expect(async () => {
          newStatus = await toggleInput.getAttribute('aria-checked');
          expect(newStatus).not.toBe(oldStatus);
        }).toPass();
      });

      await test.step('Reload page', async () => {
        await collarPage.page.reload();
        await collarPage.waitForPageLoad();
      });

      await test.step('Search item again after reload', async () => {
        await collarPage.collar_searchInput.fill(name);
        await collarPage.collar_searchInput.press('Enter');
      });

      await test.step('Verify status persisted after reload', async () => {
        const toggleInput = collarPage.getToggleByName(name).first();
        statusAfterReload = await toggleInput.getAttribute('aria-checked');

        expect(statusAfterReload).toBe(newStatus);
      });
      await test.step('Restore original status', async () => {
        if (newStatus !== oldStatus) {
          const toggleInput = collarPage.getToggleByName(name).first();
          const toggle = toggleInput.locator('xpath=ancestor::div[1]');

          await toggle.click();

          await expect(
            collarPage.toastMessage.success_message.first(),
          ).toBeVisible();

          await expect(async () => {
            const currentStatus =
              await toggleInput.getAttribute('aria-checked');
            expect(currentStatus).toBe(oldStatus);
          }).toPass();
        }
      });
    });
    test.afterEach(async ({ homePage }) => {
      await homePage.close();
    });
  },
);
