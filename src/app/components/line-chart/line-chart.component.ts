import { Component } from '@angular/core';
import { BaseChartComponent } from '../base-chart.component';
import { ChartData } from '../../services/chart-interaction.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  template: '<div #chartContainer style="width: 100%; height: 400px;"></div>'
})
export class LineChartComponent extends BaseChartComponent {
  private data = [
    { name: 'Category A', value: 150 },
    { name: 'Category B', value: 230 },
    { name: 'Category C', value: 180 },
    { name: 'Category D', value: 320 },
    { name: 'Category E', value: 250 }
  ];

  private lastSelectedIndex: number = -1;

  protected override initChart(): void {
    this.chart = echarts.init(this.chartContainer.nativeElement);
    const option = {
      title: {
        text: 'Line Chart'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      xAxis: {
        type: 'category',
        data: this.data.map(item => item.name)
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: this.data.map(item => ({
          value: item.value,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            normal: {
              color: '#5470c6'
            },
            emphasis: {
              color: '#91cc75',
              borderWidth: 3,
              borderColor: '#fff'
            }
          }
        })),
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series',
          blurScope: 'coordinateSystem'
        },
        animationDuration: 300
      }]
    };

    this.chart.setOption(option);
    
    this.chart.on('click', (params) => {
      // Clear previous selection
      if (this.lastSelectedIndex !== -1) {
        this.chart?.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: this.lastSelectedIndex
        });
      }

      const selectedData = this.data[params.dataIndex];
      this.lastSelectedIndex = params.dataIndex;

      // Highlight new selection
      this.chart?.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: params.dataIndex
      });

      this.chartInteractionService.updateSelectedData(selectedData);
    });
  }

  protected override handleDataSelection(data: ChartData): void {
    if (this.chart) {
      // Clear previous selection
      if (this.lastSelectedIndex !== -1) {
        this.chart.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: this.lastSelectedIndex
        });
      }

      const index = this.data.findIndex(item => item.name === data.name);
      if (index !== -1) {
        this.lastSelectedIndex = index;
        this.chart.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: index
        });
      }
    }
  }
}
