import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { Entry } from '../models/entry';
import { SharedService } from '../services/shared.service';
import { User } from '../models/user';
import { FormsModule } from '@angular/forms';
import { filter, Subject, take, takeUntil } from 'rxjs';
import { DiabetesDashboard } from '../models/dashboard/diabetes-dashboard';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-base',
  imports: [CommonModule, ChartComponent, FormsModule,TranslateModule],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css',
})
export class BaseComponent implements OnInit {

  filteredValues: Entry[] = [];
  filteredGraphValues: Entry[] = [];
  fromDate: string = '';
  toDate: string = '';
  chartLabels: string[] = [];
  measurementTimeLabels: string[] = [];
  measurementValueLabels: number[] = [];
  user!: User | null;
  unit: string = 'mg/dL';
  timeOfMeal?: Date;
  dateTime?: Date;
  dashboard?: DiabetesDashboard;
  private destroy$ = new Subject<void>();

  constructor(private sharedService: SharedService, private datePipe: DatePipe) { }


  ngOnInit(): void {
    const userId = "1"; // eventually from AuthService

    this.sharedService.loadUser(userId, true);
    this.sharedService.loadEntries(userId,true);
    this.sharedService.loadDashboard(userId, true);

    this.sharedService.user$
      .pipe(filter(user => !!user), take(1))  // Waits for real value
      .subscribe(user => {
        this.user = user;
      });

    this.sharedService.entries$
      .pipe(takeUntil(this.destroy$))
      .subscribe(entries => {
        this.filteredValues = entries;

        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 7);
        const toDate = new Date();

        this.generateGraph(fromDate, toDate);
      });

    this.sharedService.dashboardSubject$
      .pipe(takeUntil(this.destroy$))
      .subscribe(dashboard => {
        if (dashboard) {
          this.dashboard = dashboard;
        }
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  generateGraph(fromDate: Date, toDate: Date): void {

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
  onSubmit(form: any): void {
    const formData = form.value;
    const userId = form.userId;
    const measurementTime = formData.dateTime ? new Date(formData.dateTime) : new Date();
    const sugarValue = Number(formData.sugarValue);
    const value = formData.timeOfMeal;
    const dataEntryTime = new Date();
    const referenceValue = 100; // example fixed value
    const timeSlot = formData.measurementTime
    let status: 'normal' | 'high' | 'low' | 'elevated' = 'normal';
    if (sugarValue > 140) status = 'high';
    else if (sugarValue < 70) status = 'low';
    else if (sugarValue > 120) status = 'elevated';

    const newEntry: Entry = {
      userId,
      dataEntryTime,
      measurementTime,
      sugarValue,
      value,
      unit: formData.unit,
      referenceValue,
      status
    };

    this.sharedService.addEntry(this.user!.userId, newEntry).subscribe(savedEntry => {
      this.sharedService.loadEntries(this.user!.userId);
    });
  }

}
