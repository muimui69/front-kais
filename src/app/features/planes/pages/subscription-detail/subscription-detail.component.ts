import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { SubscriptionService } from '../../services/subscription.service';
import { SubscriptionDetail } from '../../interfaces/subscription.interface';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';
import { CancelSubscriptionDialogComponent } from '../subscription-list/dialogs/cancel-subscription-dialog.component';

@Component({
  selector: 'app-subscription-detail',
  standalone: false,
  templateUrl: './subscription-detail.component.html',
  styleUrl: './subscription-detail.component.css',
})
export class SubscriptionDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly matDialog = inject(MatDialog);
  public readonly dialog = new DialogComponent(this.matDialog);

  subscription = signal<SubscriptionDetail | null>(null);
  loading = signal(false);

  txColumns = ['type', 'amount', 'status', 'createdAt'];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDetail(id);
  }

  loadDetail(id: number): void {
    this.loading.set(true);
    this.subscriptionService.getById(id).subscribe({
      next: (res) => {
        this.subscription.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/planes/subscriptions']);
      },
    });
  }

  openCancelDialog(): void {
    const sub = this.subscription();
    if (!sub) return;

    const ref = this.matDialog.open(CancelSubscriptionDialogComponent, {
      width: '480px',
      data: { sub },
    });

    ref.afterClosed().subscribe((reason: string | undefined) => {
      if (!reason) return;
      this.subscriptionService.cancel(sub.id, { reason }).subscribe({
        next: (res) => {
          this.dialog.openDialogSuccess(res.message, 'Suscripción cancelada');
          this.loadDetail(sub.id);
        },
        error: (err) => this.dialog.openDialogError(err.error?.message || 'Error al cancelar', 'Error'),
      });
    });
  }

  getUsagePercent(used: number, limit: number | null): number {
    if (!limit || limit === 0) return 0;
    return Math.min((used / limit) * 100, 100);
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = { active: 'Activa', cancelled: 'Cancelada', expired: 'Expirada' };
    return map[status] ?? status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = { active: 'chip-active', cancelled: 'chip-cancelled', expired: 'chip-expired' };
    return map[status] ?? '';
  }

  goBack(): void {
    this.router.navigate(['/planes/subscriptions']);
  }
}
