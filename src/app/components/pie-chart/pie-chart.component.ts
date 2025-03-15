import { Component, ElementRef, ViewChild } from '@angular/core';
import { BaseChartComponent } from '../base-chart.component';
import { ChartData } from '../../services/chart-interaction.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  template: '<div #chartContainer style="width: 100%; height: 400px;"></div>'
})
export class PieChartComponent extends BaseChartComponent {
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
        text: 'Pie Chart'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [{
        type: 'pie',
        radius: '50%',
        data: this.data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
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