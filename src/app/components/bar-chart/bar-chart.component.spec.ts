import { render, screen, fireEvent } from '@testing-library/angular';
import { BarChartComponent } from './bar-chart.component';
import { ChartInteractionService } from '../../services/chart-interaction.service';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import '@testing-library/jest-dom';

expect.extend({ toMatchImageSnapshot });

describe('BarChartComponent', () => {
  let chartInteractionService: ChartInteractionService;

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
    const { fixture } = await render(BarChartComponent, {
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
    const testData = { name: 'Category A', value: 150 };
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
      const component = screen.getByRole('img', { hidden: true }).closest('app-bar-chart');
      if (component) {
        Object.defineProperty(component, 'data', { value: data });
      }

      // Wait for chart to update
      await screen.findByRole('img', { hidden: true });

      // Take snapshot
      const chartElement = screen.getByRole('img', { hidden: true });
      expect(chartElement).toMatchImageSnapshot({
        customSnapshotIdentifier: `bar-chart-${name.toLowerCase().replace(/\s+/g, '-')}`,
        failureThreshold: 0.1,
        failureThresholdType: 'percent'
      });
    });
  });
}); 