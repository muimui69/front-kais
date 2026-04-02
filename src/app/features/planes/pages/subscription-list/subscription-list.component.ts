import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';

import { SubscriptionService } from '../../services/subscription.service';
import { PlanService } from '../../services/plan.service';
import { Subscription } from '../../interfaces/subscription.interface';
import { Plan, PlanStats } from '../../interfaces/plan.interface';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { GrantSubscriptionDialogComponent } from './dialogs/grant-subscription-dialog.component';
import { CancelSubscriptionDialogComponent } from './dialogs/cancel-subscription-dialog.component';

@Component({
  selector: 'app-subscription-list',
  standalone: false,
  templateUrl: './subscription-list.component.html',
  styleUrl: './subscription-list.component.css',
})
export class SubscriptionListComponent implements OnInit {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly planService = inject(PlanService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly matDialog = inject(MatDialog);
  public readonly dialog = new DialogComponent(this.matDialog);

  displayedColumns = ['id', 'user', 'plan', 'totalPaid', 'status', 'startDate', 'endDate', 'acciones'];

  dataSource: Subscription[] = [];
  loading = signal(false);
  totalItems = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);

  stats: PlanStats | null = null;
  plans: Plan[] = [];

  statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'active', label: 'Activas' },
    { value: 'cancelled', label: 'Canceladas' },
    { value: 'expired', label: 'Expiradas' },
  ];

  filterForm: FormGroup = this.fb.group({
    status: [''],
    planId: [''],
    userId: [''],
    dateFrom: [null],
    dateTo: [null],
  });

  ngOnInit(): void {
    forkJoin({
      stats: this.planService.getStats(),
      plans: this.planService.getAll({}, { page: 1, limit: 100 }),
    }).subscribe({
      next: ({ stats, plans }) => {
        this.stats = stats.data;
        this.plans = plans.data;
      },
    });

    this.loadSubscriptions();

    this.filterForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.pageIndex.set(0);
        this.loadSubscriptions();
      });
  }

  loadSubscriptions(): void {
    this.loading.set(true);
    const { status, planId, userId, dateFrom, dateTo } = this.filterForm.value;

    this.subscriptionService.getAll(
      {
        status: status || undefined,
        planId: planId ? Number(planId) : undefined,
        userId: userId ? Number(userId) : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      },
      { page: this.pageIndex() + 1, limit: this.pageSize() }
    ).subscribe({
      next: (res) => {
        this.dataSource = res.data;
        this.totalItems.set(res.pagination.totalItems);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadSubscriptions();
  }

  onViewDetail(sub: Subscription): void {
    this.router.navigate(['/planes/subscriptions', sub.id]);
  }

  openGrantDialog(): void {
    const ref = this.matDialog.open(GrantSubscriptionDialogComponent, {
      width: '560px',
      data: { plans: this.plans },
    });

    ref.afterClosed().subscribe((dto) => {
      if (!dto) return;
      this.subscriptionService.grant(dto).subscribe({
        next: (res) => {
          this.dialog.openDialogSuccess(res.message, 'Suscripción otorgada');
          this.loadSubscriptions();
        },
        error: (err) => this.dialog.openDialogError(err.error?.message || 'Error al otorgar', 'Error'),
      });
    });
  }

  openCancelDialog(sub: Subscription): void {
    const ref = this.matDialog.open(CancelSubscriptionDialogComponent, {
      width: '480px',
      data: { sub },
    });

    ref.afterClosed().subscribe((reason: string | undefined) => {
      if (!reason) return;
      this.subscriptionService.cancel(sub.id, { reason }).subscribe({
        next: (res) => {
          this.dialog.openDialogSuccess(res.message, 'Suscripción cancelada');
          this.loadSubscriptions();
        },
        error: (err) => this.dialog.openDialogError(err.error?.message || 'Error al cancelar', 'Error'),
      });
    });
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { active: 'Activa', cancelled: 'Cancelada', expired: 'Expirada' };
    return map[status] ?? status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = { active: 'chip-active', cancelled: 'chip-cancelled', expired: 'chip-expired' };
    return map[status] ?? '';
  }
}
