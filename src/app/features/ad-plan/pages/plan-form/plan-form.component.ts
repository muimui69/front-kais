import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { AdPlanService } from '../../services/ad-plan.service';

@Component({
  selector: 'app-plan-form',
  standalone: false,
  templateUrl: './plan-form.component.html',
  styleUrl: './plan-form.component.css'
})
export class PlanFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private planService = inject(AdPlanService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    durationInDays: [30, [Validators.required, Validators.min(1)]],
    price: [0, [Validators.required, Validators.min(0)]],
    isActive: [true]
  });

  isEditMode = false;
  planId: number | null = null;
  isLoading = false;
  pageTitle = 'Nuevo Plan';

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.planId = +params['id'];
        this.isEditMode = true;
        this.pageTitle = 'Editar Plan';
        this.loadPlan(this.planId);
      }
    });
  }

  loadPlan(id: number) {
    this.isLoading = true;
    this.planService.getById(id).subscribe({
      next: (res) => {
        this.form.patchValue(res.data);
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar plan', 'Cerrar');
        this.router.navigate(['/ad-plans']);
      }
    });
  }

  save() {
    if (this.form.invalid) return;
    this.isLoading = true;

    const request = this.isEditMode && this.planId
      ? this.planService.update(this.planId, this.form.value)
      : this.planService.create(this.form.value);

    request.subscribe({
      next: () => {
        this.snackBar.open(this.isEditMode ? 'Plan actualizado' : 'Plan creado', 'Ok', { duration: 3000 });
        this.router.navigate(['/ad-plans']);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err.error?.message || 'Error al guardar', 'Cerrar');
      }
    });
  }
}
