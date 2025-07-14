import { Routes } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { DataComponent } from './data/data.component';
import { AnalyserComponent } from './analyser/analyser.component';
import { RegistrationComponent } from './registration/registration.component';


export const routes: Routes = [
  { path: '', component: BaseComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'data', component: DataComponent },
  { path: 'analyser', component: AnalyserComponent },
  { path: '**', component: BaseComponent }

];
