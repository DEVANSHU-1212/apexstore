import { APIRequestContext, APIResponse } from '@playwright/test';
import { ENV_CONFIG } from '../config/environment';
import { Logger } from '../utils/logger';

export class ApiClient {
  readonly request: APIRequestContext;
  readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string = ENV_CONFIG.apiBaseURL) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  async get(endpoint: string, headers: Record<string, string> = {}): Promise<APIResponse> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    Logger.info(`[API GET] ${url}`);
    return await this.request.get(url, { headers });
  }

  async post(endpoint: string, data: any, headers: Record<string, string> = {}): Promise<APIResponse> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    Logger.info(`[API POST] ${url}`);
    return await this.request.post(url, {
      data,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    });
  }

  async delete(endpoint: string, headers: Record<string, string> = {}): Promise<APIResponse> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    Logger.info(`[API DELETE] ${url}`);
    return await this.request.delete(url, { headers });
  }
}
