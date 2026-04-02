import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Checking authentication status...');

  if (authService.isAuthenticated()) {
    console.log('User is authenticated, allowing access to route.');
    return true;

  }

  console.log('User is not authenticated, verifying session with backend...');
  return authService.verifySession().pipe(
    map(isValid => {
      console.log('Session verification result:', isValid);
      if (isValid) {
        return true;
      }

      console.log('Session is not valid, redirecting to login page.');
      router.navigate(['/auth'], {
        queryParams: { returnUrl: state.url }
      });

      return false;
    })
  );
};
