import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { Entry } from '../models/entry';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  private entriesSubject = new BehaviorSubject<Entry[]>([]);
  entries$: Observable<Entry[]> = this.entriesSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  loadUser(userId: string): void {
    this.httpClient.get<User>(`${environment.apiBaseUrl}/data/user/${userId}`)
      .subscribe(user => this.userSubject.next(user));
  }

  loadEntries(userId: string): void {
    this.httpClient.get<Entry[]>(`${environment.apiBaseUrl}/data/getdata/${userId}`)
      .subscribe(entries => this.entriesSubject.next(entries));
  }

  updateUser(user: User): void {
    this.userSubject.next(user);
  }

  updateEntries(entries: Entry[]): void {
    this.entriesSubject.next(entries);
  }
}
