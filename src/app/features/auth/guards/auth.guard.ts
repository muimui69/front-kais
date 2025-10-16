// import { inject, PLATFORM_ID, Inject } from '@angular/core';
// import { CanActivateChildFn, Router } from '@angular/router';
// // import { AuthService } from '../services/auth.service';
// import { isPlatformBrowser } from '@angular/common';

// export const authGuard: CanActivateChildFn = (childRoute, state) => {
//   // const authService = inject(AuthService);
//   const router = inject(Router);
//   const platformId = inject(PLATFORM_ID);

//   if (!isPlatformBrowser(platformId)) {
//     return true;
//   }

//   // if (authService.isLogged()) {
//   //   return true;
//   // } else {
//   //   router.navigateByUrl('/auth');
//   //   return false;
//   // }
// };