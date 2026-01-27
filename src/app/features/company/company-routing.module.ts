import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarLayoutComponent } from '../../layouts/navbar-layout/navbar-layout.component';
import { CompanyListComponent } from './pages/company-list/company-list.component';
import { CompanyFormComponent } from './pages/company-form/company-form.component';
import { CompanyDetailComponent } from './pages/company-detail/company-detail.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarLayoutComponent,
    children: [
      { path: '', component: CompanyListComponent },
      { path: 'create', component: CompanyFormComponent },
      { path: 'edit/:id', component: CompanyFormComponent },
      { path: 'view/:id', component: CompanyDetailComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
