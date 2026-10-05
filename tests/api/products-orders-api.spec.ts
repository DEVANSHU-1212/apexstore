import { test, expect } from '../../src/fixtures/testBase';
import { DataGenerator } from '../../src/utils/dataGenerator';
import { Logger } from '../../src/utils/logger';

test.describe('REST API Test Automation Suite', () => {
  test('API-01: GET /api/products returns 200 OK and valid product schema', async ({ productApi }) => {
    Logger.info('Verifying /api/products schema and response contract');
    const response = await productApi.getAllProducts();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBeTruthy();
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThan(0);

    const firstItem = body.data[0];
    expect(firstItem).toHaveProperty('id');
    expect(firstItem).toHaveProperty('name');
    expect(firstItem).toHaveProperty('price');
    expect(firstItem).toHaveProperty('category');
  });

  test('API-02: GET /api/products/:id returns specific product details', async ({ productApi }) => {
    const response = await productApi.getProductById('prod-1');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.success).toBeTruthy();
    expect(body.data.id).toBe('prod-1');
  });

  test('API-03: POST /api/coupons/validate returns correct discount rate for valid coupon', async ({ orderApi }) => {
    const response = await orderApi.validateCoupon('SAVE10');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.valid).toBeTruthy();
    expect(body.discountPercent).toBe(10);
  });

  test('API-04: POST /api/orders creates a new customer order and calculates tax/discount', async ({ orderApi }) => {
    const customer = DataGenerator.generateCustomer();
    const orderPayload = {
      customer: {
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        address: customer.address,
        city: customer.city,
        zipCode: customer.zipCode
      },
      items: [
        {
          productId: 'prod-1',
          name: 'Apex Wireless Noise-Cancelling Headphones Pro',
          price: 299.99,
          quantity: 2
        }
      ],
      couponCode: 'SAVE10',
      paymentMethod: 'card'
    };

    const response = await orderApi.createOrder(orderPayload);
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.success).toBeTruthy();
    expect(body.order.orderId).toMatch(/^ORD-/);
    expect(body.order.subtotal).toBe(599.98);
    expect(body.order.discount).toBe(60.00);
    expect(body.order.status).toBe('CONFIRMED');
  });

  test('API-05: Negative Test - POST /api/orders fails when items list is empty', async ({ orderApi }) => {
    const customer = DataGenerator.generateCustomer();
    const invalidPayload = {
      customer: {
        name: customer.firstName,
        email: customer.email,
        address: customer.address,
        city: customer.city,
        zipCode: customer.zipCode
      },
      items: [],
      paymentMethod: 'card'
    };

    const response = await orderApi.createOrder(invalidPayload as any);
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBeFalsy();
  });
});
