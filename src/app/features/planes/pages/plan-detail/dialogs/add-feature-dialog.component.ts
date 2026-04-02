import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Feature } from '../../../interfaces/feature-catalog.interface';
import { AddFeatureToIntervalDTO } from '../../../interfaces/plan.interface';

@Component({
  selector: 'app-add-feature-dialog',
  standalone: false,
  template: `
    <h2 mat-dialog-title>Agregar característica</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-col gap-4 pt-3">

        <div>
          <label class="dlg-label">Característica *</label>
          <select formControlName="featureId" class="dlg-input"
                  [class.border-red-400]="form.get('featureId')?.invalid && form.get('featureId')?.touched">
            <option [value]="null" disabled>Selecciona una característica...</option>
            <option *ngFor="let f of data.features" [value]="f.id">
              {{ f.displayName }}{{ f.unit ? ' (' + f.unit + ')' : '' }}
            </option>
          </select>
          @if (form.get('featureId')?.hasError('required') && form.get('featureId')?.touched) {
            <p class="dlg-error">Requerido</p>
          }
        </div>

        <label class="flex items-center gap-3 cursor-pointer select-none p-3 bg-gray-50 rounded-lg border border-gray-100">
          <mat-slide-toggle formControlName="isUnlimited" color="primary" (change)="onUnlimitedChange()"></mat-slide-toggle>
          <span class="text-sm font-bold text-gray-700">Ilimitado</span>
        </label>

        @if (!form.get('isUnlimited')?.value) {
          <div>
            <label class="dlg-label">Límite *</label>
            <input formControlName="limitValue" type="number" min="1" placeholder="Ej: 10" class="dlg-input"
                   [class.border-red-400]="form.get('limitValue')?.invalid && form.get('limitValue')?.touched">
            <p class="dlg-hint">Cantidad máxima permitida por período.</p>
            @if (form.get('limitValue')?.hasError('required') && form.get('limitValue')?.touched) {
              <p class="dlg-error">Requerido cuando no es ilimitado</p>
            }
          </div>
        }

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid">Agregar</button>
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
export class AddFeatureDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AddFeatureDialogComponent>);

  form: FormGroup = this.fb.group({
    featureId: [null, Validators.required],
    isUnlimited: [false],
    limitValue: [null, Validators.required],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { features: Feature[]; intervalId: number }) {}

  ngOnInit(): void {
    this.onUnlimitedChange();
  }

  onUnlimitedChange(): void {
    const unlimited = this.form.get('isUnlimited')?.value;
    const limitCtrl = this.form.get('limitValue');
    if (unlimited) {
      limitCtrl?.clearValidators();
      limitCtrl?.setValue(null);
    } else {
      limitCtrl?.setValidators(Validators.required);
    }
    limitCtrl?.updateValueAndValidity();
  }

  save(): void {
    if (this.form.invalid) return;
    const { featureId, isUnlimited, limitValue } = this.form.value;
    const dto: AddFeatureToIntervalDTO = { featureId, isUnlimited, limitValue: isUnlimited ? null : limitValue };
    this.dialogRef.close(dto);
  }
}
