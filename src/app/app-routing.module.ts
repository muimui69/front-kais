import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('../app/features/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('../app/features/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'users',
    loadChildren: () => import('../app/features/user-management/user-management.module').then(m => m.UserManagementModule),
  },
  {
    path: 'categories',
    loadChildren: () => import('../app/features/category/category.module').then(m => m.CategoryModule),
  },
  {
    path: 'bitacora',
    loadChildren: () => import('../app/features/bitacora/bitacora.module').then(m => m.BitacoraModule),
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
