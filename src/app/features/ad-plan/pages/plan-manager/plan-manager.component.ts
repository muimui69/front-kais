import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { AdPlan, AdPlanStats } from '../../interfaces/ad-plan';
import { AdPlanService } from '../../services/ad-plan.service';

@Component({
  selector: 'app-plan-manager',
  standalone: false,
  templateUrl: './plan-manager.component.html',
  styleUrl: './plan-manager.component.css'
})
export class PlanManagerComponent implements OnInit {
  private planService = inject(AdPlanService);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['name', 'duration', 'price', 'status', 'actions'];
  dataSource = new MatTableDataSource<AdPlan>([]);
  stats: AdPlanStats | null = null;
  isLoading = true;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.planService.getAll(true).subscribe({
      next: (res) => {
        this.dataSource.data = res.data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });

    this.planService.getStats().subscribe(res => this.stats = res.data);
  }

  toggleStatus(plan: AdPlan) {
    const originalState = plan.isActive;
    plan.isActive = !plan.isActive;

    this.planService.toggleStatus(plan.id).subscribe({
      next: () => this.snackBar.open('Estado actualizado', 'Ok', { duration: 2000 }),
      error: () => {
        plan.isActive = originalState;
        this.snackBar.open('Error al cambiar estado', 'Cerrar');
      }
    });
  }

  deletePlan(id: number) {
    if(!confirm('¿Eliminar este plan? Si tiene suscripciones, fallará.')) return;

    this.planService.delete(id).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Ok', { duration: 3000 });
        this.dataSource.data = this.dataSource.data.filter(p => p.id !== id);
      },
      error: (err) => this.snackBar.open(err.error?.message || 'Error al eliminar', 'Cerrar')
    });
  }
}
