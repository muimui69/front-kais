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
    path: 'publicidad',
    loadChildren: () => import('../app/features/advertising/advertising.module').then(m => m.AdvertisingModule),
  },
  {
    path: 'companies',
    loadChildren: () => import('../app/features/company/company.module').then(m => m.CompanyModule),
  },
  {
    path: 'ad-plans',
    loadChildren: () => import('../app/features/ad-plan/ad-plan.module').then(m => m.AdPlanModule),
  },
  {
    path: 'ad-subscriptions',
    loadChildren: () => import('../app/features/ad-subscription/ad-subscription.module').then(m => m.AdSubscriptionModule),
  },
  {
    path: 'coupons',
    loadChildren: () => import('../app/features/coupons/coupons.module').then(m => m.CouponsModule),
  },
  {
    path: 'referrals',
    loadChildren: () => import('../app/features/referrals/referrals.module').then(m => m.ReferralsModule),
  },
  {
    path: 'credits',
    loadChildren: () => import('../app/features/credits/credits.module').then(m => m.CreditsModule),
  },
  {
    path: 'notifications',
    loadChildren: () => import('../app/features/notifications/notifications.module').then(m => m.NotificationsModule),
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
