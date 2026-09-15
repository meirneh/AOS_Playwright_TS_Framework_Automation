import type { APIRequestContext, APIResponse } from '@playwright/test';

export default class OrderApiClient {
  constructor(protected readonly request: APIRequestContext) { }

  async getUserCart(userId: number, token: string): Promise<APIResponse> {
    return this.request.get(`/order/api/v1/carts/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async clearUserCart(userId: number, token: string): Promise<APIResponse> {
    return this.request.delete(`/order/api/v1/carts/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async addProductToCart(
    userId: number,
    productId: number,
    color: string,
    quantity: number,
    token: string,
  ): Promise<APIResponse> {
    return this.request.post(
      `/order/api/v1/carts/${userId}/product/${productId}/color/${color}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          quantity,
          hasWarranty: false,
        },
      },
    );
  }

  async updateCartProduct(
    userId: number,
    productId: number,
    color: string,
    quantity: number,
    token: string,
  ): Promise<APIResponse> {
    return this.request.put(
      `/order/api/v1/carts/${userId}/product/${productId}/color/${color}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          quantity,
        },
      },
    );
  }

  async removeProductFromCart(
    userId: number,
    productId: number,
    color: string,
    token: string,
  ): Promise<APIResponse> {
    return this.request.delete(
      `/order/api/v1/carts/${userId}/product/${productId}/color/${color}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  async getUserOrderHistory(userId: number): Promise<APIResponse> {
    return this.request.get('/order/api/v1/orders/history', {
      params: {
        user_id: userId,
      },
    });
  }

  async calculateShippingCost(shippingData: {
    seaddress: {
      addressLine1: string;
      addressLine2: string;
      city: string;
      country: string;
      postalCode: string;
      state: string;
    };
    secustomerName: string;
    secustomerPhone: string;
    senumberOfProducts: number;
    setransactionType: 'SHIPPING_COST';
  }): Promise<APIResponse> {
    return this.request.post('/order/api/v1/shippingcost', {
      data: shippingData,
    });
  }
}
