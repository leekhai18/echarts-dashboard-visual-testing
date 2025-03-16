import { Component } from '@angular/core';
import { BaseChartComponent } from '../base-chart.component';
import { ChartData } from '../../services/chart-interaction.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  template: '<div #chartContainer data-testid="chart-container" style="width: 400px; height: 400px;"></div>'
})
export class BarChartComponent extends BaseChartComponent {
  private data = [
    { name: 'Category A', value: 150 },
    { name: 'Category B', value: 230 },
    { name: 'Category C', value: 180 },
    { name: 'Category D', value: 320 },
    { name: 'Category E', value: 250 }
  ];

  private lastSelectedIndex: number = -1;

  protected override initChart(): void {
    this.chart = echarts.init(this.chartContainer.nativeElement, null, {
      width: 400,
      height: 400
    });
    const option = {
      title: {
        text: 'Bar Chart'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
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
          itemStyle: {
            color: '#5470c6'
          },
          emphasis: {
            itemStyle: {
              color: '#91cc75'
            }
          }
        })),
        type: 'bar',
        emphasis: {
          focus: 'series',
          blurScope: 'coordinateSystem'
        },
        animationDuration: 300
      }]
    };

    this.chart.setOption(option);
    this.chart.resize();

    this.chart.on('click', (params) => {
      // Clear previous selection
      if (this.lastSelectedIndex !== -1) {
        this.chart?.dispatchAction({
          type: 'downplay',
          dataIndex: this.lastSelectedIndex
        });
      }

      const selectedData = this.data[params.dataIndex];
      this.lastSelectedIndex = params.dataIndex;

      // Highlight new selection
      this.chart?.dispatchAction({
        type: 'highlight',
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
          dataIndex: this.lastSelectedIndex
        });
      }

      const index = this.data.findIndex(item => item.name === data.name);
      if (index !== -1) {
        this.lastSelectedIndex = index;
        this.chart.dispatchAction({
          type: 'highlight',
          dataIndex: index
        });
      }
    }
  }
} 