import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';

import { RoleService } from '../../services/role.service';
import { PermissionService } from '../../services/permission.service';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { RolePermissionsData } from '../../interfaces/role.interface';
import { PermissionModule, PermissionSection } from '../../interfaces/permission.interface';

@Component({
  selector: 'app-role-detail',
  standalone: false,
  templateUrl: './role-detail.component.html',
  styleUrl: './role-detail.component.css',
})
export class RoleDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly roleService = inject(RoleService);
  private readonly permissionService = inject(PermissionService);
  private readonly matDialog = inject(MatDialog);
  public readonly authService = inject(AuthService);
  public readonly dialog = new DialogComponent(this.matDialog);

  roleData: RolePermissionsData | null = null;
  permissionTree: PermissionModule[] = [];
  selectedIds = new Set<number>();

  loading = signal(false);
  saving = signal(false);

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loading.set(true);

    forkJoin({
      rolePerms: this.roleService.getPermissions(id),
      tree: this.permissionService.getStructure(),
    }).subscribe({
      next: ({ rolePerms, tree }) => {
        this.roleData = rolePerms.data;
        this.permissionTree = tree.data;
        this.selectedIds = new Set(rolePerms.data.permissionIds);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }


  isActionChecked(permissionId: number): boolean {
    return this.selectedIds.has(permissionId);
  }

  isSectionChecked(section: PermissionSection): boolean {
    return section.actions.every((a) => this.selectedIds.has(a.permissionId));
  }

  isSectionIndeterminate(section: PermissionSection): boolean {
    const n = section.actions.filter((a) => this.selectedIds.has(a.permissionId)).length;
    return n > 0 && n < section.actions.length;
  }

  isModuleChecked(module: PermissionModule): boolean {
    return module.sections.every((s) => this.isSectionChecked(s));
  }

  isModuleIndeterminate(module: PermissionModule): boolean {
    const all = module.sections.flatMap((s) => s.actions);
    const n = all.filter((a) => this.selectedIds.has(a.permissionId)).length;
    return n > 0 && n < all.length;
  }


  toggleAction(permissionId: number): void {
    if (this.selectedIds.has(permissionId)) {
      this.selectedIds.delete(permissionId);
    } else {
      this.selectedIds.add(permissionId);
    }
    this.selectedIds = new Set(this.selectedIds);
  }

  toggleSection(section: PermissionSection): void {
    const allChecked = this.isSectionChecked(section);
    section.actions.forEach((a) => {
      if (allChecked) {
        this.selectedIds.delete(a.permissionId);
      } else {
        this.selectedIds.add(a.permissionId);
      }
    });
    this.selectedIds = new Set(this.selectedIds);
  }

  toggleModule(module: PermissionModule): void {
    const allChecked = this.isModuleChecked(module);
    module.sections.forEach((s) => {
      s.actions.forEach((a) => {
        if (allChecked) {
          this.selectedIds.delete(a.permissionId);
        } else {
          this.selectedIds.add(a.permissionId);
        }
      });
    });
    this.selectedIds = new Set(this.selectedIds);
  }


  savePermissions(): void {
    if (!this.roleData) return;
    this.saving.set(true);
    this.roleService
      .assignPermissions(this.roleData.role.roleId, {
        permissionsIds: [...this.selectedIds],
      })
      .subscribe({
        next: (res) => {
          this.dialog.openDialogSuccess(res.message, 'Permisos guardados');
          this.saving.set(false);
        },
        error: (err) => {
          const msg = err.error?.message || 'Error al guardar los permisos';
          this.dialog.openDialogError(msg, 'Error');
          this.saving.set(false);
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/roles']);
  }

  get selectedCount(): number {
    return this.selectedIds.size;
  }
}
