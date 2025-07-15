import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { Entry } from '../models/entry';
import { SharedService } from '../services/shared.service';
import { User } from '../models/user';


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
  user?: User | null;


  constructor(private sharedService: SharedService, private datePipe: DatePipe) { }


  ngOnInit(): void {
    const userId = "1";
    this.sharedService.loadUser(userId);
    this.sharedService.loadEntries(userId);
    this.sharedService.user$.subscribe(user => {
      this.user = user;

    });

    this.sharedService.entries$.subscribe(entries => {
      this.filteredValues = entries;
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const today = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
      const fromDate = this.datePipe.transform(lastWeek, 'yyyy-MM-dd') || '';
      this.generateGraph(fromDate, today);
    });
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
