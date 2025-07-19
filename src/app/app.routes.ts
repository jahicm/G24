import { Routes } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { DataComponent } from './data/data.component';
import { AnalyserComponent } from './analyser/analyser.component';
import { RegistrationComponent } from './registration/registration.component';
import { PieChartComponent } from './chart/pie-chart/pie-chart.component';
import { StatisticsComponent } from './statistics/statistics.component';


export const routes: Routes = [
  { path: '', component: BaseComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'data', component: DataComponent },
  { path: 'analyser', component: AnalyserComponent },
  { path: 'statistics', component: StatisticsComponent},
  { path: '**', component: BaseComponent }

];
