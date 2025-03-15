import { Component } from '@angular/core';
import { BaseChartComponent } from '../base-chart.component';
import { ChartData } from '../../services/chart-interaction.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-doughnut-chart',
  standalone: true,
  template: '<div #chartContainer style="width: 100%; height: 400px;"></div>'
})
export class DoughnutChartComponent extends BaseChartComponent {
  private data = [
    { name: 'Category A', value: 100 },
    { name: 'Category B', value: 200 },
    { name: 'Category C', value: 300 },
    { name: 'Category D', value: 400 },
    { name: 'Category E', value: 500 }
  ];

  protected override initChart(): void {
    this.chart = echarts.init(this.chartContainer.nativeElement);
    const option = {
      title: {
        text: 'Doughnut Chart'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: this.data
      }]
    };

    this.chart.setOption(option);
    this.chart.on('click', (params) => {
      const selectedData = this.data[params.dataIndex];
      this.chartInteractionService.updateSelectedData(selectedData);
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
