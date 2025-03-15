import { Component } from '@angular/core';
import { BaseChartComponent } from '../base-chart.component';
import { ChartData } from '../../services/chart-interaction.service';
import * as echarts from 'echarts';

interface ScatterDataItem {
  name: string;
  value: number;
  size: number;
}

@Component({
  selector: 'app-scatter-chart',
  standalone: true,
  template: '<div #chartContainer style="width: 100%; height: 400px;"></div>'
})
export class ScatterChartComponent extends BaseChartComponent {
  private data: ScatterDataItem[] = [
    { name: 'Category A', value: 150, size: 20 },
    { name: 'Category B', value: 230, size: 30 },
    { name: 'Category C', value: 180, size: 25 },
    { name: 'Category D', value: 320, size: 35 },
    { name: 'Category E', value: 250, size: 28 }
  ];

  private lastSelectedName: string = '';

  protected override initChart(): void {
    this.chart = echarts.init(this.chartContainer.nativeElement);
    const option = {
      title: {
        text: 'Scatter Chart',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params: echarts.DefaultLabelFormatterCallbackParams) {
          const data = params.data as ScatterDataItem;
          return `${data.name}: ${data.value}`;
        }
      },
      xAxis: {
        type: 'category',
        data: this.data.map(item => item.name),
        boundaryGap: true,
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        type: 'scatter',
        data: this.data.map(item => ({
          name: item.name,
          value: item.value,
          symbolSize: item.size,
          itemStyle: {
            normal: {
              color: '#5470c6',
              opacity: 0.8,
              borderColor: '#fff',
              borderWidth: 2
            },
            emphasis: {
              color: '#91cc75',
              opacity: 1,
              borderColor: '#fff',
              borderWidth: 3,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          }
        })),
        emphasis: {
          focus: 'series',
          blurScope: 'coordinateSystem'
        },
        animationDuration: 300
      }]
    };

    this.chart.setOption(option);
    
    this.chart.on('click', (params: echarts.ECElementEvent) => {
      // Clear previous selection
      if (this.lastSelectedName) {
        this.chart?.dispatchAction({
          type: 'downplay',
          name: this.lastSelectedName
        });
      }

      const data = params.data as ScatterDataItem;
      const selectedData = this.data.find(item => item.name === data.name);
      if (selectedData) {
        this.lastSelectedName = selectedData.name;

        // Highlight new selection
        this.chart?.dispatchAction({
          type: 'highlight',
          name: selectedData.name
        });

        this.chartInteractionService.updateSelectedData(selectedData);
      }
    });
  }

  protected override handleDataSelection(data: ChartData): void {
    if (this.chart) {
      // Clear previous selection
      if (this.lastSelectedName) {
        this.chart.dispatchAction({
          type: 'downplay',
          name: this.lastSelectedName
        });
      }

      const selectedData = this.data.find(item => item.name === data.name);
      if (selectedData) {
        this.lastSelectedName = selectedData.name;
        this.chart.dispatchAction({
          type: 'highlight',
          name: selectedData.name
        });
      }
    }
  }
}
