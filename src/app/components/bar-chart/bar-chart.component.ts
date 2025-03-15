import { Component, ElementRef, ViewChild } from '@angular/core';
import { BaseChartComponent } from '../base-chart.component';
import { ChartData } from '../../services/chart-interaction.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  template: '<div #chartContainer style="width: 100%; height: 400px;"></div>'
})
export class BarChartComponent extends BaseChartComponent {
  private data = [
    { name: 'Category A', value: 100 },
    { name: 'Category B', value: 200 },
    { name: 'Category C', value: 300 },
    { name: 'Category D', value: 400 },
    { name: 'Category E', value: 500 }
  ];

  protected initChart(): void {
    this.chart = echarts.init(this.chartContainer.nativeElement);
    const option = {
      title: {
        text: 'Bar Chart'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: this.data.map(item => item.name)
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: this.data.map(item => item.value),
        type: 'bar',
        emphasis: {
          focus: 'series'
        }
      }]
    };

    this.chart.setOption(option);
    this.chart.on('click', (params) => {
      const selectedData = this.data[params.dataIndex];
      this.chartInteractionService.updateSelectedData(selectedData);
    });
  }

  protected handleDataSelection(data: ChartData): void {
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