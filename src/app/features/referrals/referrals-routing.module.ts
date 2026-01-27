import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarLayoutComponent } from '../../layouts/navbar-layout/navbar-layout.component';
import { ReferralConfigComponent } from './pages/referral-config/referral-config.component';
import { ReferralDashboardComponent } from './pages/referral-dashboard/referral-dashboard.component';
import { ReferralLeaderboardComponent } from './pages/referral-leaderboard/referral-leaderboard.component';
import { ReferralHistoryComponent } from './pages/referral-history/referral-history.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarLayoutComponent,
    children: [
      {
        path: '',
        component: ReferralDashboardComponent
      },
      {
        path: 'config',
        component: ReferralConfigComponent
      },
      {
        path: 'leaderboard',
        component: ReferralLeaderboardComponent
      },
      {
        path: 'history',
        component: ReferralHistoryComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralsRoutingModule { }
