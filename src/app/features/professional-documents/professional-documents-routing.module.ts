import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarLayoutComponent } from '../../layouts/navbar-layout/navbar-layout.component';
import { ProfessionalDocumentsListComponent } from './pages/professional-documents-list/professional-documents-list.component';
import { ProfessionalDocumentsDetailComponent } from './pages/professional-documents-detail/professional-documents-detail.component';
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
        component: ProfessionalDocumentsListComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['documentos_profesional_ver'] },
      },
      {
        path: ':id',
        component: ProfessionalDocumentsDetailComponent,
        canActivate: [permissionGuard],
        data: { permissions: ['documentos_profesional_ver'] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfessionalDocumentsRoutingModule {}
