import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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

    /**
     * Login para panel de administración
     * @param {string} userName - Nombre de usuario
     * @param {string} password - Contraseña
     * @returns {Observable<LoginResponse>}
     */
    loginPanel(userName: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(
            `${this.baseUrl}/auth/login/panel`,
            { userName, password },
            { withCredentials: true }
        ).pipe(
            tap(response => {
                this.setAccessToken(response.accessToken);
                this.currentUserSubject.next(response.user);
                this.saveUserToSession(response.user);
            })
        );
    }

    /**
     * Login para app móvil
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña
     * @returns {Observable<LoginResponse>}
     */
    loginMobile(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(
            `${this.baseUrl}/auth/login/mobile`,
            { email, password },
            { withCredentials: true }
        ).pipe(
            tap(response => {
                this.setAccessToken(response.accessToken);
                this.currentUserSubject.next(response.user);
                this.saveUserToSession(response.user);
            })
        );
    }

    /**
     * Refrescar access token usando refresh token (HttpOnly cookie)
     * @returns {Observable<RefreshResponse>}
     */
    refreshToken(): Observable<RefreshResponse> {
        return this.http.post<RefreshResponse>(
            `${this.baseUrl}/auth/refresh`,
            {},
            { withCredentials: true }
        );
    }

    /**
     * Cerrar sesión
     */
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

    /**
     * Obtener access token actual
     */
    getAccessToken(): string | null {
        return this.accessTokenSubject.value;
    }

    /**
     * Guardar access token en memoria
     */
    setAccessToken(token: string): void {
        this.accessTokenSubject.next(token);
    }

    /**
     * Obtener usuario actual
     */
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    /**
     * Verificar si está autenticado
     */
    isAuthenticated(): boolean {
        return !!this.accessTokenSubject.value;
    }

    /**
     * Verificar si tiene un permiso específico
     */
    hasPermission(permissionName: string): boolean {
        const user = this.currentUserSubject.value;
        if (!user || !user.permissions) return false;
        return user.permissions.some(p => p.name === permissionName);
    }

    /**
     * Verificar si tiene alguno de los permisos especificados
     */
    hasAnyPermission(permissionNames: string[]): boolean {
        const user = this.currentUserSubject.value;
        if (!user || !user.permissions) return false;
        return permissionNames.some(name =>
            user.permissions.some(p => p.name === name)
        );
    }

    /**
     * Verificar si tiene todos los permisos especificados
     */
    hasAllPermissions(permissionNames: string[]): boolean {
        const user = this.currentUserSubject.value;
        if (!user || !user.permissions) return false;
        return permissionNames.every(name =>
            user.permissions.some(p => p.name === name)
        );
    }

    /**
     * Verificar si tiene un rol específico
     */
    hasRole(roleName: string): boolean {
        const user = this.currentUserSubject.value;
        return user?.role?.name === roleName;
    }

    /**
     * Guardar usuario en sessionStorage
     */
    private saveUserToSession(user: User): void {
        sessionStorage.setItem('user', JSON.stringify(user));
    }

    /**
     * Cargar usuario desde sessionStorage
     */
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

    /**
     * Limpiar sesión
     */
    private clearSession(): void {
        this.accessTokenSubject.next(null);
        this.currentUserSubject.next(null);
        sessionStorage.removeItem('user');
    }
}