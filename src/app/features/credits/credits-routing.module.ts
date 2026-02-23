import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarLayoutComponent } from '../../layouts/navbar-layout/navbar-layout.component';
import { CreditsDashboardComponent } from './pages/credits-dashboard/credits-dashboard.component';
import { UserSearchComponent } from './pages/user-search/user-search.component';
import { UserCreditDetailComponent } from './pages/user-credit-detail/user-credit-detail.component';
import { GrantCreditsComponent } from './pages/grant-credits/grant-credits.component';
import { BulkGrantComponent } from './pages/bulk-grant/bulk-grant.component';
import { ExpirationsMonitorComponent } from './pages/expirations-monitor/expirations-monitor.component';
import { AuditTableComponent } from './pages/audit-table/audit-table.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarLayoutComponent,
    children: [
      {
        path: '',
        component: CreditsDashboardComponent
      },
      {
        path: 'search',
        component: UserSearchComponent
      },
      {
        path: 'users/:userId',
        component: UserCreditDetailComponent
      },
      {
        path: 'grant',
        component: GrantCreditsComponent
      },
      {
        path: 'bulk-grant',
        component: BulkGrantComponent
      },
      {
        path: 'expirations',
        component: ExpirationsMonitorComponent
      },
      {
        path: 'audit',
        component: AuditTableComponent
      }
      // TODO: Crear componente de reembolsos (opcional)
      // {
      //   path: 'refund',
      //   component: RefundCreditsComponent
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditsRoutingModule { }
