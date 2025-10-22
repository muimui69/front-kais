import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para proteger rutas que requieren roles específicos
 * Uso en las rutas:
 * {
 *   path: 'admin',
 *   component: AdminComponent,
 *   canActivate: [authGuard, roleGuard],
 *   data: { roles: ['ADMIN', 'SUPERADMIN'] }
 * }
 */
export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const requiredRoles = route.data['roles'] as string[];

    if (!requiredRoles || requiredRoles.length === 0) {
        return true;
    }

    const user = authService.user();
    const hasRole = requiredRoles.includes(user?.role?.name || '');

    if (hasRole) {
        return true;
    }

    router.navigate(['/forbidden']);
    return false;
};