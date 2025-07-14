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
    return this.httpClient.post<User>(`${environment.apiBaseUrl}/data/user`, user);
  }
  getUser(userId: string): Observable<User> {
    return this.httpClient.get<User>(`${environment.apiBaseUrl}/data/user/${userId}`);
  }
}
