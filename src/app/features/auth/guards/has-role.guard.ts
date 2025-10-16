// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';
// import { Role } from '../../shared/roles/role.enum';

// export const hasRoleGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService)
//   const router = inject(Router)
//   const roles: Role[] = route.data['roles']
//   const userHasAccess = roles.some(role => authService.isRoleAccepted(role))
//   console.log(`hasRoleGuard: User has access to roles: ${roles}`, userHasAccess);
//   if (userHasAccess) {
//     let validate: boolean = true
//     authService.validateToken()
//       .subscribe({
//         next: (res) => {
//           console.log({ res })
//           validate = true
//         },
//         error: (err) => {
//           console.log(route)
//           console.log({ err })
//           validate = false
//           router.navigateByUrl('/auth')
//         }
//       })
//     return validate
//   } else {
//     console.log(route)
//     router.navigateByUrl('/auth')
//     return false
//   }
// };
