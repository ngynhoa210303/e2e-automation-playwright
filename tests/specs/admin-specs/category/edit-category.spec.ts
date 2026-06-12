import { test, expect } from '../../../pageObjects/pageFixture';
import dotenv from 'dotenv';
dotenv.config();
import { faker } from '@faker-js/faker';
import brandPage from '../../../pageObjects/pages/admin/category.page';

test.describe(
  'Category Management - Update',
  { tag: ['@update-category', '@category', '@smoke1'] },
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

      await loginPage.menuBar.submenu.categories.click();

      await expect(loginPage.page).toHaveURL(
        `${process.env.TB_BASE_URL}/admin/category`,
      );
    });

    async function createCategoryIfNotExists(categoryPage: any, name: string) {
      await categoryPage.category_searchInput.fill(name);
      await categoryPage.category_searchInput.press('Enter');
      await categoryPage.page.waitForLoadState('networkidle');
      const isEmpty = await categoryPage.noResultsMessage.isVisible();
      if (isEmpty) {
        await categoryPage.add_button.click();
        await categoryPage.attributeModalComponent.createAttribute(
          'Danh Mục',
          name,
        );
        await expect(
          categoryPage.toastMessage.success_message.first(),
        ).toBeVisible();
        await expect(categoryPage.toastMessage.success_message).toBeHidden();
      }
    }

    test('CT07 - Update category name successfully', async ({
      categoryPage,
    }) => {
      const oldName = faker.commerce.department();
      const newName = `Category_${faker.string.alphanumeric(5)}`;

      await test.step('Prepare category data', async () => {
        await categoryPage.waitForPageLoad();
        await createCategoryIfNotExists(categoryPage, oldName);
      });

      await test.step('Search and open edit modal', async () => {
        await categoryPage.category_searchInput.fill(oldName);
        await categoryPage.category_searchInput.press('Enter');
        await categoryPage.page.waitForLoadState('networkidle');
        await categoryPage.getEditButtonByName(oldName).click();
      });

      await test.step('Update category name', async () => {
        await categoryPage.attributeModalComponent.updateAttribute(
          'Danh Mục',
          newName,
        );
      });

      await test.step('Verify update success', async () => {
        await expect(
          categoryPage.toastMessage.success_message.first(),
        ).toBeVisible();
        await expect(categoryPage.toastMessage.success_message).toBeHidden();
        await categoryPage.category_searchInput.fill(newName);
        await categoryPage.category_searchInput.press('Enter');
        await categoryPage.page.waitForLoadState('networkidle');
        await expect(categoryPage.getRowByName(newName)).toBeVisible();
      });
      await test.step('Revert Update', async () => {
        await categoryPage.category_searchInput.fill(newName);
        await categoryPage.category_searchInput.press('Enter');
        await categoryPage.page.waitForLoadState('networkidle');
        await categoryPage.getEditButtonByName(newName).click();
        await categoryPage.attributeModalComponent.updateAttribute(
          'Danh Mục',
          oldName,
        );
      });
    });

    test('CT08 - Validate update with empty name', async ({
      categoryPage,
    }) => {
      const name = "Áo Cardigan"

      await test.step('Prepare category', async () => {
        await categoryPage.waitForPageLoad();
        await createCategoryIfNotExists(categoryPage, name);
      });

      await test.step('Open edit modal', async () => {
        await categoryPage.category_searchInput.fill(name);
        await categoryPage.category_searchInput.press('Enter');
        await categoryPage.getEditButtonByName(name).click();
      });

      await test.step('Submit empty name', async () => {
        await categoryPage.attributeModalComponent.updateAttribute(
          'Danh Mục',
          '',
        );
      });

      await test.step('Verify error message', async () => {
        await expect(
          categoryPage.toastMessage.fail_message.first(),
        ).toBeVisible();
      });
    });

    test('CT09 - Validate update with duplicate name', async ({
      categoryPage,
    }) => {
      const name1 = "Áo Gió";
      const name2 = "Áo Tank Top";

      await test.step('Prepare 2 categories', async () => {
        await categoryPage.waitForPageLoad();
        await createCategoryIfNotExists(categoryPage, name1);
        await createCategoryIfNotExists(categoryPage, name2);
      });

      await test.step('Edit category to duplicate name', async () => {
        await categoryPage.category_searchInput.fill(name2);
        await categoryPage.category_searchInput.press('Enter');

        await categoryPage.getEditButtonByName(name2).click();
        await categoryPage.attributeModalComponent.updateAttribute(
          'Danh Mục',
          name1,
        );
      });

      await test.step('Verify duplicate error', async () => {
        await expect(
          categoryPage.toastMessage.fail_message.first(),
        ).toBeVisible();
      });
    });

    test('CT010 - Verify updated category persists after reload', async ({
      categoryPage,
    }) => {
      const oldName = "Áo Oxford"
      const newName = `Category_${faker.string.alphanumeric(5)}`;

      await test.step('Prepare category', async () => {
        await categoryPage.waitForPageLoad();
        await createCategoryIfNotExists(categoryPage, oldName);
      });

      await test.step('Update category', async () => {
        await categoryPage.category_searchInput.fill(oldName);
        await categoryPage.category_searchInput.press('Enter');
        await categoryPage.getEditButtonByName(oldName).click();
        await categoryPage.attributeModalComponent.updateAttribute(
          'Danh Mục',
          newName,
        );
        await expect(
          categoryPage.toastMessage.success_message.first(),
        ).toBeVisible();
        await expect(categoryPage.toastMessage.success_message).toBeHidden();
      });

      await test.step('Reload page', async () => {
        await categoryPage.page.reload();
        await categoryPage.waitForPageLoad();
      });

      await test.step('Verify updated data still exists', async () => {
        await categoryPage.category_searchInput.fill(newName);
        await categoryPage.category_searchInput.press('Enter');

        await expect(categoryPage.getRowByName(newName)).toBeVisible();
      });
      await test.step('Revert Update', async () => {
        await categoryPage.category_searchInput.fill(newName);
        await categoryPage.category_searchInput.press('Enter');
        await categoryPage.page.waitForLoadState('networkidle');
        await categoryPage.getEditButtonByName(newName).click();
        await categoryPage.attributeModalComponent.updateAttribute(
          'Danh Mục',
          oldName,
        );
      });
    });

    test('CT011 - Toggle category status successfully', async ({ categoryPage }) => {
      let oldStatus: string | null;
      let newStatus: string | null;
      const name = 'Áo thể thao thoáng khí';

      await test.step('Open category page and search item', async () => {
        await categoryPage.waitForPageLoad();

        await categoryPage.category_searchInput.fill(name);
        await categoryPage.category_searchInput.press('Enter');
      });

      await test.step('Get current status of toggle', async () => {
        const toggleInput = categoryPage.getToggleByName(name).first();
        oldStatus = await toggleInput.getAttribute('aria-checked');
      });

      await test.step('Toggle category status', async () => {
        const toggleInput = categoryPage.getToggleByName(name).first();
        const toggle = toggleInput.locator('xpath=ancestor::div[1]');
        await toggle.click();
      });

      await test.step('Verify success toast appears with correct message', async () => {
        const toast = categoryPage.toastMessage.success_message.first();
        await expect(toast).toBeVisible();
        await expect(toast).toContainText(
          'Thay đổi trạng thái thành công',
        );
      });

      await test.step('Verify toast disappears', async () => {
        await expect(categoryPage.toastMessage.success_message).toBeHidden();
      });

      await test.step('Verify toggle status is updated', async () => {
        const toggleInput = categoryPage.getToggleByName(name).first();

        await expect(async () => {
          newStatus = await toggleInput.getAttribute('aria-checked');
          expect(newStatus).not.toBe(oldStatus);
        }).toPass();
      });
    });

    test('CT012 - Verify category status persists after reload', async ({
      categoryPage,
    }) => {
      let oldStatus: string | null;
      let newStatus: string | null;
      let statusAfterReload: string | null;
      const name = 'Áo hoodie';

      await test.step('Open category page and search item', async () => {
        await categoryPage.waitForPageLoad();

        await categoryPage.category_searchInput.fill(name);
        await categoryPage.category_searchInput.press('Enter');
      });

      await test.step('Get current toggle status', async () => {
        const toggleInput = categoryPage.getToggleByName(name).first();
        oldStatus = await toggleInput.getAttribute('aria-checked');
      });

      await test.step('Toggle category status', async () => {
        const toggleInput = categoryPage.getToggleByName(name).first();
        const toggle = toggleInput.locator('xpath=ancestor::div[1]');

        await toggle.click();

        await expect(
          categoryPage.toastMessage.success_message.first(),
        ).toBeVisible();
      });

      await test.step('Verify status changed after toggle', async () => {
        const toggleInput = categoryPage.getToggleByName(name).first();

        await expect(async () => {
          newStatus = await toggleInput.getAttribute('aria-checked');
          expect(newStatus).not.toBe(oldStatus);
        }).toPass();
      });

      await test.step('Reload page', async () => {
        await categoryPage.page.reload();
        await categoryPage.waitForPageLoad();
      });

      await test.step('Search item again after reload', async () => {
        await categoryPage.category_searchInput.fill(name);
        await categoryPage.category_searchInput.press('Enter');
      });

      await test.step('Verify status persisted after reload', async () => {
        const toggleInput = categoryPage.getToggleByName(name).first();
        statusAfterReload = await toggleInput.getAttribute('aria-checked');

        expect(statusAfterReload).toBe(newStatus);
      });
      await test.step('Restore original status', async () => {
        if (newStatus !== oldStatus) {
          const toggleInput = categoryPage.getToggleByName(name).first();
          const toggle = toggleInput.locator('xpath=ancestor::div[1]');

          await toggle.click();

          await expect(
            categoryPage.toastMessage.success_message.first(),
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
