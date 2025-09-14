import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private entriesSubject = new BehaviorSubject<Entry[]>([]);
  entries$: Observable<Entry[]> = this.entriesSubject.asObservable();

  private dashboardSubject = new BehaviorSubject<DiabetesDashboard | null>(null);
  dashboardSubject$: Observable<DiabetesDashboard | null> = this.dashboardSubject.asObservable();

  private lastUserId: string | null = null;
  private lastEntriesUserId: string | null = null;
  private lastDashboardUserId: string | null = null;
  private forceReload = false;

  constructor(private httpClient: HttpClient) {
    this.loadUserFromSessionStorage();
  }

  private loadUserFromSessionStorage(): void {
    const cachedUser = sessionStorage.getItem('cachedUser');
    const cachedUserId = sessionStorage.getItem('lastUserId');
    if (cachedUser && cachedUserId) {
      console.log('Loading user from sessionStorage:', JSON.parse(cachedUser));
      this.userSubject.next(JSON.parse(cachedUser));
      this.lastUserId = cachedUserId;
    } else {
      console.log('No user data in sessionStorage');
    }
  }

  private saveUserToSessionStorage(): void {
    if (this.userSubject.value) {
      console.log('Saving user to sessionStorage:', this.userSubject.value);
      sessionStorage.setItem('cachedUser', JSON.stringify(this.userSubject.value));
      sessionStorage.setItem('lastUserId', this.lastUserId || '');
    }
  }

  loadUser(userId: string, forceReload: boolean = false): void {
    if (!forceReload && this.lastUserId === userId && this.userSubject.value !== null) {
      console.log('Using cached user from sessionStorage');
      return;
    }

    if (!environment.production) {
      console.log(`Loading user for ID: ${userId}`);
    }

    this.httpClient.get<User>(`${environment.apiBaseUrl}/user/${userId}`)
      .pipe(
        catchError(error => {
          console.error(`Error loading user for ID ${userId}:`, error);
          return throwError(() => new Error('Failed to load user'));
        }),
        tap(user => {
          this.lastUserId = userId;
          if (!isEqual(this.userSubject.value, user)) {
            this.userSubject.next(user);
            this.saveUserToSessionStorage();
            if (!environment.production) {
              console.log(`Loaded user: ${user.lastName ?? 'Unknown'}`);
            }
          }
        })
      )
      .subscribe();
  }

  loadEntries(userId: string, forceReload: boolean = false): void {
    if (!forceReload && this.lastEntriesUserId === userId && this.entriesSubject.value.length > 0) {
      console.log('Using cached entries');
      return;
    }

    this.httpClient.get<Entry[]>(`${environment.apiBaseUrl}/getdata/${userId}`)
      .pipe(
        catchError(error => {
          console.error(`Error loading entries for ID ${userId}:`, error);
          return throwError(() => new Error('Failed to load entries'));
        }),
        tap(entries => {
          this.lastEntriesUserId = userId;
          if (!isEqual(this.entriesSubject.value, entries)) {
            this.entriesSubject.next(entries);
            console.log('Updated entries:', entries);
             this.forceReload = true;
          }
        })
      )
      .subscribe();
  }

  loadDashboard(userId: string, forceReload: boolean = false): void {
    if (!forceReload && this.lastDashboardUserId === userId && this.dashboardSubject.value !== null) {
      return;
    }

    this.httpClient.get(`${environment.apiBaseUrl}/dashboard/${userId}`)
      .pipe(
        catchError(error => {
          console.error(`Error loading dashboard for ID ${userId}:`, error);
          return throwError(() => new Error('Failed to load dashboard'));
        }),
        tap(response => {
        
          this.lastDashboardUserId = userId;
          const dashboard = DiabetesDashboard.fromJson(response);
          if (!isEqual(this.dashboardSubject.value, dashboard)) {
            this.dashboardSubject.next(dashboard);
          }
        })
      )
      .subscribe();

  }

  updateUser(user: User): void {
    if (!isEqual(this.userSubject.value, user)) {
      this.userSubject.next(user);
      this.saveUserToSessionStorage();
      this.lastDashboardUserId = null;
      this.dashboardSubject.next(null);
      console.log('User updated, dashboard cache invalidated');
    }
  }

  updateEntries(entries: Entry[]): void {
    if (!isEqual(this.entriesSubject.value, entries)) {
      this.entriesSubject.next(entries);
    }
  }

  addEntry(userId: string, entry: Entry): Observable<Entry> {
    entry.userId = userId;
    return this.httpClient.post<Entry>(`${environment.apiBaseUrl}/addEntry`, entry)
      .pipe(
        tap(newEntry => {
          if (this.lastEntriesUserId === userId) {
            const currentEntries = this.entriesSubject.value;
            const updatedEntries = [...currentEntries, newEntry];
            this.entriesSubject.next(updatedEntries);
          }
          this.lastDashboardUserId = null;
          this.dashboardSubject.next(null);
          console.log('Dashboard cache invalidated after adding entry');
        }),
        catchError(error => {
          console.error('Error adding entry:', error);
          return throwError(() => new Error('Failed to add entry'));
        })
      );
  }

  clear(): void {
    this.lastUserId = null;
    this.lastEntriesUserId = null;
    this.lastDashboardUserId = null;
    this.userSubject.next(null);
    this.entriesSubject.next([]);
    this.dashboardSubject.next(null);
    sessionStorage.removeItem('cachedUser');
    sessionStorage.removeItem('lastUserId');
    console.log('SharedService cleared');
  }
}