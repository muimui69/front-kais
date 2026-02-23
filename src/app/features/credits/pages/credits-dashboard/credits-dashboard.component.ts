import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CreditService } from '../../services/credit.service';
import { CreditStats } from '../../interfaces/credit-stats.interface';

@Component({
  selector: 'app-credits-dashboard',
  standalone: false,
  templateUrl: './credits-dashboard.component.html',
  styleUrl: './credits-dashboard.component.css'
})
export class CreditsDashboardComponent implements OnInit {
  private creditService = inject(CreditService);
  private router = inject(Router);

  // State signals
  loading = signal<boolean>(true);
  stats = signal<CreditStats | null>(null);
  error = signal<string | null>(null);

  // Table columns for recent transactions
  displayedColumns: string[] = ['createdAt', 'userName', 'type', 'amount', 'source', 'description', 'balanceAfter'];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.creditService.getCreditStats().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats.set(response.data);
        } else {
          this.error.set(response.message || 'Error al cargar estadísticas');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading credit stats:', err);
        this.error.set('Error al conectar con el servidor');
        this.loading.set(false);
      }
    });
  }

  // Navigation methods
  navigateToGrant(): void {
    this.router.navigate(['/credits/grant']);
  }

  navigateToExpirations(): void {
    this.router.navigate(['/credits/expirations']);
  }

  navigateToAudit(): void {
    this.router.navigate(['/credits/audit']);
  }

  // Utility methods
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-BO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getCurrentMonth(): string {
    return new Date().toLocaleDateString('es-BO', { month: 'long', year: 'numeric' });
  }

  hasUpcomingExpirations(): boolean {
    const expiringAmount = this.stats()?.creditsExpiringIn30Days || 0;
    return expiringAmount > 0;
  }
}

