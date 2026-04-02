import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { AdministratorService } from '../../services/administrator.service';
import { AuthService } from '../../../auth/services/auth.service';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { Administrator } from '../../interfaces/administrator.interface';
import { AdminFormDialogComponent } from './dialogs/admin-form-dialog/admin-form-dialog.component';
import { AdminPasswordDialogComponent } from './dialogs/admin-password-dialog/admin-password-dialog.component';

@Component({
  selector: 'app-admin-list',
  standalone: false,
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.css',
})
export class AdminListComponent implements OnInit {
  private readonly adminService = inject(AdministratorService);
  private readonly fb = inject(FormBuilder);
  private readonly matDialog = inject(MatDialog);
  public readonly authService = inject(AuthService);
  public readonly dialog = new DialogComponent(this.matDialog);

  displayedColumns = ['photo', 'name', 'email', 'role', 'status', 'createdAt', 'acciones'];

  admins: Administrator[] = [];
  loading = signal(false);
  totalItems = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);

  filterForm: FormGroup = this.fb.group({ search: [''], email: [''], isActive: [''] });

  ngOnInit(): void {
    this.loadAdmins();
    this.filterForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.pageIndex.set(0);
        this.loadAdmins();
      });
  }

  loadAdmins(): void {
    this.loading.set(true);
    const { search, email, isActive } = this.filterForm.value;
    const params: any = { page: this.pageIndex() + 1, limit: this.pageSize() };
    if (search) params.search = search;
    if (email) params.email = email;
    if (isActive !== '') params.isActive = isActive;

    this.adminService.getAll(params).subscribe({
      next: (res) => {
        console.log('[AdminList] API response:', res);
        this.admins = Array.isArray(res.data) ? res.data : [];
        this.totalItems.set(res.pagination?.totalItems ?? 0);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[AdminList] API error:', err);
        this.loading.set(false);
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadAdmins();
  }

  openCreateDialog(): void {
    const ref = this.matDialog.open(AdminFormDialogComponent, {
      width: '600px',
      data: { mode: 'create' },
    });
    ref.afterClosed().subscribe((res) => { if (res) this.loadAdmins(); });
  }

  openEditDialog(admin: Administrator): void {
    const ref = this.matDialog.open(AdminFormDialogComponent, {
      width: '600px',
      data: { mode: 'edit', admin },
    });
    ref.afterClosed().subscribe((res) => { if (res) this.loadAdmins(); });
  }

  openPasswordDialog(admin: Administrator): void {
    this.matDialog.open(AdminPasswordDialogComponent, {
      width: '400px',
      data: { admin },
    });
  }

  toggleState(admin: Administrator): void {
    const action = admin.isActive ? 'desactivar' : 'activar';
    this.dialog
      .openDialogQuestion(`¿Estás seguro de ${action} al administrador ${admin.name}?`, 'Confirmar acción')
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (!confirmed) return;
        this.adminService.changeState(admin.id).subscribe({
          next: (res) => {
            this.dialog.openDialogSuccess(res.message, 'Estado actualizado');
            this.loadAdmins();
          },
          error: (err) => {
            this.dialog.openDialogError(err.error?.message || 'Error', 'Error');
          }
        });
      });
  }

  clearFilters(): void {
    this.filterForm.reset({ search: '', email: '', isActive: '' }, { emitEvent: false });
    this.pageIndex.set(0);
    this.loadAdmins();
  }

  deleteAdmin(admin: Administrator): void {
    this.dialog
      .openDialogQuestion(`¿Eliminar al administrador ${admin.name}? La cuenta de usuario seguirá existiendo.`, 'Confirmar eliminación')
      .afterClosed()
      .subscribe((confirmed: boolean) => {
        if (!confirmed) return;
        this.adminService.delete(admin.id).subscribe({
          next: (res) => {
            this.dialog.openDialogSuccess(res.message, 'Administrador eliminado');
            this.loadAdmins();
          },
          error: (err) => {
            this.dialog.openDialogError(err.error?.message || 'Error al eliminar', 'Error');
          }
        });
      });
  }
}
