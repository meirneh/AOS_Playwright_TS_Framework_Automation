import type { APIRequestContext, APIResponse } from '@playwright/test';

export default class AccountApiClient {
  constructor(protected readonly request: APIRequestContext) { }

  async registerUser(userData: {
    accountType: 'USER';
    address: string;
    allowOffersPromotion: boolean;
    aobUser: boolean;
    cityName: string;
    country: 'UNITED_STATES_US';
    email: string;
    firstName: string;
    lastName: string;
    loginName: string;
    password: string;
    phoneNumber: string;
    stateProvince: string;
    zipcode: string;
  }): Promise<APIResponse> {
    return this.request.post('/accountservice/accountrest/api/v1/register', {
      data: userData,
    });
  }

  async loginUser(credentials: {
    email: string;
    loginPassword: string;
    loginUser: string;
  }): Promise<APIResponse> {
    return this.request.post('/accountservice/accountrest/api/v1/login', {
      data: credentials,
    });
  }

  async deleteUser(accountId: number, token: string): Promise<APIResponse> {
    return this.request.delete('/accountservice/accountrest/api/v1/delete', {
      headers: { Authorization: `Bearer ${token}` },
      data: { accountId },
    });
  }
}
