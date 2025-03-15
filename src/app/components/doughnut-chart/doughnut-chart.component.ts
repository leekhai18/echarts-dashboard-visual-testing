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
    { name: 'Category A', value: 150 },
    { name: 'Category B', value: 230 },
    { name: 'Category C', value: 180 },
    { name: 'Category D', value: 320 },
    { name: 'Category E', value: 250 }
  ];

  private lastSelectedName: string = '';

  protected override initChart(): void {
    this.chart = echarts.init(this.chartContainer.nativeElement);
    const option = {
      title: {
        text: 'Doughnut Chart',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center'
      },
      series: [{
        name: 'Categories',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
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
            fontSize: 20,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        labelLine: {
          show: false
        },
        data: this.data.map(item => ({
          name: item.name,
          value: item.value,
          itemStyle: {
            normal: {
              opacity: 1
            },
            emphasis: {
              opacity: 1
            }
          }
        })),
        animationDuration: 300
      }]
    };

    this.chart.setOption(option);
    
    this.chart.on('click', (params) => {
      // Clear previous selection
      if (this.lastSelectedName) {
        this.chart?.dispatchAction({
          type: 'downplay',
          name: this.lastSelectedName
        });
      }

      const selectedData = this.data.find(item => item.name === params.name);
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
