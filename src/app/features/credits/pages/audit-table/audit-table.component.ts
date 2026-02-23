import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CreditService } from '../../services/credit.service';
import { TransactionSummary, TransactionListResponse } from '../../interfaces/credit-stats.interface';
import { CreditTransactionFilters } from '../../interfaces/credit.interface';

@Component({
  selector: 'app-audit-table',
  standalone: false,
  templateUrl: './audit-table.component.html',
  styleUrl: './audit-table.component.css'
})
export class AuditTableComponent implements OnInit {
  private fb = inject(FormBuilder);
  private creditService = inject(CreditService);
  private router = inject(Router);

  // Form
  filterForm!: FormGroup;

  // State signals
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  // Data
  transactions = signal<TransactionSummary[]>([]);
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalItems = signal<number>(0);
  pageSize = signal<number>(50);

  // Table columns
  displayedColumns: string[] = ['createdAt', 'userId', 'userName', 'type', 'amount', 'source', 'description', 'balanceAfter'];

  // Filter options
  typeOptions = [
    { value: 'all', label: 'Todos los Tipos' },
    { value: 'earned', label: 'Ganados' },
    { value: 'used', label: 'Usados' },
    { value: 'expired', label: 'Expirados' },
    { value: 'refunded', label: 'Reembolsados' }
  ];

  sourceOptions = [
    { value: 'all', label: 'Todas las Fuentes' },
    { value: 'referral', label: 'Referidos' },
    { value: 'admin', label: 'Administrativo' },
    { value: 'promotion', label: 'Promoción' },
    { value: 'refund', label: 'Reembolso' }
  ];

  ngOnInit(): void {
    this.initFilterForm();
    this.loadTransactions();
  }

  initFilterForm(): void {
    this.filterForm = this.fb.group({
      type: ['all'],
      source: ['all'],
      startDate: [''],
      endDate: [''],
      userIdFilter: ['']
    });
  }

  loadTransactions(page: number = 1): void {
    this.loading.set(true);
    this.error.set(null);

    const filters: CreditTransactionFilters = {};
    const formValue = this.filterForm.value;

    if (formValue.type && formValue.type !== 'all') {
      filters.type = formValue.type;
    }
    if (formValue.source && formValue.source !== 'all') {
      filters.source = formValue.source;
    }
    if (formValue.startDate) {
      filters.startDate = new Date(formValue.startDate).toISOString();
    }
    if (formValue.endDate) {
      filters.endDate = new Date(formValue.endDate).toISOString();
    }
    if (formValue.userIdFilter) {
      filters.userId = Number(formValue.userIdFilter);
    }

    this.creditService.getAllTransactionsPaginated(
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
        } else {
          this.error.set(response.message || 'Error al cargar transacciones');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
        this.error.set('Error al conectar con el servidor');
        this.loading.set(false);
      }
    });
  }

  onFilterChange(): void {
    this.loadTransactions(1);
  }

  clearFilters(): void {
    this.filterForm.reset({
      type: 'all',
      source: 'all',
      startDate: '',
      endDate: '',
      userIdFilter: ''
    });
    this.loadTransactions(1);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.loadTransactions(page);
  }

  viewUserDetail(userId: number): void {
    this.router.navigate(['/credits/users', userId]);
  }

  goBack(): void {
    this.router.navigate(['/credits']);
  }

  exportToCSV(): void {
    // TODO: Implementar exportación CSV si es necesario
    alert('Función de exportación disponible próximamente');
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
}
