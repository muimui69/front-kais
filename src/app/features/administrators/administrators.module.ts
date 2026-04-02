import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AdministratorsRoutingModule } from './administrators-routing.module';
import { AdminListComponent } from './pages/admin-list/admin-list.component';
import { AdminFormDialogComponent } from './pages/admin-list/dialogs/admin-form-dialog/admin-form-dialog.component';
import { AdminPasswordDialogComponent } from './pages/admin-list/dialogs/admin-password-dialog/admin-password-dialog.component';

@NgModule({
  declarations: [
    AdminListComponent,
    AdminFormDialogComponent,
    AdminPasswordDialogComponent
  ],
  imports: [
    CommonModule,
    AdministratorsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    MatSelectModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ]
})
export class AdministratorsModule { }
