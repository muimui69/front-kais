import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PlanService } from '../../services/plan.service';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-plan-form',
  standalone: false,
  templateUrl: './plan-form.component.html',
  styleUrl: './plan-form.component.css',
})
export class PlanFormComponent {
  private readonly planService = inject(PlanService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly matDialog = inject(MatDialog);
  public readonly dialog = new DialogComponent(this.matDialog);

  isLoading = false;

  form: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    description: [''],
  });

  save(): void {
    if (this.form.invalid) return;
    this.isLoading = true;

    const { code, name, description } = this.form.value;
    this.planService.create({ code, name, description: description || undefined }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.dialog.openDialogSuccess(res.message, 'Plan creado');
        this.router.navigate(['/planes', res.data.id]);
      },
      error: (err) => {
        this.isLoading = false;
        const errors = err.error?.errors;
        if (errors && Array.isArray(errors)) {
          const codeError = errors.find((e: any) => e.field === 'code');
          if (codeError) {
            this.form.get('code')?.setErrors({ serverError: codeError.message });
          }
        } else {
          this.dialog.openDialogError(err.error?.message || 'Error al crear el plan', 'Error');
        }
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/planes']);
  }
}
