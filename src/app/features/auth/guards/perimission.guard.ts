import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para proteger rutas que requieren permisos específicos
 * Uso en las rutas:
 * {
 *   path: 'users/create',
 *   component: CreateUserComponent,
 *   canActivate: [authGuard, permissionGuard],
 *   data: { permissions: ['usuarios_usuario_crear'] }
 * }
 */
export const permissionGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const requiredPermissions = route.data['permissions'] as string[];

    if (!requiredPermissions || requiredPermissions.length === 0) {
        return true;
    }

    const hasPermission = authService.hasAnyPermission(requiredPermissions);

    if (hasPermission) {
        return true;
    }

    router.navigate(['/forbidden']);
    return false;
};