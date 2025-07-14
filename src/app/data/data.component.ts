import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Entry } from '../models/entry';
import { ChartComponent } from '../chart/chart.component';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from '@angular/common';
import { Utility } from '../utils/utility';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [CommonModule, ChartComponent, FormsModule],
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  entries: Entry[] = [];
  pagedEntries: Entry[] = [];
  currentPage = 1;
  pageSize = 3;
  totalPages = 0;
  totalPagesArray: number[] = [];
  filteredValues: Entry[] = [];
  filteredGraphValues: Entry[] = [];
  chart: any;
  user: any;
  fromDate: string = '';
  toDate: string = '';
  chartLabels: string[] = [];
  measurementTimeLabels: string[] = [];
  measurementValueLabels: number[] = [];

  constructor(private datePipe: DatePipe) {

    this.user = {
      firstName: 'Mirza',
      lastName: 'Jahic',
      age: 42,
      diabetesType: 'Type 2',
      city: 'Schlieren',
      unit: 'mg/dL'
    };
    this.entries.push(
      {
        dataEntryTime: new Date('2023-10-01T10:00'),
        measurementTime: new Date('2023-10-01T09:00'),
        value: 120,
        sugarValue: 5.5,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'normal'
      },
      {
        dataEntryTime: new Date('2023-10-02T10:00'),
        measurementTime: new Date('2023-10-02T09:00'),
        value: 150,
        sugarValue: 6.0,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'high'
      },
      {
        dataEntryTime: new Date('2024-10-03T10:00'),
        measurementTime: new Date('2024-10-03T09:00'),
        value: 90,
        sugarValue: 4.0,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'low'
      },
      {
        dataEntryTime: new Date('2023-10-04T10:00'),
        measurementTime: new Date('2023-10-04T09:00'),
        value: 110,
        sugarValue: 5.0,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'normal'
      },
      {
        dataEntryTime: new Date('2023-10-05T10:00'),
        measurementTime: new Date('2023-10-05T09:00'),
        value: 130,
        sugarValue: 5.8,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'elevated'
      },
      {
        dataEntryTime: new Date('2024-01-05T10:00'),
        measurementTime: new Date('2024-01-05T09:00'),
        value: 130,
        sugarValue: 12.8,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'elevated'
      },
      {
        dataEntryTime: new Date('2024-05-05T10:00'),
        measurementTime: new Date('2024-05-05T09:00'),
        value: 130,
        sugarValue: 11.8,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'elevated'
      },
      {
        dataEntryTime: new Date('2024-05-05T15:00'),
        measurementTime: new Date('2024-05-05T09:00'),
        value: 130,
        sugarValue: 5.8,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'elevated'
      },
      {
        dataEntryTime: new Date('2024-05-05T20:00'),
        measurementTime: new Date('2024-05-05T09:00'),
        value: 130,
        sugarValue: 7.8,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'elevated'
      },
      {
        dataEntryTime: new Date('2024-10-05T10:00'),
        measurementTime: new Date('2024-10-05T09:00'),
        value: 130,
        sugarValue: 7.8,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'elevated'
      }
      , {
        dataEntryTime: new Date('2025-01-05T10:00'),
        measurementTime: new Date('2025-01-05T09:00'),
        value: 130,
        sugarValue: 9.8,
        unit: 'mg/dL',
        referenceValue: 100,
        status: 'elevated'
      }
    );
  }

  ngOnInit(): void {
    this.filteredValues = this.entries.slice();
    this.sortByValue('default');
  }

  setupPagination(): void {
    this.totalPages = Math.ceil(this.filteredValues.length / this.pageSize);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePagedEntries();
  }

  updatePagedEntries(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedEntries = this.filteredValues.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedEntries();
  }

  sortByValue(order: 'high' | 'low' | 'default'): void {
    if (order === 'high') {
      this.filteredValues.sort((a, b) => a.value - b.value);
    } else if (order === 'low') {
      this.filteredValues.sort((a, b) => b.value - a.value);
    } else {
      this.filteredValues = this.entries.slice();
    }
    this.currentPage = 1;
    this.setupPagination();
  }

  sortByDate(order: 'asc' | 'desc' | 'default'): void {
    if (order === 'asc') {
      this.filteredValues.sort((a, b) => a.measurementTime.getTime() - b.measurementTime.getTime());
    } else if (order === 'desc') {
      this.filteredValues.sort((a, b) => b.measurementTime.getTime() - a.measurementTime.getTime());
    } else {
      this.filteredValues = this.entries.slice();
    }
    this.currentPage = 1;
    this.setupPagination();
  }
  sortByStatus(status: 'high' | 'norm' | 'elev' | 'low' | 'default'): void {
    switch (status) {
      case 'high':
        this.filteredValues = this.entries.slice();
        this.filteredValues = this.filteredValues.filter(entry => entry.status === 'high');
        break;
      case 'norm':
        this.filteredValues = this.entries.slice();
        this.filteredValues = this.filteredValues.filter(entry => entry.status === 'normal');
        break;
      case 'elev':
        this.filteredValues = this.entries.slice();
        this.filteredValues = this.filteredValues.filter(entry => entry.status === 'elevated');
        break;
      case 'low':
        this.filteredValues = this.entries.slice();
        this.filteredValues = this.filteredValues.filter(entry => entry.status === 'low');
        break;
      default:
        this.filteredValues = this.entries.slice();
        break;
    }
    this.currentPage = 1;
    this.setupPagination();
  }
  generateGraph() {

    if (!this.fromDate || !this.toDate) {
      alert('Please select both From Date and To Date');
      return;
    }
    this.filteredGraphValues = Utility.convertStringToDateAndFilter(this.entries, this.fromDate, this.toDate);
    this.measurementTimeLabels = this.filteredGraphValues.map(entry =>
      this.datePipe.transform(entry.measurementTime, 'dd/MM/yyyy') || ''
    );

    this.measurementValueLabels = this.filteredGraphValues.map(entry => entry.sugarValue);
  }
  generatePDF(): void {
    if (!this.fromDate || !this.toDate) {
      alert('Please select both From Date and To Date');
      return;
    }

    this.sortByDate('asc');
    this.filteredValues = Utility.convertStringToDateAndFilter(this.entries, this.fromDate, this.toDate);
    const doc = new jsPDF();
    // ➤ Add title
    doc.setFontSize(16);
    doc.text('Blood Sugar Report', 14, 15);

    // ➤ Add user details
    doc.setFontSize(11);
    const details = [
      `Name: ${this.user.firstName} ${this.user.lastName}`,
      `Age: ${this.user.age}`,
      `Diabetes Type: ${this.user.diabetesType}`,
      `City: ${this.user.city}`
    ];

    details.forEach((line, index) => {
      doc.text(line, 14, 25 + index * 6); // Line spacing
    });

    // ➤ Prepare table data (starting below user info)
    const tableStartY = 25 + details.length * 6 + 5;

    const tableData = this.filteredValues.map(entry => [
      formatDate(entry.measurementTime, 'dd MMMM yyyy', 'en-US'),
      entry.value + ' ' + entry.unit
    ]);

    autoTable(doc, {
      startY: tableStartY,
      head: [['Date', 'Value']],
      body: tableData
    });

    // ➤ Save PDF
    doc.save('blood-sugar-report.pdf');
  }
}
