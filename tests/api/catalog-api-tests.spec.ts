import { expect, test } from '@playwright/test';
import CatalogApiClient from '../../api/clients/CatalogApiClient';

test.describe('Catalog API: TC-095 to TC-098', () => {
  test('TC-095: Retrieve Product Catalog Through API', async ({ request }) => {
    test.info().annotations.push(
      { type: 'feature', description: 'Catalog API' },
      { type: 'story', description: 'Retrieve product catalog' },
      { type: 'tag', description: 'FR-098' },
    );

    const catalogApiClient = new CatalogApiClient(request);

    const response = await test.step('Retrieve the product catalog through API', async () => {
      return catalogApiClient.getProducts();
    });

    await test.step('Verify the API response is successful', async () => {
      expect(response.ok()).toBeTruthy();
    });

    await test.step('Verify the product catalog contains valid product data', async () => {
      const responseBody = await response.json();

      expect(responseBody).toHaveProperty('products');
      expect(Array.isArray(responseBody.products)).toBeTruthy();
      expect(responseBody.products.length).toBeGreaterThan(0);

      for (const product of responseBody.products) {
        expect(product.productId).toEqual(expect.any(Number));
        expect(product.productId).toBeGreaterThan(0);
        expect(product.productName).toEqual(expect.any(String));
        expect(product.productName.trim()).not.toBe('');
        expect(product.price).toEqual(expect.any(Number));
        expect(product.price).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test('TC-096: Retrieve Product Details Through API', async ({ request }) => {
    test.info().annotations.push(
      { type: 'feature', description: 'Catalog API' },
      { type: 'story', description: 'Retrieve product details' },
      { type: 'tag', description: 'FR-099' },
    );

    const catalogApiClient = new CatalogApiClient(request);

    const productId = await test.step('Obtain a valid product identifier from the catalog', async () => {
      const catalogResponse = await catalogApiClient.getProducts();

      expect(catalogResponse.ok()).toBeTruthy();

      const catalogResponseBody = await catalogResponse.json();

      expect(Array.isArray(catalogResponseBody.products)).toBeTruthy();
      expect(catalogResponseBody.products.length).toBeGreaterThan(0);

      const selectedProductId = catalogResponseBody.products[0].productId;

      expect(selectedProductId).toEqual(expect.any(Number));
      expect(selectedProductId).toBeGreaterThan(0);

      return selectedProductId;
    });

    const productResponse = await test.step('Retrieve the product details through API', async () => {
      return catalogApiClient.getProductById(productId);
    });

    await test.step('Verify the product details response is successful', async () => {
      expect(productResponse.ok()).toBeTruthy();
    });

    await test.step('Verify the returned product matches the requested product', async () => {
      const returnedProduct = await productResponse.json();

      expect(returnedProduct.productId).toEqual(expect.any(Number));
      expect(returnedProduct.productId).toBeGreaterThan(0);
      expect(returnedProduct.productId).toBe(productId);
      expect(returnedProduct.productName).toEqual(expect.any(String));
      expect(returnedProduct.productName.trim()).not.toBe('');
      expect(returnedProduct.price).toEqual(expect.any(Number));
      expect(returnedProduct.price).toBeGreaterThanOrEqual(0);
    });
  });

  test('TC-097: Search Products Through API', async ({ request }) => {
    test.info().annotations.push(
      { type: 'feature', description: 'Catalog API' },
      { type: 'story', description: 'Search products' },
      { type: 'tag', description: 'FR-100' },
    );

    const catalogApiClient = new CatalogApiClient(request);

    const searchTerm = await test.step('Obtain a valid search term from the product catalog', async () => {
      const catalogResponse = await catalogApiClient.getProducts();

      expect(catalogResponse.ok()).toBeTruthy();

      const catalogResponseBody = await catalogResponse.json();

      expect(Array.isArray(catalogResponseBody.products)).toBeTruthy();
      expect(catalogResponseBody.products.length).toBeGreaterThan(0);

      const selectedProductName = catalogResponseBody.products[0].productName;

      expect(selectedProductName).toEqual(expect.any(String));
      expect(selectedProductName.trim()).not.toBe('');

      return selectedProductName.trim().split(/\s+/)[0];
    });

    const searchResponse = await test.step('Search products through API', async () => {
      return catalogApiClient.searchProducts(searchTerm);
    });

    await test.step('Verify the product search response is successful', async () => {
      expect(searchResponse.ok()).toBeTruthy();
    });

    await test.step('Verify the search results match the search criteria', async () => {
      const searchResults = await searchResponse.json();

      expect(Array.isArray(searchResults)).toBeTruthy();
      expect(searchResults.length).toBeGreaterThan(0);

      const products = searchResults.flatMap(
        (category: { products: Array<{ productName: string }> }) => category.products,
      );

      expect(products.length).toBeGreaterThan(0);

      for (const product of products) {
        expect(product.productName.toLowerCase()).toContain(searchTerm.toLowerCase());
      }
    });
  });

  test('TC-098: Retrieve Product Categories Through API', async ({ request }) => {
    test.info().annotations.push(
      { type: 'feature', description: 'Catalog API' },
      { type: 'story', description: 'Retrieve product categories' },
      { type: 'tag', description: 'FR-101' },
    );

    const catalogApiClient = new CatalogApiClient(request);

    const response = await test.step('Retrieve the product categories through API', async () => {
      return catalogApiClient.getCategories();
    });

    await test.step('Verify the categories response is successful', async () => {
      expect(response.ok()).toBeTruthy();
    });

    await test.step('Verify the returned category data', async () => {
      const categories = await response.json();

      expect(Array.isArray(categories)).toBeTruthy();
      expect(categories.length).toBeGreaterThan(0);

      for (const category of categories) {
        expect(category.categoryId).toEqual(expect.any(Number));
        expect(category.categoryId).toBeGreaterThan(0);
        expect(category.categoryName).toEqual(expect.any(String));
        expect(category.categoryName.trim()).not.toBe('');
      }
    });
  });
});
