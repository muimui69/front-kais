import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CreditService } from '../../services/credit.service';
import { UpcomingExpirationsResponse, ExpirationDetail, ExpireCreditsResponse } from '../../interfaces/credit-stats.interface';

@Component({
  selector: 'app-expirations-monitor',
  standalone: false,
  templateUrl: './expirations-monitor.component.html',
  styleUrl: './expirations-monitor.component.css'
})
export class ExpirationsMonitorComponent implements OnInit {
  private creditService = inject(CreditService);
  private router = inject(Router);

  // State signals
  loading = signal<boolean>(true);
  processing = signal<boolean>(false);
  error = signal<string | null>(null);
  success = signal<boolean>(false);
  
  // Data
  expirationData = signal<UpcomingExpirationsResponse | null>(null);
  selectedDays = signal<number>(30);
  
  // Process results
  processResult = signal<ExpireCreditsResponse | null>(null);

  // Table columns
  displayedColumns: string[] = ['userName', 'userEmail', 'currentBalance', 'amountToExpire', 'expirationDate', 'daysRemaining', 'actions'];

  // Filter options
  daysOptions = [7, 15, 30, 60, 90];

  ngOnInit(): void {
    this.loadExpirations();
  }

  loadExpirations(): void {
    this.loading.set(true);
    this.error.set(null);

    this.creditService.getUpcomingExpirations(this.selectedDays()).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.expirationData.set(response.data);
        } else {
          this.error.set(response.message || 'Error al cargar expiraciones');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading expirations:', err);
        this.error.set('Error al conectar con el servidor');
        this.loading.set(false);
      }
    });
  }

  onDaysFilterChange(days: number): void {
    this.selectedDays.set(days);
    this.loadExpirations();
  }

  processExpiredCredits(): void {
    if (!confirm('¿Está seguro de que desea procesar las expiraciones? Esta acción es irreversible.')) {
      return;
    }

    this.processing.set(true);
    this.error.set(null);
    this.success.set(false);

    this.creditService.expireCreditsNow().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.success.set(true);
          this.processResult.set(response.data);
          this.loadExpirations(); // Reload data after processing
        } else {
          this.error.set(response.message || 'Error al procesar expiraciones');
        }
        this.processing.set(false);
      },
      error: (err) => {
        console.error('Error processing expirations:', err);
        this.error.set(err.error?.message || 'Error al conectar con el servidor');
        this.processing.set(false);
      }
    });
  }

  viewUserDetail(userId: string): void {
    this.router.navigate(['/credits/users', userId]);
  }

  goBack(): void {
    this.router.navigate(['/credits']);
  }

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
      day: 'numeric'
    });
  }

  formatDateTime(date: string): string {
    return new Date(date).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getDaysRemainingColor(days: number): string {
    if (days <= 3) return 'text-red-600';
    if (days <= 7) return 'text-orange-600';
    if (days <= 15) return 'text-yellow-600';
    return 'text-gray-600';
  }

  getDaysRemainingBadge(days: number): string {
    if (days <= 3) return 'bg-red-100 text-red-800';
    if (days <= 7) return 'bg-orange-100 text-orange-800';
    if (days <= 15) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  }
}
