import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from '../../../interfaces/subscription.interface';

@Component({
  selector: 'app-cancel-subscription-dialog',
  standalone: false,
  template: `
    <h2 mat-dialog-title>Cancelar suscripción</h2>
    <mat-dialog-content>
      <div class="bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4 text-sm text-gray-700">
        Vas a cancelar la suscripción de
        <strong>{{ data.sub.user.name }} {{ data.sub.user.lastName }}</strong>
        al plan <strong>{{ data.sub.planInterval.plan.name }}</strong>.
      </div>
      <form [formGroup]="form" class="pt-1">
        <label class="dlg-label">Motivo de cancelación *</label>
        <textarea formControlName="reason" rows="3" class="dlg-input resize-none"
                  placeholder="Ej: Solicitud del usuario por cambio de plan"
                  [class.border-red-400]="form.get('reason')?.invalid && form.get('reason')?.touched"></textarea>
        @if (form.get('reason')?.hasError('required') && form.get('reason')?.touched) {
          <p class="dlg-error">El motivo es requerido</p>
        }
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close>No cancelar</button>
      <button mat-flat-button color="warn" (click)="save()" [disabled]="form.invalid">Cancelar suscripción</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dlg-label { font-size:10px; font-weight:700; color:rgb(107 114 128); text-transform:uppercase; letter-spacing:.05em; display:block; margin-bottom:.375rem; }
    .dlg-input { width:100%; border:1px solid rgb(209 213 219); border-radius:.5rem; padding:.625rem .875rem; font-size:.875rem; outline:none; transition:all 150ms; background:white; color:rgb(31 41 55); }
    .dlg-input:focus { box-shadow:0 0 0 2px rgba(239,68,68,.2); border-color:rgb(239 68 68); }
    .dlg-input::placeholder { color:rgb(156 163 175); }
    .dlg-error { font-size:11px; color:rgb(220 38 38); font-weight:600; margin-top:.25rem; }
  `],
})
export class CancelSubscriptionDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CancelSubscriptionDialogComponent>);

  form: FormGroup = this.fb.group({
    reason: ['', Validators.required],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { sub: Subscription }) {}

  save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value.reason);
  }
}
