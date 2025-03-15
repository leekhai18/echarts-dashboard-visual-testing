import { Component } from '@angular/core';
import { BarChartComponent } from '../bar-chart/bar-chart.component';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { DoughnutChartComponent } from '../doughnut-chart/doughnut-chart.component';
import { ScatterChartComponent } from '../scatter-chart/scatter-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    BarChartComponent,
    LineChartComponent,
    PieChartComponent,
    DoughnutChartComponent,
    ScatterChartComponent
  ],
  template: `
    <div class="dashboard-container">
      <div class="chart-row">
        <app-bar-chart></app-bar-chart>
        <app-line-chart></app-line-chart>
      </div>
      <div class="chart-row">
        <app-pie-chart></app-pie-chart>
        <app-doughnut-chart></app-doughnut-chart>
      </div>
      <div class="chart-row">
        <app-scatter-chart></app-scatter-chart>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .chart-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    app-bar-chart,
    app-line-chart,
    app-pie-chart,
    app-doughnut-chart,
    app-scatter-chart {
      flex: 1;
      min-height: 400px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 16px;
    }
    @media (max-width: 768px) {
      .chart-row {
        flex-direction: column;
      }
      app-bar-chart,
      app-line-chart,
      app-pie-chart,
      app-doughnut-chart,
      app-scatter-chart {
        width: 100%;
      }
    }
  `]
})
export class DashboardComponent {} 