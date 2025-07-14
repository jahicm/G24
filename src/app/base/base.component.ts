import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { Entry } from '../models/entry';


@Component({
  selector: 'app-base',
  imports: [CommonModule, ChartComponent],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css',
})
export class BaseComponent implements OnInit {

  predictedHbA1c: string = '5.6';
  filteredValues: Entry[] = [];
  filteredGraphValues: Entry[] = [];
  fromDate: string = '';
  toDate: string = '';
  chartLabels: string[] = [];
  measurementTimeLabels: string[] = [];
  measurementValueLabels: number[] = [];

  constructor(private datePipe: DatePipe) {

    this.filteredValues.push(
      {
        dataEntryTime: new Date('2025-07-07T10:00'),
        measurementTime: new Date('2025-07-07T09:00'),
        value: 120,
        sugarValue: 5.5,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'normal'
      },
      {
        dataEntryTime: new Date('2025-07-13T10:00'),
        measurementTime: new Date('2025-07-13T09:00'),
        value: 150,
        sugarValue: 6.0,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'high'
      },
      {
        dataEntryTime: new Date('2025-07-09T10:00'),
        measurementTime: new Date('2025-07-09T09:00'),
        value: 90,
        sugarValue: 4.0,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'low'
      },
      {
        dataEntryTime: new Date('2025-07-08T10:00'),
        measurementTime: new Date('2025-07-08T09:00'),
        value: 110,
        sugarValue: 5.0,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'normal'
      },
      {
        dataEntryTime: new Date('2025-07-07T10:00'),
        measurementTime: new Date('2025-07-07T09:00'),
        value: 130,
        sugarValue: 5.8,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'elevated'
      },
      {
        dataEntryTime: new Date('2025-07-07T10:00'),
        measurementTime: new Date('2025-07-07T09:00'),
        value: 130,
        sugarValue: 12.8,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'elevated'
      },
      {
        dataEntryTime: new Date('2025-07-07T10:00'),
        measurementTime: new Date('2025-07-07T09:00'),
        value: 130,
        sugarValue: 11.8,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'elevated'
      },
      {
        dataEntryTime: new Date('2025-07-10T15:00'),
        measurementTime: new Date('2025-07-10T09:00'),
        value: 130,
        sugarValue: 5.8,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'elevated'
      },
      {
        dataEntryTime: new Date('2025-07-11T20:00'),
        measurementTime: new Date('2025-07-11T09:00'),
        value: 130,
        sugarValue: 7.8,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'elevated'
      },
      {
        dataEntryTime: new Date('2025-07-12T10:00'),
        measurementTime: new Date('2025-07-12T09:00'),
        value: 130,
        sugarValue: 7.8,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'elevated'
      }
      , {
        dataEntryTime: new Date('2025-07-13T10:00'),
        measurementTime: new Date('2025-07-13T09:00'),
        value: 130,
        sugarValue: 9.8,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'elevated'
      }
    );
  }
  ngOnInit(): void {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const today = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
    const fromDate = this.datePipe.transform(lastWeek, 'yyyy-MM-dd') || '';
    this.generateGraph(fromDate, today);
  }

  generateGraph(fromDateString: string = '', today: string = ''): void {
    
    const fromDate = new Date(fromDateString);
    const toDate = new Date(today);
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);

    this.filteredGraphValues = this.filteredValues.filter(entry => {
      const entryDate = new Date(entry.measurementTime);
      return entryDate >= fromDate && entryDate <= toDate;
    });

    this.measurementTimeLabels = this.filteredGraphValues.map(entry =>
      this.datePipe.transform(entry.measurementTime, 'dd/MM/yyyy') || ''
    );

    this.measurementValueLabels = this.filteredGraphValues.map(entry => entry.sugarValue);
  }
}
