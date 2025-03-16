import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { ChartInteractionService, ChartData } from '../services/chart-interaction.service';
import { Subscription } from 'rxjs';
import * as echarts from 'echarts';

@Component({
  template: '',
  standalone: true
})
export abstract class BaseChartComponent implements OnInit, OnDestroy, AfterViewInit {
  protected chart: echarts.ECharts | null = null;
  protected subscription: Subscription | null = null;
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  constructor(protected chartInteractionService: ChartInteractionService) {}

  ngOnInit() {
    this.subscription = this.chartInteractionService.selectedData$.subscribe((data: ChartData | null) => {
      if (data) {
        this.handleDataSelection(data);
      }
    });
  }

  ngAfterViewInit() {
    this.initChart();
    this.resizeChart();
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeChart();
  }

  private resizeChart() {
    if (this.chart) {
      this.chart.resize({
        width: this.chartContainer.nativeElement.clientWidth,
        height: this.chartContainer.nativeElement.clientHeight
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.chart) {
      this.chart.dispose();
    }
  }

  protected abstract handleDataSelection(data: ChartData): void;
  protected abstract initChart(): void;
} 