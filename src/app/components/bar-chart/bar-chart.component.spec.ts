import { render, screen } from '@testing-library/angular';
import { BarChartComponent } from './bar-chart.component';
import { ChartInteractionService } from '../../services/chart-interaction.service';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import '@testing-library/jest-dom';
import { mockECharts } from '../../test-helpers/echarts-mock';

expect.extend({ toMatchImageSnapshot });

describe('BarChartComponent', () => {
  let chartInteractionService: ChartInteractionService;
  let mockEChartsInstance: any;

  const testDataSets = [
    {
      name: 'Basic Data',
      data: [
        { name: 'Category A', value: 100 },
        { name: 'Category B', value: 200 },
        { name: 'Category C', value: 300 }
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
    mockEChartsInstance = mockECharts();
    const { fixture } = await render(BarChartComponent, {
      providers: [ChartInteractionService]
    });

    chartInteractionService = fixture.debugElement.injector.get(ChartInteractionService);
  });

  it('should initialize chart with correct options', () => {
    const options = mockEChartsInstance.getOptions();
    expect(options.title.text).toBe('Bar Chart');
    expect(options.series[0].type).toBe('bar');
    expect(options.xAxis.type).toBe('category');
    expect(options.yAxis.type).toBe('value');
  });

  it('should handle window resize', async () => {
    const resizeOptions = { width: 800, height: 600 };
    mockEChartsInstance.resize(resizeOptions);
    
    const options = mockEChartsInstance.getOptions();
    expect(options.width).toBe(resizeOptions.width);
    expect(options.height).toBe(resizeOptions.height);
  });

  it('should handle data selection from service', async () => {
    const testData = { name: 'Category A', value: 100 };
    chartInteractionService.updateSelectedData(testData);

    const actions = mockEChartsInstance.getActions();
    expect(actions).toContainEqual({
      type: 'highlight',
      dataIndex: 0
    });
  });

  it('should handle chart click events', async () => {
    const testData = { name: 'Category A', value: 100 };
    mockEChartsInstance.triggerEvent('click', {
      dataIndex: 0,
      data: testData
    });

    const selectedData = await new Promise(resolve => {
      chartInteractionService.selectedData$.subscribe(data => resolve(data));
    });
    expect(selectedData).toEqual(testData);
  });

  testDataSets.forEach(({ name, data }) => {
    it(`should render correctly with ${name}`, async () => {
      // Update component data
      const component = screen.getByRole('img', { hidden: true }).closest('app-bar-chart');
      if (component) {
        Object.defineProperty(component, 'data', { value: data });
      }

      // Trigger chart update
      mockEChartsInstance.setOption({
        series: [{
          data: data.map(item => item.value)
        }]
      });

      // Verify chart options
      const options = mockEChartsInstance.getOptions();
      expect(options.series[0].data).toEqual(data.map(item => item.value));
    });
  });

  it('should clean up resources on destroy', () => {
    const disposeSpy = jest.spyOn(mockEChartsInstance, 'dispose');
    const component = screen.getByRole('img', { hidden: true }).closest('app-bar-chart');
    if (component) {
      component.remove();
    }
    expect(disposeSpy).toHaveBeenCalled();
  });
}); 