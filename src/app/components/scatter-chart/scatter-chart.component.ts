import { Component } from '@angular/core';
import { BaseChartComponent } from '../base-chart.component';
import { ChartData } from '../../services/chart-interaction.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-scatter-chart',
  standalone: true,
  template: '<div #chartContainer style="width: 100%; height: 400px;"></div>'
})
export class ScatterChartComponent extends BaseChartComponent {
  private data = [
    { name: 'Category A', value: [10, 20] },
    { name: 'Category B', value: [30, 40] },
    { name: 'Category C', value: [50, 60] },
    { name: 'Category D', value: [70, 80] },
    { name: 'Category E', value: [90, 100] }
  ];

  protected override initChart(): void {
    this.chart = echarts.init(this.chartContainer.nativeElement);
    const option = {
      title: {
        text: 'Scatter Chart'
      },
      tooltip: {
        trigger: 'item'
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        type: 'scatter',
        data: this.data.map(item => ({
          name: item.name,
          value: item.value
        })),
        symbolSize: 20,
        emphasis: {
          focus: 'series'
        }
      }]
    };

    this.chart.setOption(option);
    this.chart.on('click', (params) => {
      const selectedData = this.data[params.dataIndex];
      this.chartInteractionService.updateSelectedData({
        name: selectedData.name,
        value: selectedData.value[0] // Using first value for compatibility
      });
    });
  }

  protected override handleDataSelection(data: ChartData): void {
    if (this.chart) {
      const index = this.data.findIndex(item => item.name === data.name);
      if (index !== -1) {
        this.chart.dispatchAction({
          type: 'highlight',
          dataIndex: index
        });
      }
    }
  }
}
