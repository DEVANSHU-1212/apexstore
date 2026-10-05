import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const ENV_CONFIG = {
  env: process.env.ENV || 'local',
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  apiBaseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
  headless: process.env.HEADLESS !== 'false',
  defaultTimeout: Number(process.env.DEFAULT_TIMEOUT) || 30000,
  expectTimeout: Number(process.env.EXPECT_TIMEOUT) || 10000,
  users: {
    standard: {
      email: process.env.STANDARD_USER_EMAIL || 'customer@apexstore.com',
      password: process.env.STANDARD_USER_PASSWORD || 'Password123!',
      name: 'Dewanshu'
    },
    admin: {
      email: process.env.ADMIN_USER_EMAIL || 'admin@apexstore.com',
      password: process.env.ADMIN_USER_PASSWORD || 'AdminPass456!',
      name: 'Dewanshu (Admin)'
    }
  },
  sauceDemo: {
    url: process.env.SAUCEDEMO_URL || 'https://www.saucedemo.com',
    standardUser: process.env.SAUCE_STANDARD_USER || 'standard_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce'
  }
};
