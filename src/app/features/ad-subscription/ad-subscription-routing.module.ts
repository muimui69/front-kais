import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarLayoutComponent } from '../../layouts/navbar-layout/navbar-layout.component';
import { AdSubscriptionCreateComponent } from './pages/ad-subscription-create/ad-subscription-create.component';
import { AdSubscriptionListComponent } from './pages/ad-subscription-list/ad-subscription-list.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarLayoutComponent,
    children: [
      { path: '', component: AdSubscriptionListComponent },
      { path: 'create', component: AdSubscriptionCreateComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdSubscriptionRoutingModule { }
