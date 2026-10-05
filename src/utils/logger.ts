export class Logger {
  private static formatTime(): string {
    return new Date().toISOString();
  }

  static info(message: string, context?: string) {
    const ctx = context ? ` [${context}]` : '';
    console.log(`\x1b[36m[INFO ${this.formatTime()}]${ctx}\x1b[0m ${message}`);
  }

  static step(stepNumber: number | string, description: string) {
    console.log(`\x1b[32m[STEP ${stepNumber}]\x1b[0m ➔ ${description}`);
  }

  static pass(message: string) {
    console.log(`\x1b[32m[PASS]\x1b[0m ✔ ${message}`);
  }

  static warn(message: string) {
    console.log(`\x1b[33m[WARN ${this.formatTime()}]\x1b[0m ⚠ ${message}`);
  }

  static error(message: string, error?: any) {
    console.error(`\x1b[31m[ERROR ${this.formatTime()}]\x1b[0m ✖ ${message}`, error || '');
  }
}
