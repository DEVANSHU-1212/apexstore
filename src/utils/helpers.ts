export class Helpers {
  static parsePrice(priceString: string): number {
    const cleaned = priceString.replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  }

  static formatPrice(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static calculateDiscount(subtotal: number, discountPercent: number): number {
    return Math.round(subtotal * (discountPercent / 100) * 100) / 100;
  }
}
