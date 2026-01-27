import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CreditService } from '../../services/credit.service';
import { GlobalCreditStats, CreditTransaction } from '../../interfaces/credit.interface';

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
  stats = signal<GlobalCreditStats | null>(null);
  recentTransactions = signal<CreditTransaction[]>([]);

  // Table columns
  displayedColumns: string[] = ['createdAt', 'userName', 'type', 'amount', 'reason', 'balanceAfter'];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading.set(true);

    // Load global stats
    this.creditService.getGlobalStats().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading global stats:', error);
      }
    });

    // Load recent transactions (last 10)
    this.creditService.getAllTransactions().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.recentTransactions.set(response.data.slice(0, 10));
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.loading.set(false);
      }
    });
  }

  // Navigation methods
  navigateToGrant(): void {
    this.router.navigate(['/credits/grant']);
  }

  navigateToTransactions(): void {
    this.router.navigate(['/credits/transactions']);
  }

  // Utility methods
  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'grant': 'Otorgado',
      'usage': 'Usado',
      'refund': 'Reembolso',
      'expiration': 'Expirado'
    };
    return labels[type] || type;
  }

  getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      'grant': 'green',
      'usage': 'blue',
      'refund': 'orange',
      'expiration': 'red'
    };
    return colors[type] || 'gray';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Process expired credits
  processExpiredCredits(): void {
    if (confirm('¿Estás seguro de que deseas procesar los créditos expirados?')) {
      this.creditService.processExpiredCredits().subscribe({
        next: (response) => {
          if (response.success) {
            alert(`Se procesaron ${response.data?.expiredCount} créditos expirados por un total de ${this.formatCurrency(response.data?.totalAmount || 0)}`);
            this.loadDashboardData();
          }
        },
        error: (error) => {
          console.error('Error processing expired credits:', error);
          alert('Error al procesar créditos expirados');
        }
      });
    }
  }
}
