import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UpdatePlanDTO } from '../../../interfaces/plan.interface';

@Component({
  selector: 'app-plan-edit-dialog',
  standalone: false,
  template: `
    <h2 mat-dialog-title class="!text-lg !font-bold !text-gray-800">Editar plan</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-col gap-4 pt-3">

        <div>
          <label class="dialog-label">Nombre *</label>
          <input formControlName="name" class="dialog-input"
                 [class.border-red-400]="form.get('name')?.invalid && form.get('name')?.touched">
          @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
            <p class="dialog-error">El nombre es requerido</p>
          }
        </div>

        <div>
          <label class="dialog-label">Descripción <span class="font-normal normal-case text-gray-400">(opcional)</span></label>
          <textarea formControlName="description" rows="3" class="dialog-input resize-none"></textarea>
        </div>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-label {
      font-size: 10px; font-weight: 700; color: rgb(107 114 128);
      text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.375rem;
    }
    .dialog-input {
      width: 100%; border: 1px solid rgb(209 213 219); border-radius: 0.5rem;
      padding: 0.625rem 0.875rem; font-size: 0.875rem; outline: none;
      transition: all 150ms; background: white; color: rgb(31 41 55);
    }
    .dialog-input:focus { box-shadow: 0 0 0 2px rgba(59,130,246,0.2); border-color: rgb(59 130 246); }
    .dialog-input::placeholder { color: rgb(156 163 175); }
    .dialog-error { font-size: 11px; color: rgb(220 38 38); font-weight: 600; margin-top: 0.25rem; }
  `],
})
export class PlanEditDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<PlanEditDialogComponent>);

  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string; description: string | null }) {
    this.form = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description ?? ''],
    });
  }

  save(): void {
    if (this.form.invalid) return;
    const { name, description } = this.form.value;
    const dto: UpdatePlanDTO = { name, description: description || null };
    this.dialogRef.close(dto);
  }
}
