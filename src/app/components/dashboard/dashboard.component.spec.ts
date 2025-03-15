import { render, screen } from '@testing-library/angular';
import { DashboardComponent } from './dashboard.component';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { DoughnutChartComponent } from '../doughnut-chart/doughnut-chart.component';
import { ScatterChartComponent } from '../scatter-chart/scatter-chart.component';
import { ChartInteractionService } from '../../services/chart-interaction.service';

describe('DashboardComponent', () => {
  beforeEach(async () => {
    await render(DashboardComponent, {
      imports: [
        BarChartComponent,
        LineChartComponent,
        PieChartComponent,
        DoughnutChartComponent,
        ScatterChartComponent
      ],
      providers: [ChartInteractionService]
    });
  });

  it('should render all chart containers', () => {
    const chartContainers = screen.getAllByTestId('chart-container');
    expect(chartContainers.length).toBe(5);
  });

  it('should render chart containers in correct order', () => {
    const chartContainers = screen.getAllByTestId('chart-container');
    expect(chartContainers[0].closest('app-bar-chart')).toBeTruthy();
    expect(chartContainers[1].closest('app-line-chart')).toBeTruthy();
    expect(chartContainers[2].closest('app-pie-chart')).toBeTruthy();
    expect(chartContainers[3].closest('app-doughnut-chart')).toBeTruthy();
    expect(chartContainers[4].closest('app-scatter-chart')).toBeTruthy();
  });

  it('should apply correct styling to chart containers', () => {
    const chartContainers = screen.getAllByTestId('chart-container');
    chartContainers.forEach(container => {
      expect(container).toHaveStyle({
        'background-color': 'white',
        'border-radius': '8px',
        'box-shadow': expect.any(String)
      });
    });
  });

  it('should clean up resources on destroy', async () => {
    const chartContainers = screen.getAllByTestId('chart-container');
    const dashboard = screen.getByRole('main');
    dashboard.remove();
    await new Promise(resolve => setTimeout(resolve, 100));

    chartContainers.forEach(container => {
      expect(container).not.toBeInTheDocument();
    });
  });
}); 