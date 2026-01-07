import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

        const excludedUrls = [
            '/auth/login/panel',
            '/admin-auth/login',
            '/auth/login/mobile',
            '/auth/refresh'
        ];

        const isExcluded = excludedUrls.some(url => request.url.toLowerCase().includes(url.toLowerCase()));

        if (isExcluded) {
            const clonedReq = request.clone({ withCredentials: true });
            return next.handle(clonedReq);
        }

        const accessToken = this.authService.getAccessToken();

        const authReq = request.clone({
            withCredentials: true,
            ...(accessToken && {
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
        });

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                const isLoginOrLogout = request.url.includes('/login') || request.url.includes('/logout');

                if (error.status === 401 && !request.url.includes('/auth/refresh') && !isLoginOrLogout) {

                    return this.authService.refreshToken().pipe(
                        switchMap((response) => {
                            this.authService.setAccessToken(response.accessToken);
                            const retryReq = request.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${response.accessToken}`
                                },
                                withCredentials: true
                            });
                            return next.handle(retryReq);
                        }),
                        catchError((refreshError) => {
                            this.authService.logout();
                            this.router.navigate(['/auth']);
                            return throwError(() => refreshError);
                        })
                    );
                }

                return throwError(() => error);
            })
        );
    }
}
