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
  var pages: Page[];
}

describe('ECharts Dashboard E2E Tests', () => {
  let page: Page;

  beforeAll(async () => {
    if (!global.browser) {
      throw new Error('Browser instance not initialized');
    }
    page = await global.browser.newPage();
    
    // Initialize global pages array if it doesn't exist
    if (!global.pages) {
      global.pages = [];
    }
    
    // Add this page to the global pages array
    global.pages.push(page);
    
    await page.goto('http://localhost:4200');
  });

  afterAll(async () => {
    if (page) {
      // Remove this page from the global pages array
      global.pages = global.pages.filter(p => p !== page);
      await page.close();
    }
  });

  // Teardown after each test case
  afterEach(async () => {
    try {
      // Reset viewport to default
      await page.setViewport({ width: 1280, height: 800 });
      
      // Clear chart state
      await page.evaluate(() => {
        const chartElement = document.querySelector('app-bar-chart');
        if (chartElement) {
          const componentInstance = (window as any).ng.getComponent(chartElement);
          if (componentInstance && componentInstance.chartInteractionService) {
            componentInstance.chartInteractionService.clearSelection();
          }
        }
      });

      // Clear any custom page state
      await page.evaluate(() => {
        // Clear any custom window properties
        if ((window as any).customState) {
          delete (window as any).customState;
        }
        
        // Reset any custom styles
        const styleElements = document.querySelectorAll('style[data-test-style]');
        styleElements.forEach(el => el.remove());
      });

      // Wait for any animations or state updates to complete
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error in test case teardown:', error);
    }
  });

  // Helper function to clear chart state (can be used within tests if needed)
  const clearChartState = async () => {
    await page.evaluate(() => {
      const chartElement = document.querySelector('app-bar-chart');
      if (chartElement) {
        const componentInstance = (window as any).ng.getComponent(chartElement);
        if (componentInstance && componentInstance.chartInteractionService) {
          componentInstance.chartInteractionService.clearSelection();
        }
      }
    });
    await new Promise(resolve => setTimeout(resolve, 500));
  };

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

  it('should match snapshot of bar chart with different viewport', async () => {
    // Wait for the chart to be rendered
    await page.waitForSelector('app-bar-chart canvas');

    // Set a different viewport size
    await page.setViewport({ width: 800, height: 600 });

    // Wait for chart to resize
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Take screenshot of chart with new viewport
    const chartElement = await page.$('app-bar-chart canvas');
    const screenshot = await chartElement?.screenshot({
      encoding: 'base64',
      type: 'png',
    });

    // Verify the chart matches the expected state with new viewport
    expect(screenshot).toMatchImageSnapshot({
      failureThreshold: 0.01,
      failureThresholdType: 'percent',
      customSnapshotIdentifier: 'bar-chart-different-viewport'
    });
  });

  it('should match snapshot of bar chart with modified data', async () => {
    // Wait for the chart to be rendered
    await page.waitForSelector('app-bar-chart canvas');

    // Modify chart data through ECharts instance
    await page.evaluate(() => {
      const chartElement = document.querySelector('app-bar-chart');
      if (chartElement) {
        // Get the component instance
        const componentInstance = (window as any).ng.getComponent(chartElement);
        if (componentInstance && componentInstance.chart) {
          // Create new data
          const newData = [
            { name: 'Sales A', value: 1000 },
            { name: 'Sales B', value: 800 },
            { name: 'Sales C', value: 1200 },
            { name: 'Sales D', value: 900 },
            { name: 'Sales E', value: 1100 }
          ];
          
          // Update chart through ECharts instance
          componentInstance.chart.setOption({
            xAxis: {
              data: newData.map(item => item.name)
            },
            series: [{
              data: newData.map(item => ({
                value: item.value,
                itemStyle: {
                  color: '#5470c6'
                },
                emphasis: {
                  itemStyle: {
                    color: '#91cc75'
                  }
                }
              }))
            }]
          });
        }
      }
    });

    // Wait for chart to update
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Take screenshot of updated chart
    const chartElement = await page.$('app-bar-chart canvas');
    const screenshot = await chartElement?.screenshot({
      encoding: 'base64',
      type: 'png',
    });

    // Verify the chart matches the expected state with new data
    expect(screenshot).toMatchImageSnapshot({
      failureThreshold: 0.01,
      failureThresholdType: 'percent',
      customSnapshotIdentifier: 'bar-chart-modified-data'
    });
  });

  it('should match snapshot of full page after chart interactions', async () => {
    // Wait for the page to load
    await page.waitForSelector('app-root');
    
    // Wait for chart to be rendered
    await page.waitForSelector('app-bar-chart canvas');
    
    // Get the chart container
    const chartContainer = await page.$('app-bar-chart');
    expect(chartContainer).toBeTruthy();

    // Simulate click on the chart
    const box = await chartContainer?.boundingBox();
    if (box) {
      // Click in the middle of the chart
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    }

    // Wait for animations and state updates
    await new Promise(resolve => setTimeout(resolve, 1000));

    // // Update chart state through ChartInteractionService
    // await page.evaluate(() => {
    //   const chartElement = document.querySelector('app-bar-chart');
    //   if (chartElement) {
    //     const componentInstance = (window as any).ng.getComponent(chartElement);
    //     if (componentInstance && componentInstance.chartInteractionService) {
    //       // Update selected data through the service
    //       componentInstance.chartInteractionService.updateSelectedData({
    //         name: 'Category A',
    //         value: 150
    //       });
    //     }
    //   }
    // });

    // // Wait for state updates to propagate
    // await new Promise(resolve => setTimeout(resolve, 500));

    // Take a full page screenshot
    const screenshot = await page.screenshot({
      fullPage: true,
      encoding: 'base64',
      type: 'png'
    });

    // Verify the full page matches the expected state
    expect(screenshot).toMatchImageSnapshot({
      failureThreshold: 0.01,
      failureThresholdType: 'percent',
      customSnapshotIdentifier: 'full-page-after-interactions'
    });
  });
}); 