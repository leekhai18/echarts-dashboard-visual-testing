import { test, expect, Page } from '@playwright/test';

// Test fixtures for common chart operations
const chartFixtures = {
  waitForChartRender: async (page: Page) => {
    const chartContainer = page.locator('[data-testid="chart-container"]');
    await expect(chartContainer).toBeVisible();
    return chartContainer;
  },

  updateChartData: async (page: Page, data: number[]) => {
    // Get the chart container first
    const container = page.locator('[data-testid="chart-container"]');
    await expect(container).toBeVisible();

    // Update the chart data using page.evaluate
    await page.evaluate((args: { containerSelector: string; chartData: number[] }) => {
      const container = document.querySelector(args.containerSelector)?.parentElement;
      if (!container) return;

      const echarts = (window as any).echarts;
      if (!echarts) return;

      const chart = echarts.getInstanceByDom(container);
      if (!chart) return;

      chart.setOption({
        series: [{
          data: args.chartData
        }]
      });
    }, { containerSelector: '[data-testid="chart-container"]', chartData: data });

    // Wait for the update to be rendered
    await page.waitForTimeout(1000);
  }
};

test.describe('ECharts Component Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
  });

  test.describe('Basic Rendering', () => {
    test('should render bar chart with default data', async ({ page }) => {
      const chartContainer = await chartFixtures.waitForChartRender(page);

      // Take a screenshot of the chart
      const screenshot = await chartContainer.screenshot();
      expect(screenshot).toMatchSnapshot('bar-chart-default.png');
    });

    test('should render chart with different viewport sizes', async ({ page }) => {
      const chartContainer = await chartFixtures.waitForChartRender(page);

      // Test with different viewport sizes
      const viewports = [
        { width: 800, height: 600 },
        { width: 1024, height: 768 },
        { width: 1280, height: 800 }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(500); // Wait for resize

        const screenshot = await chartContainer.screenshot();
        expect(screenshot).toMatchSnapshot(`bar-chart-${viewport.width}x${viewport.height}.png`);
      }
    });
  });

  test.describe('Chart Interactions', () => {
    test('should show tooltip on hover', async ({ page }) => {
      const chartContainer = await chartFixtures.waitForChartRender(page);

      // Get chart dimensions
      const chartBoundingBox = await chartContainer.boundingBox();
      if (!chartBoundingBox) throw new Error('Chart container not found');

      // Simulate hover over different bars
      const barPositions = [
        { x: 0.25, y: 0.5 }, // First bar
        { x: 0.5, y: 0.5 },  // Middle bar
        { x: 0.75, y: 0.5 }  // Last bar
      ];

      for (const position of barPositions) {
        await page.mouse.move(
          chartBoundingBox.x + chartBoundingBox.width * position.x,
          chartBoundingBox.y + chartBoundingBox.height * position.y
        );

        // Wait for tooltip animation
        await page.waitForTimeout(500);

        // Take screenshot with tooltip
        const screenshot = await chartContainer.screenshot();
        expect(screenshot).toMatchSnapshot(
          `bar-chart-tooltip-${position.x * 100}percent.png`
        );
      }
    });

    test('should handle zoom interactions', async ({ page }) => {
      const chartContainer = await chartFixtures.waitForChartRender(page);

      // Get chart dimensions
      const chartBoundingBox = await chartContainer.boundingBox();
      if (!chartBoundingBox) throw new Error('Chart container not found');

      // Simulate zoom in
      await page.mouse.move(
        chartBoundingBox.x + chartBoundingBox.width / 2,
        chartBoundingBox.y + chartBoundingBox.height / 2
      );
      await page.mouse.wheel(0, -100);
      await page.waitForTimeout(500);

      // Take screenshot after zoom
      const screenshot = await chartContainer.screenshot();
      expect(screenshot).toMatchSnapshot('bar-chart-zoomed.png');
    });
  });

  test.describe('Data Updates', () => {
    test('should update chart with new data', async ({ page }) => {
      const chartContainer = await chartFixtures.waitForChartRender(page);

      // Test different data sets
      const testDataSets = [
        [220, 200, 150, 80, 70, 110, 120],
        [150, 100, 200, 150, 80, 120, 90],
        [100, 150, 100, 50, 80, 120, 180]
      ];

      for (const [index, data] of testDataSets.entries()) {
        await chartFixtures.updateChartData(page, data);

        const screenshot = await chartContainer.screenshot();
        expect(screenshot).toMatchSnapshot(`bar-chart-dataset-${index + 1}.png`);
      }
    });

    test('should handle large dataset updates', async ({ page }) => {
      const chartContainer = await chartFixtures.waitForChartRender(page);

      // Generate large dataset
      const largeData = Array.from({ length: 1000 }, () =>
        Math.floor(Math.random() * 1000)
      );

      await chartFixtures.updateChartData(page, largeData);

      const screenshot = await chartContainer.screenshot();
      expect(screenshot).toMatchSnapshot('bar-chart-large-dataset.png');
    });
  });
}); 