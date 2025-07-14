import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  


  constructor(private httpClient: HttpClient) {}

   saveData(data: Data) {  
     return this.httpClient.post<Data>(`${environment.apiBaseUrl}/data/savedata`, data);
   }
  }