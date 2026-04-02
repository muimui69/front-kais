import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarLayoutComponent } from '../../layouts/navbar-layout/navbar-layout.component';

import { PlanListComponent } from './pages/plan-list/plan-list.component';
import { PlanFormComponent } from './pages/plan-form/plan-form.component';
import { PlanDetailComponent } from './pages/plan-detail/plan-detail.component';
import { FeatureCatalogComponent } from './pages/feature-catalog/feature-catalog.component';
import { SubscriptionListComponent } from './pages/subscription-list/subscription-list.component';
import { SubscriptionDetailComponent } from './pages/subscription-detail/subscription-detail.component';
import { authGuard } from '../auth/guards/auth.guard';
import { permissionGuard } from '../auth/guards/perimission.guard';

const routes: Routes = [
  {
    path: '',
    component: NavbarLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: PlanListComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['planes_plan_listar'] },
      },
      {
        path: 'create',
        component: PlanFormComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['planes_plan_crear'] },
      },
      {
        path: 'features',
        component: FeatureCatalogComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['planes_feature_listar'] },
      },
      {
        path: 'subscriptions',
        component: SubscriptionListComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['planes_suscripcion_listar'] },
      },
      {
        path: 'subscriptions/:id',
        component: SubscriptionDetailComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['planes_suscripcion_ver'] },
      },
      {
        path: ':id',
        component: PlanDetailComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['planes_plan_ver'] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanesRoutingModule {}
