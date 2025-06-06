import { render, screen, fireEvent } from '@testing-library/angular';
import { ScatterChartComponent } from './scatter-chart.component';
import { ChartInteractionService } from '../../services/chart-interaction.service';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import '@testing-library/jest-dom';

expect.extend({ toMatchImageSnapshot });

interface ScatterDataItem {
  name: string;
  value: [number, number];
}

describe('ScatterChartComponent', () => {
  let chartInteractionService: ChartInteractionService;

  const testDataSets = [
    {
      name: 'Basic Data',
      data: [
        { name: 'Point A', value: [10, 20] },
        { name: 'Point B', value: [30, 40] },
        { name: 'Point C', value: [50, 60] }
      ] as ScatterDataItem[]
    },
    {
      name: 'Zero Values',
      data: [
        { name: 'Point A', value: [0, 0] },
        { name: 'Point B', value: [0, 0] },
        { name: 'Point C', value: [0, 0] }
      ] as ScatterDataItem[]
    },
    {
      name: 'Large Values',
      data: [
        { name: 'Point A', value: [1000, 2000] },
        { name: 'Point B', value: [3000, 4000] },
        { name: 'Point C', value: [5000, 6000] }
      ] as ScatterDataItem[]
    }
  ];

  beforeEach(async () => {
    const { fixture } = await render(ScatterChartComponent, {
      providers: [ChartInteractionService]
    });

    chartInteractionService = fixture.debugElement.injector.get(ChartInteractionService);
  });

  it('should render the chart container', () => {
    const container = screen.getByRole('img', { hidden: true });
    expect(container).toBeInTheDocument();
  });

  it('should handle window resize', async () => {
    const container = screen.getByRole('img', { hidden: true });
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
    const testData = { name: 'Point A', value: 10 };
    chartInteractionService.updateSelectedData(testData);

    // Wait for chart to update
    await screen.findByRole('img', { hidden: true });
  });

  it('should handle click events', async () => {
    const container = screen.getByRole('img', { hidden: true });
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
      const component = screen.getByRole('img', { hidden: true }).closest('app-scatter-chart');
      if (component) {
        Object.defineProperty(component, 'data', { value: data });
      }

      // Wait for chart to update
      await screen.findByRole('img', { hidden: true });

      // Take snapshot
      const chartElement = screen.getByRole('img', { hidden: true });
      expect(chartElement).toMatchImageSnapshot({
        customSnapshotIdentifier: `scatter-chart-${name.toLowerCase().replace(/\s+/g, '-')}`,
        failureThreshold: 0.1,
        failureThresholdType: 'percent'
      });
    });
  });
});
