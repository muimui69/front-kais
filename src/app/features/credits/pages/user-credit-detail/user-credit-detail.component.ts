import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditService } from '../../services/credit.service';
import { 
  UserCreditInfo, 
  UserCreditStatsDetailed, 
  TransactionSummary, 
  TransactionListResponse 
} from '../../interfaces/credit-stats.interface';
import { CreditTransactionFilters } from '../../interfaces/credit.interface';

@Component({
  selector: 'app-user-credit-detail',
  standalone: false,
  templateUrl: './user-credit-detail.component.html',
  styleUrl: './user-credit-detail.component.css'
})
export class UserCreditDetailComponent implements OnInit {
  private creditService = inject(CreditService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // State signals
  userId = signal<string>('');
  userInfo = signal<UserCreditInfo | null>(null);
  userStats = signal<UserCreditStatsDetailed | null>(null);
  transactions = signal<TransactionSummary[]>([]);
  loading = signal<boolean>(true);
  loadingTransactions = signal<boolean>(false);
  error = signal<string | null>(null);

  // Pagination
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalItems = signal<number>(0);
  pageSize = signal<number>(20);

  // Filters
  typeFilter = signal<string>('all');
  sourceFilter = signal<string>('all');

  // Table columns
  displayedColumns: string[] = ['createdAt', 'type', 'amount', 'source', 'description', 'balanceAfter', 'expiresAt'];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['userId'];
      if (id) {
        this.userId.set(id);
        this.loadUserData();
      }
    });
  }

  loadUserData(): void {
    this.loading.set(true);
    this.error.set(null);

    // Load user info and stats in parallel
    Promise.all([
      this.creditService.getUserCreditInfo(this.userId()).toPromise(),
      this.creditService.getUserCreditStatsDetailed(this.userId()).toPromise()
    ]).then(([infoResponse, statsResponse]) => {
      if (infoResponse?.success && infoResponse.data) {
        this.userInfo.set(infoResponse.data);
      }
      if (statsResponse?.success && statsResponse.data) {
        this.userStats.set(statsResponse.data);
      }
      this.loading.set(false);
      this.loadTransactions();
    }).catch(err => {
      console.error('Error loading user data:', err);
      this.error.set('Error al cargar datos del usuario');
      this.loading.set(false);
    });
  }

  loadTransactions(page: number = 1): void {
    this.loadingTransactions.set(true);
    
    const filters: Partial<CreditTransactionFilters> = {};
    if (this.typeFilter() !== 'all') {
      filters.type = this.typeFilter() as any;
    }
    if (this.sourceFilter() !== 'all') {
      filters.source = this.sourceFilter() as any;
    }

    this.creditService.getUserTransactionsPaginated(
      this.userId(),
      page,
      this.pageSize(),
      filters
    ).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.transactions.set(response.data.transactions);
          this.currentPage.set(response.data.pagination.page);
          this.totalPages.set(response.data.pagination.totalPages);
          this.totalItems.set(response.data.pagination.total);
        }
        this.loadingTransactions.set(false);
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
        this.loadingTransactions.set(false);
      }
    });
  }

  onFilterChange(): void {
    this.loadTransactions(1);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.loadTransactions(page);
  }

  goBack(): void {
    this.router.navigate(['/credits/search']);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDateOnly(date: string): string {
    return new Date(date).toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
