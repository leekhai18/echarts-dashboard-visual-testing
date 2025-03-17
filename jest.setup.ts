import { Page } from 'puppeteer';

// Increase timeout for all tests
jest.setTimeout(30000);

// Add custom matchers for Puppeteer
expect.extend({
  async toHaveText(page: Page, selector: string, text: string) {
    const element = await page.$(selector);
    if (!element) {
      return {
        message: () => `expected element ${selector} to exist`,
        pass: false,
      };
    }
    const elementText = await element.evaluate(el => el.textContent);
    const pass = elementText?.includes(text) ?? false;
    return {
      message: () =>
        `expected element ${selector} ${pass ? 'not ' : ''}to contain text "${text}"`,
      pass,
    };
  },
}); 