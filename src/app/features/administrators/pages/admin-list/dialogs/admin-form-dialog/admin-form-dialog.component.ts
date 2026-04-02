import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { AdministratorService } from '../../../../services/administrator.service';
import { RoleService } from '../../../../../roles/services/role.service';
import { DialogComponent } from '../../../../../../shared/dialog/dialog.component';

@Component({
  selector: 'app-admin-form-dialog',
  standalone: false,
  templateUrl: './admin-form-dialog.component.html'
})
export class AdminFormDialogComponent implements OnInit {
  form: FormGroup;
  mode: 'create' | 'edit';
  saving = signal(false);
  roles: any[] = [];
  dialogCtrl: DialogComponent;

  constructor(
    private fb: FormBuilder,
    private adminService: AdministratorService,
    private roleService: RoleService,
    private matDialog: MatDialog,
    public dialogRef: MatDialogRef<AdminFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit', admin?: any }
  ) {
    this.dialogCtrl = new DialogComponent(this.matDialog);
    this.mode = data.mode;

    this.form = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      phone: [''],
      roleId: [null]
    });

    if (this.mode === 'create') {
    } else if (data.admin) {
      const u = data.admin;
      this.form.patchValue({
        name: u.name,
        lastName: u.lastName,
        username: u.username,
        email: u.email,
        phone: u.phone,
        roleId: u.role ? u.role.roleId : null
      });
      this.form.get('password')?.disable();
      this.form.get('email')?.disable();
      this.form.get('username')?.disable();
    }
  }

  ngOnInit(): void {
    this.roleService.getAll({ limit: 100 }).subscribe(res => {
      this.roles = res.data;
    });
  }

  save(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const raw = this.form.getRawValue();

    let request$: Observable<any>;
    if (this.mode === 'create') {
      request$ = this.adminService.create(raw);
    } else {
      const { password, ...dto } = raw;
      request$ = this.adminService.update(this.data.admin.id, dto);
    }

    request$.subscribe({
      next: (res) => {
        this.dialogCtrl.openDialogSuccess(res.message, this.mode === 'create' ? 'Creado' : 'Actualizado');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.dialogCtrl.openDialogError(err.error?.message || 'Error occurred', 'Error');
        this.saving.set(false);
      }
    });
  }
}
