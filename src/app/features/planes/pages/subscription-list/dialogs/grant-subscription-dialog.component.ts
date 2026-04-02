import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Plan, PlanInterval } from '../../../interfaces/plan.interface';
import { PlanService } from '../../../services/plan.service';

@Component({
  selector: 'app-grant-subscription-dialog',
  standalone: false,
  template: `
    <h2 mat-dialog-title>Otorgar suscripción gratuita</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="flex flex-col gap-4 pt-3">

        <div>
          <label class="dlg-label">ID del usuario *</label>
          <input formControlName="userId" type="number" placeholder="204" class="dlg-input"
                 [class.border-red-400]="form.get('userId')?.invalid && form.get('userId')?.touched">
          <p class="dlg-hint">Ingresa el ID numérico del usuario beneficiario.</p>
          @if (form.get('userId')?.hasError('required') && form.get('userId')?.touched) {
            <p class="dlg-error">Requerido</p>
          }
        </div>

        <div>
          <label class="dlg-label">Plan *</label>
          <select formControlName="planId" class="dlg-input"
                  (change)="onPlanChange(+$any($event.target).value)"
                  [class.border-red-400]="form.get('planId')?.invalid && form.get('planId')?.touched">
            <option value="">Selecciona un plan...</option>
            <option *ngFor="let p of data.plans" [value]="p.id">{{ p.name }} ({{ p.code }})</option>
          </select>
          @if (form.get('planId')?.hasError('required') && form.get('planId')?.touched) {
            <p class="dlg-error">Requerido</p>
          }
        </div>

        @if (loadingIntervals) {
          <p class="text-sm text-gray-400 text-center py-1">Cargando intervalos...</p>
        }

        @if (intervals.length > 0) {
          <div>
            <label class="dlg-label">Intervalo *</label>
            <select formControlName="planIntervalId" class="dlg-input"
                    [class.border-red-400]="form.get('planIntervalId')?.invalid && form.get('planIntervalId')?.touched">
              <option value="">Selecciona un intervalo...</option>
              <option *ngFor="let i of intervals" [value]="i.id">
                {{ i.intervalDisplay }} — {{ i.currency }} {{ i.pricePerPeriod | number:'1.2-2' }}
              </option>
            </select>
            @if (form.get('planIntervalId')?.hasError('required') && form.get('planIntervalId')?.touched) {
              <p class="dlg-error">Requerido</p>
            }
          </div>
        }

        @if (form.get('planId')?.value && intervals.length === 0 && !loadingIntervals) {
          <p class="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
            Este plan no tiene intervalos activos.
          </p>
        }

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid">Otorgar</button>
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
export class GrantSubscriptionDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly planService = inject(PlanService);
  private readonly dialogRef = inject(MatDialogRef<GrantSubscriptionDialogComponent>);

  form: FormGroup = this.fb.group({
    userId: [null, Validators.required],
    planId: [null, Validators.required],
    planIntervalId: [null, Validators.required],
  });

  intervals: PlanInterval[] = [];
  loadingIntervals = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { plans: Plan[] }) {}

  onPlanChange(planId: number): void {
    this.intervals = [];
    this.form.get('planIntervalId')?.reset();
    if (!planId) return;

    this.loadingIntervals = true;
    this.planService.getById(planId).subscribe({
      next: (res) => {
        this.intervals = (res.data.intervals ?? []).filter((i) => i.isActive);
        this.loadingIntervals = false;
      },
      error: () => (this.loadingIntervals = false),
    });
  }

  save(): void {
    if (this.form.invalid) return;
    const { userId, planIntervalId } = this.form.value;
    this.dialogRef.close({ userId: Number(userId), planIntervalId: Number(planIntervalId) });
  }
}
