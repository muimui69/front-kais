import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { PlanService } from '../../services/plan.service';
import { FeatureCatalogService } from '../../services/feature-catalog.service';
import { Plan, PlanInterval, PlanIntervalFeature, UpdatePlanDTO } from '../../interfaces/plan.interface';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { PlanEditDialogComponent } from './dialogs/plan-edit-dialog.component';
import { IntervalEditDialogComponent } from './dialogs/interval-edit-dialog.component';
import { AddFeatureDialogComponent } from './dialogs/add-feature-dialog.component';
import { AddIntervalDialogComponent } from './dialogs/add-interval-dialog.component';

@Component({
  selector: 'app-plan-detail',
  standalone: false,
  templateUrl: './plan-detail.component.html',
  styleUrl: './plan-detail.component.css',
})
export class PlanDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly planService = inject(PlanService);
  private readonly featureCatalogService = inject(FeatureCatalogService);
  private readonly matDialog = inject(MatDialog);
  public readonly dialog = new DialogComponent(this.matDialog);

  plan = signal<Plan | null>(null);
  loading = signal(false);
  planId!: number;

  ngOnInit(): void {
    this.planId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPlan();
  }

  loadPlan(): void {
    this.loading.set(true);
    this.planService.getById(this.planId).subscribe({
      next: (res) => {
        this.plan.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/planes']);
      },
    });
  }

  // ── Plan actions ──────────────────────────────────────

  openEditPlanDialog(): void {
    const current = this.plan();
    if (!current) return;

    const ref = this.matDialog.open(PlanEditDialogComponent, {
      width: '480px',
      data: { name: current.name, description: current.description },
    });

    ref.afterClosed().subscribe((result: UpdatePlanDTO | undefined) => {
      if (!result) return;
      this.planService.update(this.planId, result).subscribe({
        next: (res) => {
          this.dialog.openDialogSuccess(res.message, 'Plan actualizado');
          this.loadPlan();
        },
        error: (err) => this.dialog.openDialogError(err.error?.message || 'Error al actualizar', 'Error'),
      });
    });
  }

  togglePlanStatus(): void {
    const current = this.plan();
    if (!current) return;
    const action = current.status === 'active' ? 'desactivar' : 'activar';
    this.dialog
      .openDialogQuestion(`¿Deseas ${action} el plan "${current.name}"?`, 'Confirmar')
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.planService.toggleStatus(this.planId).subscribe({
          next: (res) => {
            this.dialog.openDialogSuccess(res.message, 'Estado actualizado');
            this.loadPlan();
          },
          error: (err) => this.dialog.openDialogError(err.error?.message || 'Error', 'Error'),
        });
      });
  }

  // ── Interval actions ──────────────────────────────────

  openAddIntervalDialog(): void {
    const ref = this.matDialog.open(AddIntervalDialogComponent, { width: '520px' });

    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.planService.createInterval(this.planId, dto).subscribe({
        next: (res) => {
          this.dialog.openDialogSuccess(res.message, 'Intervalo creado');
          this.loadPlan();
        },
        error: (err) => this.dialog.openDialogError(err.error?.message || 'Error al crear intervalo', 'Error'),
      });
    });
  }

  openEditIntervalDialog(interval: PlanInterval): void {
    const ref = this.matDialog.open(IntervalEditDialogComponent, {
      width: '520px',
      data: interval,
    });

    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.planService.updateInterval(interval.id, dto).subscribe({
        next: (res) => {
          this.dialog.openDialogSuccess(res.message, 'Intervalo actualizado');
          this.loadPlan();
        },
        error: (err) => this.dialog.openDialogError(err.error?.message || 'Error al actualizar', 'Error'),
      });
    });
  }

  deleteInterval(interval: PlanInterval): void {
    this.dialog
      .openDialogQuestion(
        `¿Eliminar el intervalo "${interval.intervalDisplay}"? Esta acción no se puede deshacer.`,
        'Confirmar eliminación'
      )
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.planService.deleteInterval(interval.id).subscribe({
          next: (res) => {
            this.dialog.openDialogSuccess(res.message, 'Intervalo eliminado');
            this.loadPlan();
          },
          error: (err) => {
            const msg = err.error?.message || 'Error al eliminar el intervalo';
            this.dialog.openDialogError(msg, 'No se puede eliminar');
          },
        });
      });
  }

  // ── Feature actions ───────────────────────────────────

  openAddFeatureDialog(interval: PlanInterval): void {
    this.featureCatalogService.getAll(true).subscribe({
      next: (res) => {
        const ref = this.matDialog.open(AddFeatureDialogComponent, {
          width: '520px',
          data: { features: res.data, intervalId: interval.id },
        });

        ref.afterClosed().subscribe((dto) => {
          if (!dto) return;
          this.planService.addFeatureToInterval(interval.id, dto).subscribe({
            next: (res2) => {
              this.dialog.openDialogSuccess(res2.message, 'Característica agregada');
              this.loadPlan();
            },
            error: (err) => this.dialog.openDialogError(err.error?.message || 'Error al agregar', 'Error'),
          });
        });
      },
      error: () => this.dialog.openDialogError('No se pudo cargar el catálogo de features', 'Error'),
    });
  }

  removeFeature(feature: PlanIntervalFeature): void {
    this.dialog
      .openDialogQuestion(
        `¿Quitar la característica "${feature.feature?.displayName ?? 'seleccionada'}" de este intervalo?`,
        'Confirmar'
      )
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.planService.removeFeatureFromInterval(feature.id).subscribe({
          next: (res) => {
            this.dialog.openDialogSuccess(res.message, 'Característica removida');
            this.loadPlan();
          },
          error: (err) => this.dialog.openDialogError(err.error?.message || 'Error', 'Error'),
        });
      });
  }

  goBack(): void {
    this.router.navigate(['/planes']);
  }

  formatLimit(f: PlanIntervalFeature): string {
    if (f.isUnlimited) return 'Ilimitado';
    return `${f.limitValue ?? 0} ${f.feature?.unit ?? ''}`.trim();
  }
}
