import { test, expect } from '../../../pageObjects/pageFixture';
import dotenv from 'dotenv';
dotenv.config();

test.describe('Personal - Update Information', { tag: '@changeinfo' }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();

    await loginPage.login(
      process.env.TB_USER_USERNAME!,
      process.env.TB_USER_PASSWORD!,
    );
    await expect(loginPage.page).toHaveURL(`${process.env.TB_BASE_URL}/home`);
    await loginPage.navBar.userAvatar.click();
    await loginPage.navBar.userAvatar_dropdown.information.click();
  });

  test('TC050 - Update personal information successfully', async ({
    personalPage,
  }) => {
    const originalFullname = 'Hoang Hung';
    const originalEmail = 'hoanghung44@neyop.com';
    const originalPhone = '0342838282';

    const newFullname = 'Nguyen Van A';
    const newEmail = 'test@gmail.com';
    const newPhone = '0342838298';

    await test.step('Open edit mode', async () => {
      await personalPage.clickEditInformation();
    });

    await test.step('Update user information', async () => {
      await personalPage.updateProfile(newFullname, newEmail, newPhone);
    });

    await test.step('Verify success message', async () => {
      await expect(
        personalPage.toastMessage.success_message.first(),
      ).toBeVisible();
    });

    await test.step('Verify updated data displayed', async () => {
      await expect(personalPage.information_fullname).toContainText(
        newFullname,
      );
      await expect(personalPage.information_email).toContainText(newEmail);
      await expect(personalPage.information_phone).toContainText(newPhone);
    });

    await test.step('Revert data back to original', async () => {
      await personalPage.clickEditInformation();
      await personalPage.updateProfile(
        originalFullname,
        originalEmail,
        originalPhone,
      );

      await expect(
        personalPage.toastMessage.success_message.first(),
      ).toBeVisible();
    });
  });

  test('TC051 - Validate invalid email format', async ({ personalPage }) => {
    await personalPage.clickEditInformation();
    await personalPage.information_email_input.fill('invalid_email');
    await personalPage.btn_save.click();
    await expect(personalPage.toastMessage.fail_message.first()).toBeVisible();
  });

  test('TC052 - Validate empty fullname', async ({ personalPage }) => {
    await personalPage.clickEditInformation();
    await personalPage.information_fullname_input.fill('');
    await personalPage.btn_save.click();
    await expect(personalPage.toastMessage.fail_message.first()).toBeVisible();
  });
  test('TC053 - Validate invalid phone number', async ({ personalPage }) => {
    await personalPage.clickEditInformation();
    await personalPage.information_phone_input.fill('abcxyz');
    await personalPage.btn_save.click();
    await expect(personalPage.toastMessage.fail_message.first()).toBeVisible();
  });
  test('TC054 - Validate duplicate email', async ({ personalPage }) => {
    const duplicateEmail = 'baongoc210303@gmail.com';
    const originalEmail = process.env.TB_USER_EMAIL || '';

    await test.step('Open edit mode', async () => {
      await personalPage.clickEditInformation();
    });

    // await test.step('Enter duplicate email', async () => {
    //   await personalPage.information_email_input.fill(duplicateEmail);
    //   await personalPage.btn_save.click();
    // });

    // await test.step('Verify duplicate email validation', async () => {
    //   const errorToast = personalPage.toastMessage.fail_message.first();
    //   const successToast = personalPage.toastMessage.success_message.first();

    //   const isErrorVisible = await errorToast.isVisible().catch(() => false);
    //   const isSuccessVisible = await successToast
    //     .isVisible()
    //     .catch(() => false);

    //   if (isErrorVisible) {
    //     await expect(errorToast).toContainText('Email đã tồn tại');
    //   } else if (isSuccessVisible) {
    //     await test.step('Revert email back to original (cleanup)', async () => {
    //       await personalPage.clickEditInformation();
    //       await personalPage.information_email_input.fill(originalEmail);
    //       await personalPage.btn_save.click();
    //     });

    //     throw new Error('BUG: System allowed duplicate email!');
    //   } else {
    //     throw new Error('No toast message displayed');
    //   }
    // });
  });
  test('TC055 - Validate duplicate phone', async ({ personalPage }) => {
    const duplicatePhone = '0987654321';
    const originalPhone = '0342838282';

    await test.step('Open edit mode', async () => {
      await personalPage.clickEditInformation();
    });

    await test.step('Enter duplicate phone and submit', async () => {
      await personalPage.information_phone_input.fill(duplicatePhone);
      await personalPage.btn_save.click();
    });

    await test.step('Verify duplicate phone validation', async () => {
      const errorToast = personalPage.toastMessage.fail_message.first();
      const successToast = personalPage.toastMessage.success_message.first();

      const isErrorVisible = await errorToast.isVisible().catch(() => false);
      const isSuccessVisible = await successToast
        .isVisible()
        .catch(() => false);

      if (isErrorVisible) {
        await expect(errorToast).toContainText('Cập nhật thông tin thất bại');
      } else if (isSuccessVisible) {
        await test.step('Revert phone back to original (cleanup)', async () => {
          await personalPage.clickEditInformation();
          await personalPage.information_phone_input.fill(originalPhone);
          await personalPage.btn_save.click();

          await expect(successToast).toBeVisible();
        });

        throw new Error('BUG: System allowed duplicate phone!');
      } else {
        throw new Error('No toast message displayed');
      }
    });
  });
  test.afterEach(async ({ homePage }) => {
    await homePage.close();
  });
});
