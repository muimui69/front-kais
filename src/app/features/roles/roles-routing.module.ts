import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarLayoutComponent } from '../../layouts/navbar-layout/navbar-layout.component';
import { authGuard } from '../auth/guards/auth.guard';
import { permissionGuard } from '../auth/guards/perimission.guard';
import { RoleListComponent } from './pages/role-list/role-list.component';
import { RoleDetailComponent } from './pages/role-detail/role-detail.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: RoleListComponent,
       // canActivate: [permissionGuard],
        //data: { permissions: ['usuarios_rol_listar'] },
      },
      {
        path: ':id',
        component: RoleDetailComponent,
        //canActivate: [permissionGuard],
        //data: { permissions: ['usuarios_rol_ver', 'usuarios_asignar_permiso_listar'] },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule {}
