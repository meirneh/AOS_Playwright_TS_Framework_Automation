import { expect, test } from '@playwright/test';
import AccountApiClient from '../../api/clients/AccountApiClient';
import CatalogApiClient from '../../api/clients/CatalogApiClient';
import OrderApiClient from '../../api/clients/OrderApiClient';
import { API_USERS } from '../../api/test-data/users.data';

async function authenticateExistingUser(
  accountApiClient: AccountApiClient,
): Promise<{ token: string; userId: number }> {
  const user = await test.step('Load the existing valid API user', async () => {
    return API_USERS.existingUser;
  });

  const loginResponse = await test.step('Authenticate the dedicated test user', async () => {
    return accountApiClient.loginUser({
      email: user.email,
      loginPassword: user.password,
      loginUser: user.username,
    });
  });

  return test.step('Verify the authentication response', async () => {
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

    return {
      token: statusMessage.token,
      userId: statusMessage.userId,
    };
  });
}

test.describe('Order API: TC-103 to TC-109', () => {
  test('TC-103: Retrieve User Cart Through API', async ({ request }) => {
    test.info().annotations.push(
      { type: 'feature', description: 'Order API' },
      { type: 'story', description: 'Retrieve user cart' },
      { type: 'tag', description: 'FR-106' },
    );

    const accountApiClient = new AccountApiClient(request);
    const orderApiClient = new OrderApiClient(request);
    const authentication = await authenticateExistingUser(accountApiClient);

    const cartResponse = await test.step('Retrieve the user cart through API', async () => {
      return orderApiClient.getUserCart(authentication.userId, authentication.token);
    });

    await test.step('Verify the cart response', async () => {
      const cartStatus = cartResponse.status();
      const cartBodyText = await cartResponse.text();

      if (!cartResponse.ok()) {
        throw new Error(
          `Cart retrieval failed with status ${cartStatus}: ${cartBodyText}`,
        );
      }

      const cartBody = JSON.parse(cartBodyText);

      expect(cartBody.userId).toBe(authentication.userId);
      expect(cartBody.productsInCart).toEqual(expect.any(Array));
    });
  });

  test('TC-104: Add Product to Cart Through API', async ({ request }) => {
    test.info().annotations.push(
      { type: 'feature', description: 'Order API' },
      { type: 'story', description: 'Add product to cart' },
      { type: 'tag', description: 'FR-107' },
    );

    const accountApiClient = new AccountApiClient(request);
    const catalogApiClient = new CatalogApiClient(request);
    const orderApiClient = new OrderApiClient(request);
    const authentication = await authenticateExistingUser(accountApiClient);

    const product = await test.step('Retrieve a valid catalog product', async () => {
      const catalogResponse = await catalogApiClient.getProducts();
      const catalogStatus = catalogResponse.status();
      const catalogBody = await catalogResponse.text();

      if (!catalogResponse.ok()) {
        throw new Error(
          `Catalog retrieval failed with status ${catalogStatus}: ${catalogBody}`,
        );
      }

      const catalogResponseBody = JSON.parse(catalogBody);

      for (const catalogProduct of catalogResponseBody.products) {
        if (
          typeof catalogProduct.productId !== 'number'
          || catalogProduct.productId <= 0
          || !Array.isArray(catalogProduct.colors)
        ) {
          continue;
        }

        const availableColor = catalogProduct.colors.find((color: {
          code?: unknown;
          inStock?: unknown;
        }) => (
          typeof color.code === 'string'
          && color.code.trim() !== ''
          && typeof color.inStock === 'number'
          && color.inStock > 0
        ));

        if (availableColor && typeof availableColor.code === 'string') {
          return {
            colorCode: availableColor.code,
            productId: catalogProduct.productId,
          };
        }
      }

      throw new Error('No catalog product with an available color was found.');
    });

    let productAdded = false;

    try {
      await test.step('Add the product to the user cart', async () => {
        const addResponse = await orderApiClient.addProductToCart(
          authentication.userId,
          product.productId,
          product.colorCode,
          1,
          authentication.token,
        );

        if (!addResponse.ok()) {
          const addStatus = addResponse.status();
          const addBody = await addResponse.text();

          throw new Error(
            `Add product failed with status ${addStatus}: ${addBody}`,
          );
        }

        productAdded = true;
      });

      const cartResponse = await test.step('Retrieve the user cart', async () => {
        return orderApiClient.getUserCart(authentication.userId, authentication.token);
      });

      await test.step('Verify the added product', async () => {
        const cartStatus = cartResponse.status();
        const cartBodyText = await cartResponse.text();

        if (!cartResponse.ok()) {
          throw new Error(
            `Cart retrieval failed with status ${cartStatus}: ${cartBodyText}`,
          );
        }

        const cartBody = JSON.parse(cartBodyText);
        const addedProduct = cartBody.productsInCart.find((cartProduct: {
          color?: { code?: unknown };
          productId?: unknown;
        }) => (
          cartProduct.productId === product.productId
          && cartProduct.color?.code === product.colorCode
        ));

        expect(addedProduct).toBeDefined();
        expect(addedProduct.productId).toBe(product.productId);
        expect(addedProduct.quantity).toBe(1);
        expect(addedProduct.color.code).toBe(product.colorCode);
      });
    } finally {
      if (productAdded) {
        await test.step('Remove the added product during cleanup', async () => {
          const removeResponse = await orderApiClient.removeProductFromCart(
            authentication.userId,
            product.productId,
            product.colorCode,
            authentication.token,
          );

          if (!removeResponse.ok()) {
            const removeStatus = removeResponse.status();
            const removeBody = await removeResponse.text();

            throw new Error(
              `Cleanup removal failed with status ${removeStatus}: ${removeBody}`,
            );
          }
        });
      }
    }
  });

  test('TC-105: Update Cart Product Through API', async ({ request }) => {
    test.info().annotations.push(
      { type: 'feature', description: 'Order API' },
      { type: 'story', description: 'Update cart product' },
      { type: 'tag', description: 'FR-108' },
      { type: 'tag', description: 'FR-106' },
    );

    const accountApiClient = new AccountApiClient(request);
    const catalogApiClient = new CatalogApiClient(request);
    const orderApiClient = new OrderApiClient(request);
    const authentication = await authenticateExistingUser(accountApiClient);

    const existingCartProducts = await test.step('Retrieve the existing user cart', async () => {
      const cartResponse = await orderApiClient.getUserCart(
        authentication.userId,
        authentication.token,
      );
      const cartStatus = cartResponse.status();
      const cartBodyText = await cartResponse.text();

      if (!cartResponse.ok()) {
        throw new Error(
          `Cart retrieval failed with status ${cartStatus}: ${cartBodyText}`,
        );
      }

      const cartBody = JSON.parse(cartBodyText);

      expect(cartBody.productsInCart).toEqual(expect.any(Array));
      return cartBody.productsInCart;
    });

    const product = await test.step('Retrieve a valid catalog product', async () => {
      const catalogResponse = await catalogApiClient.getProducts();
      const catalogStatus = catalogResponse.status();
      const catalogBody = await catalogResponse.text();

      if (!catalogResponse.ok()) {
        throw new Error(
          `Catalog retrieval failed with status ${catalogStatus}: ${catalogBody}`,
        );
      }

      const catalogResponseBody = JSON.parse(catalogBody);

      for (const catalogProduct of catalogResponseBody.products) {
        if (
          typeof catalogProduct.productId !== 'number'
          || catalogProduct.productId <= 0
          || !Array.isArray(catalogProduct.colors)
        ) {
          continue;
        }

        const availableColor = catalogProduct.colors.find((color: {
          code?: unknown;
          inStock?: unknown;
        }) => {
          if (
            typeof color.code !== 'string'
            || color.code.trim() === ''
            || typeof color.inStock !== 'number'
            || color.inStock <= 0
          ) {
            return false;
          }

          return !existingCartProducts.some((cartProduct: {
            color?: { code?: unknown };
            productId?: unknown;
          }) => (
            cartProduct.productId === catalogProduct.productId
            && cartProduct.color?.code === color.code
          ));
        });

        if (availableColor && typeof availableColor.code === 'string') {
          return {
            colorCode: availableColor.code,
            productId: catalogProduct.productId,
          };
        }
      }

      throw new Error(
        'No catalog product with an available color absent from the cart was found.',
      );
    });

    let productAdded = false;

    try {
      await test.step('Add the product to the user cart with quantity 1', async () => {
        const addResponse = await orderApiClient.addProductToCart(
          authentication.userId,
          product.productId,
          product.colorCode,
          1,
          authentication.token,
        );

        if (!addResponse.ok()) {
          const addStatus = addResponse.status();
          const addBody = await addResponse.text();

          throw new Error(
            `Add product failed with status ${addStatus}: ${addBody}`,
          );
        }

        productAdded = true;
      });

      await test.step('Update the cart product quantity to 2', async () => {
        const updateResponse = await orderApiClient.updateCartProduct(
          authentication.userId,
          product.productId,
          product.colorCode,
          2,
          authentication.token,
        );

        if (!updateResponse.ok()) {
          const updateStatus = updateResponse.status();
          const updateBody = await updateResponse.text();

          throw new Error(
            `Update cart product failed with status ${updateStatus}: ${updateBody}`,
          );
        }
      });

      const cartResponse = await test.step('Retrieve the user cart', async () => {
        return orderApiClient.getUserCart(authentication.userId, authentication.token);
      });

      await test.step('Verify the updated product', async () => {
        const cartStatus = cartResponse.status();
        const cartBodyText = await cartResponse.text();

        if (!cartResponse.ok()) {
          throw new Error(
            `Cart retrieval failed with status ${cartStatus}: ${cartBodyText}`,
          );
        }

        const cartBody = JSON.parse(cartBodyText);
        const updatedProduct = cartBody.productsInCart.find((cartProduct: {
          color?: { code?: unknown };
          productId?: unknown;
        }) => (
          cartProduct.productId === product.productId
          && cartProduct.color?.code === product.colorCode
        ));

        expect(updatedProduct).toBeDefined();
        expect(updatedProduct.productId).toBe(product.productId);
        expect(updatedProduct.color.code).toBe(product.colorCode);
        expect(updatedProduct.quantity).toBe(2);
      });
    } finally {
      if (productAdded) {
        await test.step('Remove the test product during cleanup', async () => {
          const removeResponse = await orderApiClient.removeProductFromCart(
            authentication.userId,
            product.productId,
            product.colorCode,
            authentication.token,
          );

          if (!removeResponse.ok()) {
            const removeStatus = removeResponse.status();
            const removeBody = await removeResponse.text();

            throw new Error(
              `Cleanup removal failed with status ${removeStatus}: ${removeBody}`,
            );
          }
        });
      }
    }
  });

  test('TC-106: Remove Product From Cart Through API', async ({ request }) => {
    test.info().annotations.push(
      { type: 'feature', description: 'Order API' },
      { type: 'story', description: 'Remove product from cart' },
      { type: 'tag', description: 'FR-109' },
      { type: 'tag', description: 'FR-106' },
    );

    const accountApiClient = new AccountApiClient(request);
    const catalogApiClient = new CatalogApiClient(request);
    const orderApiClient = new OrderApiClient(request);
    const authentication = await authenticateExistingUser(accountApiClient);

    const existingCartProducts = await test.step('Retrieve the existing user cart', async () => {
      const cartResponse = await orderApiClient.getUserCart(
        authentication.userId,
        authentication.token,
      );
      const cartStatus = cartResponse.status();
      const cartBodyText = await cartResponse.text();

      if (!cartResponse.ok()) {
        throw new Error(
          `Cart retrieval failed with status ${cartStatus}: ${cartBodyText}`,
        );
      }

      const cartBody = JSON.parse(cartBodyText);

      expect(cartBody.productsInCart).toEqual(expect.any(Array));
      return cartBody.productsInCart;
    });

    const product = await test.step('Retrieve a valid catalog product', async () => {
      const catalogResponse = await catalogApiClient.getProducts();
      const catalogStatus = catalogResponse.status();
      const catalogBody = await catalogResponse.text();

      if (!catalogResponse.ok()) {
        throw new Error(
          `Catalog retrieval failed with status ${catalogStatus}: ${catalogBody}`,
        );
      }

      const catalogResponseBody = JSON.parse(catalogBody);

      for (const catalogProduct of catalogResponseBody.products) {
        if (
          typeof catalogProduct.productId !== 'number'
          || catalogProduct.productId <= 0
          || !Array.isArray(catalogProduct.colors)
        ) {
          continue;
        }

        const availableColor = catalogProduct.colors.find((color: {
          code?: unknown;
          inStock?: unknown;
        }) => {
          if (
            typeof color.code !== 'string'
            || color.code.trim() === ''
            || typeof color.inStock !== 'number'
            || color.inStock <= 0
          ) {
            return false;
          }

          return !existingCartProducts.some((cartProduct: {
            color?: { code?: unknown };
            productId?: unknown;
          }) => (
            cartProduct.productId === catalogProduct.productId
            && cartProduct.color?.code === color.code
          ));
        });

        if (availableColor && typeof availableColor.code === 'string') {
          return {
            colorCode: availableColor.code,
            productId: catalogProduct.productId,
          };
        }
      }

      throw new Error(
        'No catalog product with an available color absent from the cart was found.',
      );
    });

    let productAdded = false;
    let productRemoved = false;

    try {
      await test.step('Add the product to the user cart', async () => {
        const addResponse = await orderApiClient.addProductToCart(
          authentication.userId,
          product.productId,
          product.colorCode,
          1,
          authentication.token,
        );

        if (!addResponse.ok()) {
          const addStatus = addResponse.status();
          const addBody = await addResponse.text();

          throw new Error(
            `Add product failed with status ${addStatus}: ${addBody}`,
          );
        }

        productAdded = true;
      });

      await test.step('Remove the product from the user cart', async () => {
        const removeResponse = await orderApiClient.removeProductFromCart(
          authentication.userId,
          product.productId,
          product.colorCode,
          authentication.token,
        );

        if (!removeResponse.ok()) {
          const removeStatus = removeResponse.status();
          const removeBody = await removeResponse.text();

          throw new Error(
            `Remove product failed with status ${removeStatus}: ${removeBody}`,
          );
        }

        productRemoved = true;
      });

      const cartResponse = await test.step('Retrieve the user cart', async () => {
        return orderApiClient.getUserCart(authentication.userId, authentication.token);
      });

      await test.step('Verify the removed product is absent', async () => {
        const cartStatus = cartResponse.status();
        const cartBodyText = await cartResponse.text();

        if (!cartResponse.ok()) {
          throw new Error(
            `Cart retrieval failed with status ${cartStatus}: ${cartBodyText}`,
          );
        }

        const cartBody = JSON.parse(cartBodyText);
        const removedProduct = cartBody.productsInCart.find((cartProduct: {
          color?: { code?: unknown };
          productId?: unknown;
        }) => (
          cartProduct.productId === product.productId
          && cartProduct.color?.code === product.colorCode
        ));

        expect(removedProduct).toBeUndefined();
      });
    } finally {
      if (productAdded && !productRemoved) {
        await test.step('Remove the test product during emergency cleanup', async () => {
          const removeResponse = await orderApiClient.removeProductFromCart(
            authentication.userId,
            product.productId,
            product.colorCode,
            authentication.token,
          );

          if (!removeResponse.ok()) {
            const removeStatus = removeResponse.status();
            const removeBody = await removeResponse.text();

            throw new Error(
              `Emergency cleanup removal failed with status ${removeStatus}: ${removeBody}`,
            );
          }
        });
      }
    }
  });

  test('TC-107: Clear User Cart Through API', async ({ request }) => {
    test.info().annotations.push(
      { type: 'feature', description: 'Order API' },
      { type: 'story', description: 'Clear user cart' },
      { type: 'tag', description: 'FR-110' },
      { type: 'tag', description: 'FR-106' },
    );

    const accountApiClient = new AccountApiClient(request);
    const catalogApiClient = new CatalogApiClient(request);
    const orderApiClient = new OrderApiClient(request);
    const authentication = await authenticateExistingUser(accountApiClient);

    await test.step('Verify the initial user cart is empty', async () => {
      const initialCartResponse = await orderApiClient.getUserCart(
        authentication.userId,
        authentication.token,
      );
      const initialCartStatus = initialCartResponse.status();
      const initialCartBodyText = await initialCartResponse.text();

      if (!initialCartResponse.ok()) {
        throw new Error(
          `Initial cart retrieval failed with status ${initialCartStatus}: ${initialCartBodyText}`,
        );
      }

      const initialCartBody = JSON.parse(initialCartBodyText);

      expect(initialCartBody.productsInCart).toEqual(expect.any(Array));
      expect(
        initialCartBody.productsInCart,
        'TC-107 requires a clean dedicated cart before creating test data.',
      ).toHaveLength(0);
    });

    const products = await test.step('Retrieve two valid catalog products', async () => {
      const catalogResponse = await catalogApiClient.getProducts();
      const catalogStatus = catalogResponse.status();
      const catalogBody = await catalogResponse.text();

      if (!catalogResponse.ok()) {
        throw new Error(
          `Catalog retrieval failed with status ${catalogStatus}: ${catalogBody}`,
        );
      }

      const catalogResponseBody = JSON.parse(catalogBody);
      const selectedProducts: Array<{
        colorCode: string;
        productId: number;
      }> = [];

      for (const catalogProduct of catalogResponseBody.products) {
        if (
          typeof catalogProduct.productId !== 'number'
          || catalogProduct.productId <= 0
          || !Array.isArray(catalogProduct.colors)
        ) {
          continue;
        }

        for (const color of catalogProduct.colors) {
          if (
            typeof color.code !== 'string'
            || color.code.trim() === ''
            || typeof color.inStock !== 'number'
            || color.inStock <= 0
          ) {
            continue;
          }

          const alreadySelected = selectedProducts.some((selectedProduct) => (
            selectedProduct.productId === catalogProduct.productId
            && selectedProduct.colorCode === color.code
          ));

          if (!alreadySelected) {
            selectedProducts.push({
              colorCode: color.code,
              productId: catalogProduct.productId,
            });
          }

          if (selectedProducts.length === 2) {
            return selectedProducts;
          }
        }
      }

      throw new Error('Fewer than two available catalog product colors were found.');
    });

    let cartHasTestData = false;
    let cartCleared = false;

    try {
      await test.step('Add two products to the user cart', async () => {
        for (const product of products) {
          const addResponse = await orderApiClient.addProductToCart(
            authentication.userId,
            product.productId,
            product.colorCode,
            1,
            authentication.token,
          );

          if (!addResponse.ok()) {
            const addStatus = addResponse.status();
            const addBody = await addResponse.text();

            throw new Error(
              `Add product failed with status ${addStatus}: ${addBody}`,
            );
          }

          cartHasTestData = true;
        }
      });

      await test.step('Clear the user cart', async () => {
        const clearResponse = await orderApiClient.clearUserCart(
          authentication.userId,
          authentication.token,
        );

        if (!clearResponse.ok()) {
          const clearStatus = clearResponse.status();
          const clearBody = await clearResponse.text();

          throw new Error(
            `Clear cart failed with status ${clearStatus}: ${clearBody}`,
          );
        }
      });

      const cartResponse = await test.step('Retrieve the user cart', async () => {
        return orderApiClient.getUserCart(authentication.userId, authentication.token);
      });

      await test.step('Verify the user cart is empty', async () => {
        const cartStatus = cartResponse.status();
        const cartBodyText = await cartResponse.text();

        if (!cartResponse.ok()) {
          throw new Error(
            `Cart retrieval failed with status ${cartStatus}: ${cartBodyText}`,
          );
        }

        const cartBody = JSON.parse(cartBodyText);

        expect(cartBody.userId).toBe(authentication.userId);
        expect(cartBody.productsInCart).toEqual(expect.any(Array));
        expect(cartBody.productsInCart).toHaveLength(0);

        cartCleared = true;
      });
    } finally {
      if (cartHasTestData && !cartCleared) {
        await test.step('Clear the user cart during emergency cleanup', async () => {
          const clearResponse = await orderApiClient.clearUserCart(
            authentication.userId,
            authentication.token,
          );

          if (!clearResponse.ok()) {
            const clearStatus = clearResponse.status();
            const clearBody = await clearResponse.text();

            throw new Error(
              `Emergency cleanup failed with status ${clearStatus}: ${clearBody}`,
            );
          }
        });
      }
    }
  });

  test('TC-108: Retrieve User Order History Through API', async ({ request }) => {
    test.info().annotations.push(
      { type: 'feature', description: 'Order API' },
      { type: 'story', description: 'Retrieve user order history' },
      { type: 'tag', description: 'FR-111' },
    );

    const accountApiClient = new AccountApiClient(request);
    const orderApiClient = new OrderApiClient(request);
    const authentication = await authenticateExistingUser(accountApiClient);

    const historyResponse = await test.step('Retrieve the user order history through API', async () => {
      return orderApiClient.getUserOrderHistory(authentication.userId);
    });

    await test.step('Verify the order history response', async () => {
      const historyStatus = historyResponse.status();
      const historyBodyText = await historyResponse.text();

      if (!historyResponse.ok()) {
        throw new Error(
          `Order history retrieval failed with status ${historyStatus}: ${historyBodyText}`,
        );
      }

      const historyBody = JSON.parse(historyBodyText);

      expect(historyBody.ordersHistory).toEqual(expect.any(Array));

      for (const order of historyBody.ordersHistory) {
        expect(order.customer).toBeDefined();
        expect(order.customer.userId).toBe(authentication.userId);
        expect(order.orderNumber).toEqual(expect.any(Number));
        expect(order.orderNumber).toBeGreaterThan(0);
      }
    });
  });

  test('TC-109: Calculate Shipping Cost Through API', async ({ request }) => {
    test.info().annotations.push(
      { type: 'feature', description: 'Order API' },
      { type: 'story', description: 'Calculate shipping cost' },
      { type: 'tag', description: 'FR-112' },
    );

    const orderApiClient = new OrderApiClient(request);
    const shippingData = {
      seaddress: {
        addressLine1: '123 Test Street',
        addressLine2: '',
        city: 'New York',
        country: 'United States',
        postalCode: '10001',
        state: 'NY',
      },
      secustomerName: 'API Test User',
      secustomerPhone: '1234567890',
      senumberOfProducts: 1,
      setransactionType: 'SHIPPING_COST' as const,
    };

    const shippingResponse = await test.step('Calculate the shipping cost through API', async () => {
      return orderApiClient.calculateShippingCost(shippingData);
    });

    await test.step('Verify the shipping cost response', async () => {
      const shippingStatus = shippingResponse.status();
      const shippingBodyText = await shippingResponse.text();

      if (!shippingResponse.ok()) {
        throw new Error(
          `Shipping cost calculation failed with status ${shippingStatus}: ${shippingBodyText}`,
        );
      }

      const shippingBody = JSON.parse(shippingBodyText);

      expect(shippingBody.setransactionType).toBe('SHIPPING_COST');
      expect(shippingBody.amount).toEqual(expect.any(String));
      expect(shippingBody.amount.trim()).not.toBe('');

      const shippingAmount = Number(shippingBody.amount);

      expect(Number.isNaN(shippingAmount)).toBe(false);
      expect(shippingAmount).toBeGreaterThanOrEqual(0);
      expect(shippingBody.code).toEqual(expect.any(String));
    });
  });
});
