import { Component, Inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';

import { AdministratorService } from '../../../../services/administrator.service';
import { DialogComponent } from '../../../../../../shared/dialog/dialog.component';

@Component({
  selector: 'app-admin-password-dialog',
  standalone: false,
  templateUrl: './admin-password-dialog.component.html'
})
export class AdminPasswordDialogComponent {
  form: FormGroup;
  saving = signal(false);
  dialogCtrl: DialogComponent;

  constructor(
    private fb: FormBuilder,
    private adminService: AdministratorService,
    private matDialog: MatDialog,
    public dialogRef: MatDialogRef<AdminPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { admin: any }
  ) {
    this.dialogCtrl = new DialogComponent(this.matDialog);
    this.form = this.fb.group({
      current: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]]
    });
  }

  save(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    this.adminService.changePassword(this.data.admin.id, this.form.value).subscribe({
      next: (res) => {
        this.dialogCtrl.openDialogSuccess(res.message, 'Éxito');
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.dialogCtrl.openDialogError(err.error?.message || 'Error al cambiar clave', 'Error');
        this.saving.set(false);
      }
    });
  }
}
