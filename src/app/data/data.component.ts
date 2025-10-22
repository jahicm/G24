import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Entry } from '../models/entry';
import { ChartComponent } from '../chart/chart.component';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from '@angular/common';
import { Utility } from '../utils/utility';
import { DataService } from '../services/dataservice.service';
import { User } from '../models/user';
import { SharedService } from '../services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [CommonModule, ChartComponent, FormsModule, TranslateModule],
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  entries: Entry[] = [];
  pagedEntries: Entry[] = [];
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  totalPagesArray: number[] = [];
  filteredValues: Entry[] = [];
  filteredGraphValues: Entry[] = [];
  chart: any;
  user!: User;
  fromDate: string = '';
  toDate: string = '';
  chartLabels: string[] = [];
  measurementTimeLabels: string[] = [];
  measurementValueLabels: number[] = [];
  locale: string | undefined;
  data: any;
  maxVisiblePages = 8;
  totalPages:number=0;

  constructor(private datePipe: DatePipe, private dataService: DataService, private sharedService: SharedService,private translate: TranslateService) { }

  ngOnInit(): void {

    const userId = Utility.decodeUserIdFromToken(sessionStorage.getItem('token') || '');
    if (userId) {
      console.log('Decoded userId from token:', userId);
    } else {
      console.log('No valid token found or unable to decode userId.');
    }
    this.sharedService.user$.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
    this.sharedService.entries$.subscribe(entries => {
      this.filteredValues = entries.slice();
      this.entries = entries;
      this.setupPagination();
    });
    this.sharedService.loadUser(userId);
    this.sharedService.loadEntries(userId);
  }

  getTotalPages():number {
  return Math.ceil(this.totalRecords / this.pageSize);
}

get visiblePages() {
  const pages = [];
  let start = Math.max(this.currentPage - Math.floor(this.maxVisiblePages / 2), 1);
  let end = Math.min(start + this.maxVisiblePages - 1, this.getTotalPages());

  // Adjust start if we are at the end
  start = Math.max(end - this.maxVisiblePages + 1, 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
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
      this.filteredValues.sort((a, b) => a.sugarValue - b.sugarValue);
    } else if (order === 'low') {
      this.filteredValues.sort((a, b) => b.sugarValue - a.sugarValue);
    } else {
      this.filteredValues = this.entries.slice();
    }
    this.currentPage = 1;
    this.setupPagination();
  }

  sortByDate(order: 'asc' | 'desc' | 'default'): void {
    if (order === 'asc') {
      this.filteredValues.sort((a, b) => new Date(a.measurementTime).getTime() - new Date(b.measurementTime).getTime());
    } else if (order === 'desc') {
      this.filteredValues.sort((a, b) => new Date(b.measurementTime).getTime() - new Date(a.measurementTime).getTime());
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
    this.entries.forEach(entry => Utility.normalizeUnit(entry, this.user));
    this.filteredGraphValues = Utility.convertStringToDateAndFilter(this.entries, this.fromDate, this.toDate);
    this.measurementTimeLabels = this.filteredGraphValues.map(entry =>

      this.datePipe.transform(entry.measurementTime, 'dd/MM/yyyy') || '');

    this.measurementValueLabels = this.filteredGraphValues.map(entry => entry.sugarValue);
  }
  generatePDF(): void {
    if (!this.fromDate || !this.toDate) {
      alert(this.translate.instant('error.pdf-error'));
      return;
    }

    this.sortByDate('asc');
    this.filteredValues = Utility.convertStringToDateAndFilter(this.entries, this.fromDate, this.toDate);
    const doc = new jsPDF();
    // ➤ Add title
    doc.setFontSize(16);
    doc.text(this.translate.instant('pdf.title'), 14, 15);

    // ➤ Add user details
    doc.setFontSize(11);
    const details = [
      this.translate.instant('pdf.full-name')+":"+`${this.user.name} ${this.user.lastName}`,
      this.translate.instant('pdf.dob')+":"+`${this.user.dob}`,
      this.translate.instant('pdf.diabetes-type')+":"+`${this.user.diabetesType}`,
      this.translate.instant('pdf.city')+":"+`${this.user.city}`
    ];

    details.forEach((line, index) => {
      doc.text(line, 14, 25 + index * 6); // Line spacing
    });

    // ➤ Prepare table data (starting below user info)
    const tableStartY = 25 + details.length * 6 + 5;

    const tableData = this.filteredValues.map(entry => [
      
      formatDate(entry.measurementTime, 'HH:mm dd/MM/yyyy','en-US'),
     
      this.translate.instant('dashboard.add_reading.' +entry.value) +' '+entry.sugarValue+' '+ entry.unit]);
    autoTable(doc, {
      startY: tableStartY,
      head: [[this.translate.instant('pdf.date'), this.translate.instant('pdf.value')]],
      body: tableData
    });

    // ➤ Save PDF
    doc.save('blood-sugar-report.pdf');
  }
}
