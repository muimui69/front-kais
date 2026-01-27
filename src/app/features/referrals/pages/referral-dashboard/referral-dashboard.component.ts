import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ReferralService } from '../../services/referral.service';
import { Referral, GlobalReferralStats, ReferralFilters, MarkCompletedDTO } from '../../interfaces/referral.interface';

@Component({
  selector: 'app-referral-dashboard',
  standalone: false,
  templateUrl: './referral-dashboard.component.html',
  styleUrl: './referral-dashboard.component.css'
})
export class ReferralDashboardComponent implements OnInit {
  private referralService = inject(ReferralService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Estado de carga
  loading = signal(true);
  loadingStats = signal(true);

  // Estadísticas globales
  stats = signal<GlobalReferralStats | null>(null);

  // Tabla de datos
  dataSource = new MatTableDataSource<Referral>([]);
  displayedColumns: string[] = [
    'code',
    'referrerName',
    'referredName',
    'status',
    'createdAt',
    'completedAt',
    'rewardAmount',
    'actions'
  ];

  // Filtros
  filters: ReferralFilters = {
    status: 'all'
  };

  statusFilter = new FormControl('all');
  searchControl = new FormControl('');

  // Opciones de estado
  statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'pending', label: 'Pendientes' },
    { value: 'completed', label: 'Completados' },
    { value: 'expired', label: 'Expirados' }
  ];

  ngOnInit(): void {
    this.loadStats();
    this.loadReferrals();
    this.setupFilters();
  }

  /**
   * Configura los observables de filtros
   */
  private setupFilters(): void {
    // Filtro de estado
    this.statusFilter.valueChanges.subscribe(value => {
      this.filters.status = value as any;
      this.loadReferrals();
    });

    // Búsqueda con debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.filters.searchTerm = value || undefined;
        this.loadReferrals();
      });
  }

  /**
   * Carga las estadísticas globales
   */
  private loadStats(): void {
    this.loadingStats.set(true);

    this.referralService.getGlobalStats().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats.set(response.data);
        }
        this.loadingStats.set(false);
      },
      error: (error) => {
        console.error('Error loading stats:', error);

        let errorMessage = 'Error al cargar estadísticas';
        if (error.status === 404) {
          errorMessage = 'El endpoint de estadísticas no está disponible';
        } else if (error.status === 401 || error.status === 403) {
          errorMessage = 'No tienes permisos de administrador';
        } else if (error.status === 0) {
          errorMessage = 'No se puede conectar al servidor';
        }

        this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
        this.loadingStats.set(false);
      }
    });
  }

  /**
   * Carga todos los referidos
   * Usa recentReferrals del endpoint de estadísticas globales
   */
  private loadReferrals(): void {
    this.loading.set(true);

    this.referralService.getGlobalStats().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Usar recentReferrals del backend
          this.dataSource.data = response.data.recentReferrals || [];

          // Configurar paginador y ordenamiento después de cargar datos
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading referrals:', error);

        let errorMessage = 'Error al cargar referidos';
        if (error.status === 404) {
          errorMessage = 'El endpoint de estadísticas no está disponible';
        } else if (error.status === 401 || error.status === 403) {
          errorMessage = 'No tienes permisos. Inicia sesión nuevamente';
        } else if (error.status === 0) {
          errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté corriendo';
        }

        this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
        this.loading.set(false);
      }
    });
  }

  /**
   * Recarga todos los datos
   */
  refreshData(): void {
    this.loadStats();
    this.loadReferrals();
    this.snackBar.open('Datos actualizados', 'Ok', { duration: 2000 });
  }

  /**
   * Limpia todos los filtros
   */
  clearFilters(): void {
    this.statusFilter.setValue('all');
    this.searchControl.setValue('');
    this.filters = { status: 'all' };
    this.loadReferrals();
  }

  /**
   * Marca un referido como completado
   */
  markAsCompleted(referral: Referral): void {
    const dialogRef = this.dialog.open(MarkCompletedDialogComponent, {
      width: '400px',
      data: { referral }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const data: MarkCompletedDTO = {
          referralId: referral.id,
          purchaseId: result.purchaseId || 0, // TODO: Obtener purchaseId real
          purchaseAmount: result.amount
        };

        this.referralService.markCompleted(data).subscribe({
          next: (response) => {
            if (response.success) {
              this.snackBar.open('Referido marcado como completado', 'Ok', { duration: 3000 });
              this.refreshData();
            }
          },
          error: (error) => {
            console.error('Error marking as completed:', error);
            this.snackBar.open(
              error.error?.message || 'Error al marcar como completado',
              'Cerrar',
              { duration: 3000 }
            );
          }
        });
      }
    });
  }

  /**
   * Navega a la configuración
   */
  goToConfig(): void {
    this.router.navigate(['/referrals/config']);
  }

  /**
   * Navega al historial de cambios
   */
  goToHistory(): void {
    this.router.navigate(['/referrals/history']);
  }

  /**
   * Navega al leaderboard
   */
  goToLeaderboard(): void {
    this.router.navigate(['/referrals/leaderboard']);
  }

  /**
   * Obtiene la clase CSS para el chip de estado
   */
  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pending': 'status-pending',
      'completed': 'status-completed',
      'expired': 'status-expired'
    };
    return classes[status] || '';
  }

  /**
   * Obtiene el label traducido del estado
   */
  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pendiente',
      'completed': 'Completado',
      'expired': 'Expirado'
    };
    return labels[status] || status;
  }

  getInitials(name: string | undefined): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
  /**
   * Formatea una fecha
   */
  formatDate(date: string | null): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Formatea un monto de recompensa
   */
  formatReward(referral: Referral): string {
    if (!referral.referrerRewardAmount) return '-';
    return `Bs ${referral.referrerRewardAmount.toLocaleString('es-BO')}`;
  }

  /**
   * Verifica si un referido puede ser marcado como completado
   */
  canMarkAsCompleted(referral: Referral): boolean {
    return referral.status === 'pending';
  }
}

/**
 * Componente de diálogo para marcar como completado
 */
@Component({
  selector: 'app-mark-completed-dialog',
  standalone: false,
  template: `
    <h2 mat-dialog-title>Marcar Referido como Completado</h2>
    <mat-dialog-content>
      <p>Ingresa el monto de la primera compra:</p>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Monto de Primera Compra</mat-label>
        <input matInput type="number" [(ngModel)]="amount" min="0" step="100">
        <span matPrefix>Bs&nbsp;</span>
        <span matSuffix></span>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="null">Cancelar</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="{ amount: amount }" [disabled]="!amount || amount <= 0">
        Confirmar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    mat-dialog-content {
      min-width: 300px;
    }
  `]
})
export class MarkCompletedDialogComponent {
  amount: number = 0;
}
