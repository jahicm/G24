import { Routes } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { DataFormComponent } from './reactiveform/dataform.component';
import { DataComponent } from './data/data.component';
import { AnalyserComponent } from './analyser/analyser.component';


export const routes: Routes = [
  { path: '', component: BaseComponent },
  { path: 'reactive', component: DataFormComponent },
  { path: 'data', component: DataComponent },
  { path: 'analyser', component: AnalyserComponent },
  { path: '**', component: BaseComponent }

];
