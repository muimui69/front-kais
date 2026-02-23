import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditsRoutingModule } from './credits-routing.module';
import { CreditTypePipe } from './pipes/credit-type.pipe';
import { CreditSourcePipe } from './pipes/credit-source.pipe';
import { BolivianosPipe } from './pipes/bolivianos.pipe';
import { CreditsDashboardComponent } from './pages/credits-dashboard/credits-dashboard.component';
import { CreditTransactionListComponent } from './components/credit-transaction-list/credit-transaction-list.component';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { MaterialModule } from '../../shared/material.module';
import { UserSearchComponent } from './pages/user-search/user-search.component';
import { UserCreditDetailComponent } from './pages/user-credit-detail/user-credit-detail.component';
import { GrantCreditsComponent } from './pages/grant-credits/grant-credits.component';
import { BulkGrantComponent } from './pages/bulk-grant/bulk-grant.component';
import { ExpirationsMonitorComponent } from './pages/expirations-monitor/expirations-monitor.component';
import { AuditTableComponent } from './pages/audit-table/audit-table.component';


@NgModule({
  declarations: [
    CreditTypePipe,
    CreditSourcePipe,
    BolivianosPipe,
    CreditsDashboardComponent,
    CreditTransactionListComponent,
    KpiCardComponent,
    UserSearchComponent,
    UserCreditDetailComponent,
    GrantCreditsComponent,
    BulkGrantComponent,
    ExpirationsMonitorComponent,
    AuditTableComponent
  ],
  imports: [
    CommonModule,
    CreditsRoutingModule,
    MaterialModule
  ],
  exports: [
    CreditTypePipe,
    CreditSourcePipe,
    BolivianosPipe
  ]
})
export class CreditsModule { }
