import { ApiClient } from './ApiClient';
import { APIRequestContext, APIResponse } from '@playwright/test';

export interface OrderPayload {
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
  };
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  couponCode?: string;
  paymentMethod: string;
}

export class OrderApiService {
  private client: ApiClient;

  constructor(request: APIRequestContext) {
    this.client = new ApiClient(request);
  }

  async createOrder(orderData: OrderPayload): Promise<APIResponse> {
    return await this.client.post('/orders', orderData);
  }

  async getOrderById(orderId: string): Promise<APIResponse> {
    return await this.client.get(`/orders/${orderId}`);
  }

  async validateCoupon(code: string): Promise<APIResponse> {
    return await this.client.post('/coupons/validate', { code });
  }
}
