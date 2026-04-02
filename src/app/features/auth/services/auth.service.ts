import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environment/environment';
import { LoginResponse, RefreshResponse, User } from '../interfaces/auth.inteface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = environment.baseUrl;

  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public accessToken$ = this.accessTokenSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromSession();
  }

  loginPanel(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/admin-auth/login`,
      { username, password },
      { withCredentials: true }
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          const { accessToken, admin } = response.data;
          const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
          const user: User = {
            id: admin.id,
            name: admin.name,
            lastName: admin.lastName,
            email: admin.email,
            username: admin.username,
            phone: admin.phone,
            photoUrl: admin.photoUrl,
            role: admin.role!,
            fullName: admin.fullName ?? `${admin.name} ${admin.lastName}`,
            permissions: tokenPayload.permissions ?? []
          };
          this.setAccessToken(accessToken);
          this.currentUserSubject.next(user);
          this.saveUserToSession(user);
        }
      })
    );
  }

  loginMobile(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/auth/login/mobile`,
      { email, password },
      { withCredentials: true }
    ).pipe(
      tap(response => {
        if (response.data) {
          this.setAccessToken(response.data.accessToken);
        }
      })
    );
  }

  refreshToken(): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>(
      `${this.baseUrl}/admin-auth/refresh`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setAccessToken(response.data.accessToken);
        }
      })
    );
  }

  verifySession(): Observable<boolean> {
    console.log('Verifying session...');
    return this.http.get<any>(
      `${this.baseUrl}/admin-auth/me`,
      { withCredentials: true }
    ).pipe(
      tap(response => {
        if (response && response.data) {
          console.log('response', response)
          this.currentUserSubject.next(response.data);
          this.saveUserToSession(response.data);
        }
      }),
      map(() => true),
      catchError(() => {
        this.clearSession();
        return of(false);
      })
    );
  }

  logout(): void {
    this.http.post(
      `${this.baseUrl}/admin-auth/logout`,
      {},
      { withCredentials: true }
    ).subscribe({
      next: () => {
        this.clearSession();
        this.router.navigate(['/auth']);
      },
      error: () => {
        this.clearSession();
        this.router.navigate(['/auth']);
      }
    });
  }

  getAccessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  setAccessToken(token: string): void {
    this.accessTokenSubject.next(token);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasPermission(permissionName: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user || !user.permissions) return false;
    return user.permissions.some(p => p.name === permissionName);
  }

  hasAnyPermission(permissionNames: string[]): boolean {
    const user = this.currentUserSubject.value;
    if (!user || !user.permissions) return false;
    return permissionNames.some(name =>
      user.permissions.some(p => p.name === name)
    );
  }

  hasAllPermissions(permissionNames: string[]): boolean {
    const user = this.currentUserSubject.value;
    if (!user || !user.permissions) return false;
    return permissionNames.every(name =>
      user.permissions.some(p => p.name === name)
    );
  }

  hasRole(roleName: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role?.name === roleName;
  }

  private saveUserToSession(user: User): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  private loadUserFromSession(): void {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        this.currentUserSubject.next(JSON.parse(userStr));
      } catch (e) {
        sessionStorage.removeItem('user');
      }
    }
  }

  private clearSession(): void {
    this.accessTokenSubject.next(null);
    this.currentUserSubject.next(null);
    sessionStorage.removeItem('user');
  }
}
