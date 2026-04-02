import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlanInterval, UpdateIntervalDTO } from '../../../interfaces/plan.interface';

@Component({
  selector: 'app-interval-edit-dialog',
  standalone: false,
  template: `
    <h2 mat-dialog-title>Editar intervalo</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-col gap-4 pt-3">

        <div>
          <label class="dlg-label">Nombre visible *</label>
          <input formControlName="intervalDisplay" placeholder="Ej: 1 mes" class="dlg-input"
                 [class.border-red-400]="form.get('intervalDisplay')?.invalid && form.get('intervalDisplay')?.touched">
          @if (form.get('intervalDisplay')?.hasError('required') && form.get('intervalDisplay')?.touched) {
            <p class="dlg-error">Requerido</p>
          }
        </div>

        <div class="flex gap-3">
          <div class="flex-1">
            <label class="dlg-label">Precio *</label>
            <input formControlName="pricePerPeriod" type="number" min="0" placeholder="0.00" class="dlg-input"
                   [class.border-red-400]="form.get('pricePerPeriod')?.invalid && form.get('pricePerPeriod')?.touched">
            @if (form.get('pricePerPeriod')?.hasError('required') && form.get('pricePerPeriod')?.touched) {
              <p class="dlg-error">Requerido</p>
            }
          </div>
          <div class="w-28">
            <label class="dlg-label">Días por período *</label>
            <input formControlName="daysPerPeriod" type="number" min="1" placeholder="30" class="dlg-input"
                   [class.border-red-400]="form.get('daysPerPeriod')?.invalid && form.get('daysPerPeriod')?.touched">
            @if (form.get('daysPerPeriod')?.hasError('required') && form.get('daysPerPeriod')?.touched) {
              <p class="dlg-error">Requerido</p>
            }
          </div>
        </div>

        <label class="flex items-center gap-3 cursor-pointer select-none p-3 bg-gray-50 rounded-lg border border-gray-100">
          <mat-slide-toggle formControlName="isActive" color="primary"></mat-slide-toggle>
          <span class="text-sm font-bold text-gray-700">Intervalo activo</span>
        </label>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dlg-label { font-size:10px; font-weight:700; color:rgb(107 114 128); text-transform:uppercase; letter-spacing:.05em; display:block; margin-bottom:.375rem; }
    .dlg-input { width:100%; border:1px solid rgb(209 213 219); border-radius:.5rem; padding:.625rem .875rem; font-size:.875rem; outline:none; transition:all 150ms; background:white; color:rgb(31 41 55); }
    .dlg-input:focus { box-shadow:0 0 0 2px rgba(59,130,246,.2); border-color:rgb(59 130 246); }
    .dlg-input::placeholder { color:rgb(156 163 175); }
    .dlg-error { font-size:11px; color:rgb(220 38 38); font-weight:600; margin-top:.25rem; }
  `],
})
export class IntervalEditDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<IntervalEditDialogComponent>);

  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: PlanInterval) {
    this.form = this.fb.group({
      intervalDisplay: [data.intervalDisplay, Validators.required],
      pricePerPeriod: [data.pricePerPeriod, Validators.required],
      daysPerPeriod: [data.daysPerPeriod, Validators.required],
      isActive: [data.isActive],
    });
  }

  save(): void {
    if (this.form.invalid) return;
    const dto: UpdateIntervalDTO = this.form.value;
    this.dialogRef.close(dto);
  }
}
