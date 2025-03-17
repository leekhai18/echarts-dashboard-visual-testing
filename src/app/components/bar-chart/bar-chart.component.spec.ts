import { render, screen, fireEvent } from '@testing-library/angular';
import { BarChartComponent } from './bar-chart.component';
import { ChartInteractionService } from '../../services/chart-interaction.service';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import '@testing-library/jest-dom';
import { ComponentFixture } from '@angular/core/testing';
import * as echarts from 'echarts';

expect.extend({ toMatchImageSnapshot });

// Mock getComputedStyle to return proper dimensions
Object.defineProperty(window, 'getComputedStyle', {
  value: (el: Element) => ({
    getPropertyValue: (prop: string) => {
      if (prop === 'width') return '400px';
      if (prop === 'height') return '400px';
      return '';
    }
  })
});

describe('BarChartComponent', () => {
  let chartInteractionService: ChartInteractionService;
  let fixture: ComponentFixture<BarChartComponent>;
  let component: BarChartComponent;

  const testDataSets = [
    {
      name: 'Basic Data',
      data: [
        { name: 'Category A', value: 150 },
        { name: 'Category B', value: 230 },
        { name: 'Category C', value: 180 }
      ]
    },
    {
      name: 'Zero Values',
      data: [
        { name: 'Category A', value: 0 },
        { name: 'Category B', value: 0 },
        { name: 'Category C', value: 0 }
      ]
    },
    {
      name: 'Large Values',
      data: [
        { name: 'Category A', value: 1000000 },
        { name: 'Category B', value: 2000000 },
        { name: 'Category C', value: 3000000 }
      ]
    }
  ];

  beforeEach(async () => {
    const componentFixture = await render(BarChartComponent, {
      providers: [ChartInteractionService]
    });

    fixture = componentFixture.fixture as ComponentFixture<BarChartComponent>;
    component = fixture.componentInstance;
    chartInteractionService = fixture.debugElement.injector.get(ChartInteractionService);
    
    // Wait for initial render
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should render the chart container', () => {
    const container = screen.getByTestId('chart-container');
    expect(container).toBeInTheDocument();
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('should handle window resize', async () => {
    const container = screen.getByTestId('chart-container');
    const originalWidth = container.clientWidth;
    const originalHeight = container.clientHeight;

    // Simulate window resize
    Object.defineProperty(window, 'innerWidth', { value: 800 });
    Object.defineProperty(window, 'innerHeight', { value: 600 });
    window.dispatchEvent(new Event('resize'));

    // Wait for resize to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(container.clientWidth).not.toBe(originalWidth);
    expect(container.clientHeight).not.toBe(originalHeight);
  });

  it('should handle data selection from service', async () => {
    const testData = { name: 'Category A', value: 150 };
    chartInteractionService.updateSelectedData(testData);

    // Wait for chart to update
    await screen.findByTestId('chart-container');
  });

  it('should handle click events', async () => {
    const container = screen.getByTestId('chart-container');
    await fireEvent.click(container);

    // Verify service was updated
    const selectedData = await new Promise(resolve => {
      chartInteractionService.selectedData$.subscribe(data => resolve(data));
    });
    expect(selectedData).toBeTruthy();
  });

  testDataSets.forEach(({ name, data }) => {
    it(`should render correctly with ${name}`, async () => {
      // Update component data
      Object.defineProperty(component, 'data', { value: data });

      // Wait for chart to update and stabilize
      const chartElement = await screen.findByTestId('chart-container');
      
      // // Set dimensions on the chart container div
      // chartElement.style.width = '400px';
      // chartElement.style.height = '400px';
      
      // // Force a reflow to ensure dimensions are applied
      // chartElement.offsetHeight;

      // Find and set dimensions on the inner ECharts container div
      // const echartsContainer = chartElement.querySelector('div[style*="position: relative"]') as HTMLElement;
      // if (echartsContainer) {
      //   echartsContainer.style.width = '400px';
      //   echartsContainer.style.height = '400px';
      //   echartsContainer.offsetHeight;
      // }

      // Force ECharts to recognize the container size
      const chart = echarts.getInstanceByDom(chartElement);

      if (chart) {
        chart.resize({ width: 400, height: 400 });
      }
      
      // Wait for chart to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      fixture.detectChanges();
      await fixture.whenStable();
      
      // Get the canvas element after chart initialization
      const canvas = chart?.renderToCanvas();
      if (!canvas) {
        throw new Error('Canvas element not found');
      }

      // // Set canvas dimensions
      // canvas.width = 400;
      // canvas.height = 400;
      // canvas.style.width = '400px';
      // canvas.style.height = '400px';

      // Wait for any pending animations or renders
      // await new Promise(resolve => setTimeout(resolve, 100));

      // Get the canvas content as a data URL
      const imageData = canvas.toDataURL('image/png');
      
      // Convert the data URL to a Buffer
      const base64Data = imageData?.replace(/^data:image\/png;base64,/, '');
      const imageBuffer = Buffer.from(base64Data || '', 'base64');

      // Take snapshot of the canvas content
      expect(imageBuffer).toMatchImageSnapshot({
        customSnapshotIdentifier: `bar-chart-${name.toLowerCase().replace(/\s+/g, '-')}`,
        failureThreshold: 0.1,
        failureThresholdType: 'percent',
      });
    });
  });
}); 