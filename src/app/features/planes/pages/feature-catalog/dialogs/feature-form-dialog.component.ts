import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Feature, CreateFeatureDTO, UpdateFeatureDTO } from '../../../interfaces/feature-catalog.interface';

export interface FeatureFormDialogData {
  mode: 'create' | 'edit';
  feature?: Feature;
}

@Component({
  selector: 'app-feature-form-dialog',
  standalone: false,
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nueva Feature' : 'Editar Feature' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-col gap-4 pt-3">

        <ng-container *ngIf="data.mode === 'create'">
          <div>
            <label class="dlg-label">Nombre técnico *</label>
            <input formControlName="name" placeholder="Ej: fotos_portfolio" class="dlg-input"
                   [class.border-red-400]="form.get('name')?.invalid && form.get('name')?.touched">
            <p class="dlg-hint">Identificador único. No se puede cambiar después.</p>
            @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
              <p class="dlg-error">Requerido</p>
            }
          </div>
          <div>
            <label class="dlg-label">Clave (key) *</label>
            <input formControlName="key" placeholder="Ej: fotos_portfolio" class="dlg-input"
                   [class.border-red-400]="form.get('key')?.invalid && form.get('key')?.touched">
            <p class="dlg-hint">Clave interna. Se guarda en minúsculas.</p>
            @if (form.get('key')?.hasError('required') && form.get('key')?.touched) {
              <p class="dlg-error">Requerido</p>
            }
          </div>
        </ng-container>

        <div>
          <label class="dlg-label">Nombre visible *</label>
          <input formControlName="displayName" placeholder="Ej: Fotos en portfolio" class="dlg-input"
                 [class.border-red-400]="form.get('displayName')?.invalid && form.get('displayName')?.touched">
          @if (form.get('displayName')?.hasError('required') && form.get('displayName')?.touched) {
            <p class="dlg-error">Requerido</p>
          }
        </div>

        <div>
          <label class="dlg-label">Descripción <span class="font-normal normal-case text-gray-400">(opcional)</span></label>
          <textarea formControlName="description" rows="2" class="dlg-input resize-none"
                    placeholder="Describe brevemente esta característica..."></textarea>
        </div>

        <div class="flex gap-3">
          <div class="flex-1">
            <label class="dlg-label">Unidad de medida</label>
            <input formControlName="unit" placeholder="Ej: fotos, ciudades" class="dlg-input">
          </div>
          <div class="w-28">
            <label class="dlg-label">Orden</label>
            <input formControlName="sortOrder" type="number" min="0" placeholder="0" class="dlg-input">
          </div>
        </div>

        <label class="flex items-center gap-3 cursor-pointer select-none p-3 bg-gray-50 rounded-lg border border-gray-100">
          <mat-slide-toggle formControlName="isAccumulable" color="primary"></mat-slide-toggle>
          <div>
            <p class="text-sm font-bold text-gray-700">Se resetea por período</p>
            <p class="text-xs text-gray-400">El conteo vuelve a 0 en cada período</p>
          </div>
        </label>

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
export class FeatureFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<FeatureFormDialogComponent>);

  form!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: FeatureFormDialogData) {}

  ngOnInit(): void {
    const f = this.data.feature;
    if (this.data.mode === 'create') {
      this.form = this.fb.group({
        name: ['', Validators.required],
        key: ['', Validators.required],
        displayName: ['', Validators.required],
        description: [''],
        unit: [''],
        isAccumulable: [true],
        sortOrder: [0],
      });
    } else {
      this.form = this.fb.group({
        displayName: [f?.displayName ?? '', Validators.required],
        description: [f?.description ?? ''],
        unit: [f?.unit ?? ''],
        isAccumulable: [f?.isAccumulable ?? true],
        sortOrder: [f?.sortOrder ?? 0],
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }
}
