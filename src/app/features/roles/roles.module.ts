import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from '../../shared/material.module';
import { RolesRoutingModule } from './roles-routing.module';

import { RoleListComponent } from './pages/role-list/role-list.component';
import { RoleDetailComponent } from './pages/role-detail/role-detail.component';
import { RoleFormDialogComponent } from './pages/role-list/dialogs/role-form-dialog.component';

@NgModule({
  declarations: [
    RoleListComponent,
    RoleDetailComponent,
    RoleFormDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    RolesRoutingModule,
  ],
})
export class RolesModule {}
