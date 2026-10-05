import { ApiClient } from './ApiClient';
import { APIRequestContext, APIResponse } from '@playwright/test';

export interface ProductPayload {
  id?: string;
  name: string;
  category: string;
  price: number;
  rating?: number;
  inStock?: boolean;
}

export class ProductApiService {
  private client: ApiClient;

  constructor(request: APIRequestContext) {
    this.client = new ApiClient(request);
  }

  async getAllProducts(): Promise<APIResponse> {
    return await this.client.get('/products');
  }

  async getProductById(id: string): Promise<APIResponse> {
    return await this.client.get(`/products/${id}`);
  }

  async searchProducts(query: string): Promise<APIResponse> {
    return await this.client.get(`/products?search=${encodeURIComponent(query)}`);
  }

  async createProduct(product: ProductPayload, token?: string): Promise<APIResponse> {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    return await this.client.post('/products', product, headers);
  }
}
