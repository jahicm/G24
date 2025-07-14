import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chart',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements OnChanges {
  chartLabel: string = 'Blood Sugar Value';
  lineChartType: ChartType = 'line';
  @Input() lineChartLabels: string[] = [];
  @Input() data: number[] = [];
  lineChartData: any;
  lineChartOptions: any;

  constructor() {

    this.lineChartOptions = {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date/Time',
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10,
          },
        },
        y: {
          title: {
            display: true,
            text: 'Value (mg/dL)',
          },
        },
      },
    };
    this.updateChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChartData();
  }

  private updateChartData(): void {
    this.lineChartData = {
      labels: this.lineChartLabels,
      datasets: [
        {
          label: this.chartLabel,
          data: this.data,
          borderColor: '#2f80ed',
          backgroundColor: 'rgba(161, 198, 247, 0.4)',
          tension: 0.3
        },
      ],
    };
  }
}
