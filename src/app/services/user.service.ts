import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  saveUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${environment.apiBaseUrl}/user`, user);
  }
  getUser(userId: string): Observable<User> {
    console.log("USER ID :",userId);
    return this.httpClient.get<User>(`${environment.apiBaseUrl}/user/${userId}`);
  }
}
