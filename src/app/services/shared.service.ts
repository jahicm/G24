import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user';
import { Entry } from '../models/entry';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { isEqual } from 'lodash';
import { DiabetesDashboard } from '../models/dashboard/diabetes-dashboard';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private lastDashboardUserId: string | null = null;
  private userSubject = new BehaviorSubject<User | null>(null);

  user$: Observable<User | null> = this.userSubject.asObservable();

  private entriesSubject = new BehaviorSubject<Entry[]>([]);
  entries$: Observable<Entry[]> = this.entriesSubject.asObservable();

  private dashboardSubject = new BehaviorSubject<DiabetesDashboard | null>(null);
  dashboardSubject$: Observable<DiabetesDashboard | null> = this.dashboardSubject.asObservable();

  private lastUserId: string | null = null;
  private lastEntriesUserId: string | null = null;

  constructor(private httpClient: HttpClient) { }

  /**
   * Loads user only if not already loaded or if userId has changed
   */
  loadUser(userId: string): void {
    if (this.lastUserId === userId && this.userSubject.value !== null) return;

    this.httpClient.get<User>(`${environment.apiBaseUrl}/data/user/${userId}`)
      .subscribe(user => {
        this.lastUserId = userId;
        if (!isEqual(this.userSubject.value, user)) {
          this.userSubject.next(user);
        }
      });
  }

  /**
   * Loads entries only if not already loaded or if userId has changed
   */
  loadEntries(userId: string): void {
    if (this.lastEntriesUserId === userId && this.entriesSubject.value.length > 0) return;

    this.httpClient.get<Entry[]>(`${environment.apiBaseUrl}/data/getdata/${userId}`)
      .subscribe(entries => {
        this.lastEntriesUserId = userId;
        if (!isEqual(this.entriesSubject.value, entries)) {
          this.entriesSubject.next(entries);
        }
      });
  }

  /**
   * Manual update for user with deep equality check
   */
  updateUser(user: User): void {
    if (!isEqual(this.userSubject.value, user)) {
      this.userSubject.next(user);
    }
  }

  /**
   * Manual update for entries with deep equality check
   */
  updateEntries(entries: Entry[]): void {
    if (!isEqual(this.entriesSubject.value, entries)) {
      this.entriesSubject.next(entries);
    }
  }

  loadDashboard(userId: string): void {
    if (this.lastDashboardUserId === userId && this.dashboardSubject.value !== null) return;

    this.httpClient.get(`${environment.apiBaseUrl}/data/dashboard/${userId}`)
      .subscribe(response => {
        this.lastDashboardUserId = userId;

        // Convert raw response JSON to DiabetesDashboard instance
        const dashboard = DiabetesDashboard.fromJson(JSON.stringify(response));

        if (!isEqual(this.dashboardSubject.value, dashboard)) {
          this.dashboardSubject.next(dashboard);
        }
      });
  }


  /**
   * Optional: Clear stored data (e.g. on logout)
   */
  clear(): void {
    this.lastUserId = null;
    this.lastEntriesUserId = null;
    this.userSubject.next(null);
    this.entriesSubject.next([]);
    this.dashboardSubject.next(null);
    this.lastDashboardUserId = null;
  }
  addEntry(userId: string, entry: Entry): Observable<Entry> {
    return this.httpClient.post<Entry>(`${environment.apiBaseUrl}/data/savedata`, entry);
  }

}
