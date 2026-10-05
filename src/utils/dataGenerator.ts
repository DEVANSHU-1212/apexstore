import { faker } from '@faker-js/faker';

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

export class DataGenerator {
  static generateCustomer(overrides: Partial<CustomerInfo> = {}): CustomerInfo {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number({ style: 'national' }),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode('#####'),
      country: 'United States',
      cardNumber: '4242' + faker.string.numeric(12),
      cardExpiry: '12/28',
      cardCvv: faker.string.numeric(3),
      ...overrides
    };
  }

  static randomItem<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }

  static randomQuantity(min: number = 1, max: number = 5): number {
    return faker.number.int({ min, max });
  }

  static randomSearchKeyword(): string {
    return faker.helpers.arrayElement(['Pro', 'Max', 'Wireless', 'Camera', 'Watch', 'Headphones', 'Laptop']);
  }
}
