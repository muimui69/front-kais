import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferralsRoutingModule } from './referrals-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Components
import { ReferralConfigComponent } from './pages/referral-config/referral-config.component';
import { ReferralDashboardComponent, MarkCompletedDialogComponent } from './pages/referral-dashboard/referral-dashboard.component';
import { ReferralLeaderboardComponent } from './pages/referral-leaderboard/referral-leaderboard.component';
import { ReferralHistoryComponent } from './pages/referral-history/referral-history.component';

// Pipes
import { BobCurrencyPipe } from './pipes/bob-currency.pipe';

// Angular Material Modules
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatBadgeModule } from '@angular/material/badge';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    ReferralConfigComponent,
    ReferralDashboardComponent,
    ReferralLeaderboardComponent,
    ReferralHistoryComponent,
    MarkCompletedDialogComponent,
    BobCurrencyPipe
  ],
  imports: [
    CommonModule,
    ReferralsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    
    // Material Modules
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatCardModule,
    MatMenuModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    MatChipsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatRadioModule,
    MatBadgeModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatDialogModule
  ]
})
export class ReferralsModule { }
