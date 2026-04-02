import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarLayoutComponent } from '../../layouts/navbar-layout/navbar-layout.component';
import { authGuard } from '../auth/guards/auth.guard';
import { AdminListComponent } from './pages/admin-list/admin-list.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: AdminListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratorsRoutingModule { }
