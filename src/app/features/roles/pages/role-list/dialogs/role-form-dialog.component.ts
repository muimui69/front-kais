import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Role, CreateRoleDTO, UpdateRoleDTO } from '../../../interfaces/role.interface';

export interface RoleFormDialogData {
  mode: 'create' | 'edit';
  role?: Role;
}

@Component({
  selector: 'app-role-form-dialog',
  standalone: false,
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nuevo Rol' : 'Editar Rol' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-col gap-4 pt-3">

        <div>
          <label class="dlg-label">Nombre *</label>
          <input
            formControlName="name"
            placeholder="Ej: SUPERVISOR DE PLANES"
            class="dlg-input"
            [class.border-red-400]="form.get('name')?.invalid && form.get('name')?.touched">
          <p class="dlg-hint">Se guardará en mayúsculas automáticamente.</p>
          @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
            <p class="dlg-error">Requerido</p>
          }
        </div>

        <div>
          <label class="dlg-label">Descripción <span class="font-normal normal-case text-gray-400">(opcional)</span></label>
          <textarea
            formControlName="description"
            rows="3"
            class="dlg-input resize-none"
            placeholder="Describe las responsabilidades de este rol..."></textarea>
        </div>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid">
        {{ data.mode === 'create' ? 'Crear' : 'Guardar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dlg-label { font-size:10px; font-weight:700; color:rgb(107 114 128); text-transform:uppercase; letter-spacing:.05em; display:block; margin-bottom:.375rem; }
    .dlg-input { width:100%; border:1px solid rgb(209 213 219); border-radius:.5rem; padding:.625rem .875rem; font-size:.875rem; outline:none; transition:all 150ms; background:white; color:rgb(31 41 55); }
    .dlg-input:focus { box-shadow:0 0 0 2px rgba(59,130,246,.2); border-color:rgb(59 130 246); }
    .dlg-input::placeholder { color:rgb(156 163 175); }
    .dlg-hint { font-size:11px; color:rgb(156 163 175); margin-top:.25rem; }
    .dlg-error { font-size:11px; color:rgb(220 38 38); font-weight:600; margin-top:.25rem; }
  `],
})
export class RoleFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<RoleFormDialogComponent>);

  form!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: RoleFormDialogData) {}

  ngOnInit(): void {
    const r = this.data.role;
    this.form = this.fb.group({
      name: [r?.roleName ?? '', Validators.required],
      description: [r?.roleDescription ?? ''],
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }
}
