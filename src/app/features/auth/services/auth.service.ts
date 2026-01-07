import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environment/environment';
// Asegúrate de que tus interfaces coincidan con las que creamos en el paso anterior
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
           const user = admin.user;

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
         if(response.data) {
            this.setAccessToken(response.data.accessToken);

         }
      })
    );
  }

  refreshToken(): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>(
      `${this.baseUrl}/auth/refresh`,
      {},
      { withCredentials: true }
    );
  }

  logout(): void {
    this.http.post(
      `${this.baseUrl}/auth/logout`,
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
    return !!this.accessTokenSubject.value;
  }

  // NOTA: En tu JSON 'permissions' venía como null.
  // Asegúrate de manejar eso en la interfaz User (permissions?: Permission[])
  hasPermission(permissionName: string): boolean {
    const user = this.currentUserSubject.value;
    // @ts-ignore: Si permissions no está en la interfaz User, esto marcará error.
    if (!user || !user.permissions) return false;
    // @ts-ignore
    return user.permissions.some(p => p.name === permissionName);
  }

  hasAnyPermission(permissionNames: string[]): boolean {
    const user = this.currentUserSubject.value;
    // @ts-ignore
    if (!user || !user.permissions) return false;
    return permissionNames.some(name =>
      // @ts-ignore
      user.permissions.some(p => p.name === name)
    );
  }

  hasAllPermissions(permissionNames: string[]): boolean {
    const user = this.currentUserSubject.value;
    // @ts-ignore
    if (!user || !user.permissions) return false;
    return permissionNames.every(name =>
      // @ts-ignore
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
        console.error('Error loading user from session:', e);
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
