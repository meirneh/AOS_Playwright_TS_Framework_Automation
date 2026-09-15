import { expect, test } from '@playwright/test';
import AccountApiClient from '../../api/clients/AccountApiClient';
import {
  API_USERS,
  generateInvalidApiUser,
  generateUniqueApiUser,
} from '../../api/test-data/users.data';

test.describe('Account API: TC-099 to TC-102', () => {
  test('TC-099: Register User Through API', async ({ request }) => {
    test.info().annotations.push(
      { type: 'feature', description: 'Account API' },
      { type: 'story', description: 'Register user' },
      { type: 'tag', description: 'FR-102' },
    );

    const accountApiClient = new AccountApiClient(request);
    const user = await test.step('Generate unique disposable account data', async () => {
      return generateUniqueApiUser();
    });

    const registrationResponse = await test.step('Register the user through API', async () => {
      return accountApiClient.registerUser(user);
    });

    await test.step('Verify the registration response', async () => {
      const registrationStatus = registrationResponse.status();
      const registrationBody = await registrationResponse.text();

      if (!registrationResponse.ok()) {
        throw new Error(
          `Registration failed with status ${registrationStatus}: ${registrationBody}`,
        );
      }

      const registrationResponseBody = JSON.parse(registrationBody);
      const registrationResult = registrationResponseBody.response;

      expect(registrationResult).toBeDefined();
      expect(registrationResult.success).toBe(true);
      expect(registrationResult.userId).toEqual(expect.any(Number));
      expect(registrationResult.userId).toBeGreaterThan(0);
      expect(registrationResult.reason).toEqual(expect.any(String));
      expect(registrationResult.reason.trim()).not.toBe('');
    });
  });

  test('TC-100: Authenticate Valid User Through API', async ({ request }) => {
    test.info().annotations.push(
      { type: 'feature', description: 'Account API' },
      { type: 'story', description: 'Authenticate valid user' },
      { type: 'tag', description: 'FR-103' },
    );

    const accountApiClient = new AccountApiClient(request);
    const user = await test.step('Load the existing valid API user', async () => {
      return API_USERS.existingUser;
    });

    const loginResponse = await test.step('Authenticate the user through API', async () => {
      return accountApiClient.loginUser({
        email: user.email,
        loginPassword: user.password,
        loginUser: user.username,
      });
    });

    await test.step('Verify the login response', async () => {
      const loginStatus = loginResponse.status();
      const loginBody = await loginResponse.text();

      if (!loginResponse.ok()) {
        throw new Error(
          `Login failed with status ${loginStatus}: ${loginBody}`,
        );
      }

      const loginResponseBody = JSON.parse(loginBody);
      const statusMessage = loginResponseBody.statusMessage;

      expect(statusMessage).toBeDefined();
      expect(statusMessage.success).toBe(true);
      expect(statusMessage.token).toEqual(expect.any(String));
      expect(statusMessage.token.trim()).not.toBe('');
      expect(statusMessage.userId).toEqual(expect.any(Number));
      expect(statusMessage.userId).toBeGreaterThan(0);
    });
  });

  test('TC-101: Reject Invalid API Authentication', async ({ request }) => {
    test.info().annotations.push(
      { type: 'feature', description: 'Account API' },
      { type: 'story', description: 'Reject invalid authentication' },
      { type: 'tag', description: 'FR-104' },
    );

    const accountApiClient = new AccountApiClient(request);
    const user = await test.step('Load the invalid API user', async () => {
      return generateInvalidApiUser();
    });

    const loginResponse = await test.step('Attempt authentication through API', async () => {
      return accountApiClient.loginUser({
        email: user.email,
        loginPassword: user.password,
        loginUser: user.username,
      });
    });

    await test.step('Verify the authentication rejection', async () => {
      const loginStatus = loginResponse.status();
      const loginBody = await loginResponse.text();
      const loginResponseBody = JSON.parse(loginBody);
      const statusMessage = loginResponseBody.statusMessage;
      const hasValidToken = (
        typeof statusMessage?.token === 'string'
        && statusMessage.token.trim() !== ''
      );

      expect(
        loginResponse.ok() && statusMessage?.success === true,
        `Invalid credentials unexpectedly authenticated with status ${loginStatus}: ${loginBody}`,
      ).toBe(false);

      if (statusMessage) {
        expect(statusMessage.success).not.toBe(true);
      }

      expect(
        hasValidToken,
        `Invalid credentials returned a valid session token with status ${loginStatus}: ${loginBody}`,
      ).toBe(false);
    });
  });
});
