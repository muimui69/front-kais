import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { PlanService } from '../../services/plan.service';
import { Plan } from '../../interfaces/plan.interface';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-plan-list',
  standalone: false,
  templateUrl: './plan-list.component.html',
  styleUrl: './plan-list.component.css',
})
export class PlanListComponent implements OnInit {
  private readonly planService = inject(PlanService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly matDialog = inject(MatDialog);
  public readonly dialog = new DialogComponent(this.matDialog);

  displayedColumns = ['code', 'name', 'status', 'activeSubscriptionCount', 'createdAt', 'acciones'];

  dataSource: Plan[] = [];
  loading = signal(false);
  totalItems = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);

  filterForm: FormGroup = this.fb.group({
    search: [''],
    status: [''],
  });

  statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
  ];

  ngOnInit(): void {
    this.loadPlans();

    this.filterForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.pageIndex.set(0);
        this.loadPlans();
      });
  }

  loadPlans(): void {
    this.loading.set(true);
    const { search, status } = this.filterForm.value;

    this.planService.getAll({ search, status }, { page: this.pageIndex() + 1, limit: this.pageSize() })
      .subscribe({
        next: (res) => {
          this.dataSource = res.data;
          this.totalItems.set(res.pagination.totalItems);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadPlans();
  }

  onViewDetail(plan: Plan): void {
    this.router.navigate(['/planes', plan.id]);
  }

  onToggleStatus(plan: Plan): void {
    const action = plan.status === 'active' ? 'desactivar' : 'activar';
    this.dialog
      .openDialogQuestion(`¿Deseas ${action} el plan "${plan.name}"?`, 'Confirmar cambio de estado')
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.planService.toggleStatus(plan.id).subscribe({
          next: (res) => {
            this.dialog.openDialogSuccess(res.message, 'Estado actualizado');
            this.loadPlans();
          },
          error: (err) => {
            this.dialog.openDialogError(err.error?.message || 'Error al cambiar estado', 'Error');
          },
        });
      });
  }

  onCreatePlan(): void {
    this.router.navigate(['/planes/create']);
  }
}
