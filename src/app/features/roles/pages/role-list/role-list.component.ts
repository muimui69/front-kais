import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { RoleService } from '../../services/role.service';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { Role } from '../../interfaces/role.interface';
import { RoleFormDialogComponent } from './dialogs/role-form-dialog.component';

@Component({
  selector: 'app-role-list',
  standalone: false,
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css',
})
export class RoleListComponent implements OnInit {
  private readonly roleService = inject(RoleService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly matDialog = inject(MatDialog);
  public readonly authService = inject(AuthService);
  public readonly dialog = new DialogComponent(this.matDialog);

  displayedColumns = ['name', 'description', 'status', 'createdAt', 'acciones'];

  roles: Role[] = [];
  loading = signal(false);
  totalItems = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);

  filterForm: FormGroup = this.fb.group({ name: [''] });

  ngOnInit(): void {
    this.loadRoles();
    this.filterForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.pageIndex.set(0);
        this.loadRoles();
      });
  }

  loadRoles(): void {
    this.loading.set(true);
    const { name } = this.filterForm.value;
    this.roleService
      .getAll({ name: name || undefined, page: this.pageIndex() + 1, limit: this.pageSize() })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.roles = res.data;
          this.totalItems.set(res.pagination.totalItems);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadRoles();
  }

  openCreateDialog(): void {
    const ref = this.matDialog.open(RoleFormDialogComponent, {
      width: '480px',
      data: { mode: 'create' },
    });

    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.roleService.create(dto).subscribe({
        next: (res) => {
          this.dialog.openDialogSuccess(res.message, 'Rol creado');
          this.router.navigate(['/roles', res.data.roleId]);
        },
        error: (err) => {
          const msg = err.error?.message || 'Error al crear el rol';
          this.dialog.openDialogError(msg, 'Error');
        },
      });
    });
  }

  openEditDialog(role: Role): void {
    const ref = this.matDialog.open(RoleFormDialogComponent, {
      width: '480px',
      data: { mode: 'edit', role },
    });

    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.roleService.update(role.roleId, dto).subscribe({
        next: (res) => {
          this.dialog.openDialogSuccess(res.message, 'Rol actualizado');
          this.loadRoles();
        },
        error: (err) => {
          const msg = err.error?.message || 'Error al actualizar el rol';
          this.dialog.openDialogError(msg, 'Error');
        },
      });
    });
  }

  deleteRole(role: Role): void {
    this.dialog
      .openDialogQuestion(
        `¿Eliminar el rol "${role.roleName}"? Esta acción no se puede deshacer.`,
        'Confirmar eliminación'
      )
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.roleService.delete(role.roleId).subscribe({
          next: (res) => {
            this.dialog.openDialogSuccess(res.message, 'Rol eliminado');
            this.loadRoles();
          },
          error: (err) => {
            const msg = err.error?.message || 'Error al eliminar el rol';
            this.dialog.openDialogError(msg, 'Error');
          },
        });
      });
  }
}
