import { test, expect } from '../../src/fixtures/testBase';
import usersData from '../../src/fixtures/users.json';
import { Logger } from '../../src/utils/logger';

test.describe('Authentication & User Session Suite', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('AUTH-01: Standard customer can successfully login with valid credentials', async ({ loginPage }) => {
    const validUser = usersData.validUsers[0];
    Logger.step(1, `Attempting login with ${validUser.email}`);
    await loginPage.login(validUser.email, validUser.password);

    await expect(loginPage.userGreeting).toBeVisible();
    await expect(loginPage.userGreeting).toHaveText(validUser.name);
    await expect(loginPage.logoutButton).toBeVisible();
  });

  test('AUTH-02: User sees error when submitting incorrect password', async ({ loginPage }) => {
    const invalidAttempt = usersData.invalidUsers[2];
    Logger.step(1, 'Attempting login with incorrect password');
    await loginPage.login(invalidAttempt.email, invalidAttempt.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toContain(invalidAttempt.expectedError);
  });

  test('AUTH-03: User can logout and clear session state', async ({ loginPage }) => {
    const validUser = usersData.validUsers[0];
    await loginPage.login(validUser.email, validUser.password);
    await expect(loginPage.logoutButton).toBeVisible();

    Logger.step(2, 'Logging out user');
    await loginPage.logout();
    await expect(loginPage.navLoginLink).toBeVisible();
    await expect(loginPage.userGreeting).not.toBeVisible();
  });
});
