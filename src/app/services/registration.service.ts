import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private httpClient: HttpClient) { }

  registerUser(user: User) {
    return this.httpClient.post<User>(`${environment.apiBaseUrl}/register`, user);
  }
  firstRegistration(user: User) {
    return this.httpClient.post<User>(`${environment.apiBaseUrl}/first-register`, user);
  }
}