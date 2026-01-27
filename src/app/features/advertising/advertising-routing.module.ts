import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarLayoutComponent } from '../../layouts/navbar-layout/navbar-layout.component';
import { AdManagerComponent } from './pages/ad-manager/ad-manager.component';
import { AdCreateComponent } from './pages/ad-create/ad-create.component';
import { AdDetailComponent } from './pages/ad-detail/ad-detail.component';


const routes: Routes = [
  {
    path: '',
    component: NavbarLayoutComponent,
    children: [
      { path: 'ads', component: AdManagerComponent },
      {
        path: 'ads/create',
        component: AdCreateComponent
      },
      {
        path: 'ads/company/:companyId',
        component: AdManagerComponent
      },
      { path: 'ads/edit/:id', component: AdCreateComponent },
      { path: 'ads/view/:id', component: AdDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvertisingRoutingModule { }
