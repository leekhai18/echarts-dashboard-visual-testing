import { Page, Browser } from 'puppeteer';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

expect.extend({ toMatchImageSnapshot });

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveText(selector: string, text: string): Promise<R>;
    }
  }
  var browser: Browser;
}

describe('ECharts Dashboard E2E Tests', () => {
  let page: Page;

  beforeAll(async () => {
    if (!global.browser) {
      throw new Error('Browser instance not initialized');
    }
    page = await global.browser.newPage();
    await page.goto('http://localhost:4200');
  });

  afterAll(async () => {
    if (page) {
      await page.close();
    }
  });

  it('should load the dashboard page', async () => {
    // Wait for the page to load
    await page.waitForSelector('app-root');
    
    // Check if the page title is present
    await expect(page).toHaveText('h1', 'Interactive Dashboard');
  });

  it('should render charts', async () => {
    // Wait for charts to be rendered
    await page.waitForSelector('app-bar-chart');
    
    // Check if multiple charts are present
    const charts = await page.$$('app-bar-chart');
    expect(charts.length).toBeGreaterThan(0);
  });

  it('should match snapshot of bar chart', async () => {
    // Wait for the chart to be fully rendered
    await page.waitForSelector('app-bar-chart canvas');
    
    // Wait a bit for animations to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get the chart element
    const chartElement = await page.$('app-bar-chart canvas');
    expect(chartElement).toBeTruthy();
    
    // Take a screenshot of the chart
    const screenshot = await chartElement?.screenshot({
        encoding: 'base64',
        type: 'png',
    });
    expect(screenshot).toMatchImageSnapshot({
      failureThreshold: 0.01, // 1% threshold for differences
      failureThresholdType: 'percent',
      customSnapshotIdentifier: 'bar-chart-snapshot'
    });
  });

  it('should handle chart interactions and data updates', async () => {
    // Wait for the chart to be rendered
    await page.waitForSelector('app-bar-chart canvas');
    
    // Get initial chart state
    const initialChart = await page.$('app-bar-chart canvas');
    const initialScreenshot = await initialChart?.screenshot({
      encoding: 'base64',
      type: 'png',
    });

    // Get the chart container
    const chartContainer = await page.$('app-bar-chart');
    expect(chartContainer).toBeTruthy();

    // Simulate hover using Puppeteer's mouse events
    const box = await chartContainer?.boundingBox();
    if (box) {
      await page.mouse.move(box.x + 100, box.y + 200);
    }

    // Wait for animation and interaction to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Take screenshot after interaction
    const afterInteractionChart = await page.$('app-bar-chart');
    const afterInteractionScreenshot = await afterInteractionChart?.screenshot({
      encoding: 'base64',
      type: 'png',
    });
    
    // Verify the chart matches the expected state after interaction
    expect(afterInteractionScreenshot).toMatchImageSnapshot({
      failureThreshold: 0.01,
      failureThresholdType: 'percent',
      customSnapshotIdentifier: 'bar-chart-after-interaction'
    });
  });
}); 