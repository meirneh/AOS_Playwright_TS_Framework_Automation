import type { APIRequestContext, APIResponse } from '@playwright/test';

export default class CatalogApiClient {
  constructor(protected readonly request: APIRequestContext) { }

  async getProducts(): Promise<APIResponse> {
    return this.request.get('/catalog/api/v1/products');
  }

  async getProductById(productId: number): Promise<APIResponse> {
    return this.request.get(`/catalog/api/v1/products/${productId}`);
  }

  async searchProducts(searchTerm: string): Promise<APIResponse> {
    return this.request.get('/catalog/api/v1/products/search', {
      params: { name: searchTerm },
    });
  }

  async getCategories(): Promise<APIResponse> {
    return this.request.get('/catalog/api/v1/categories');
  }
}
