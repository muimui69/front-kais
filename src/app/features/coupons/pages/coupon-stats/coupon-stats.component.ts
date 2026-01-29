import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CouponService } from '../../services/coupon.service';
import { Coupon, CouponStats, CouponUsage } from '../../interfaces/coupon.interface';

@Component({
  selector: 'app-coupon-stats',
  standalone: false,
  templateUrl: './coupon-stats.component.html',
  styleUrl: './coupon-stats.component.css'
})
export class CouponStatsComponent implements OnInit {
  private couponService = inject(CouponService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // State signals
  loading = signal<boolean>(true);
  coupon = signal<Coupon | null>(null);
  stats = signal<CouponStats | null>(null);
  usages = signal<CouponUsage[]>([]);

  // Table columns for usages
  displayedColumns: string[] = ['usedAt', 'userName', 'userEmail', 'originalAmount', 'discountAmount', 'finalAmount'];

  ngOnInit(): void {
    const couponId = Number(this.route.snapshot.paramMap.get('id'));
    if (couponId) {
      this.loadCouponData(couponId);
    } else {
      this.router.navigate(['/coupons']);
    }
  }

  private loadCouponData(couponId: number): void {
    this.loading.set(true);

    // Load coupon details
    this.couponService.getById(couponId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.coupon.set(response.data);
          this.loadStats(couponId);
          this.loadUsages(couponId);
        } else {
          console.error('Error loading coupon:', response.message);
          this.router.navigate(['/coupons']);
        }
      },
      error: (error) => {
        console.error('Error loading coupon:', error);
        this.router.navigate(['/coupons']);
      }
    });
  }

  private loadStats(couponId: number): void {
    this.couponService.getStats(couponId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.stats.set(response.data);
        }
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  private loadUsages(couponId: number): void {
    this.couponService.getUsages(couponId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.usages.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading usages:', error);
        this.loading.set(false);
      }
    });
  }

  // Utility methods
  getUsagePercentage(): number {
    const currentCoupon = this.coupon();
    if (!currentCoupon || !currentCoupon.maxTotalUses) return 0;
    return (currentCoupon.timesUsed / currentCoupon.maxTotalUses) * 100;
  }

  isExpired(): boolean {
    const currentCoupon = this.coupon();
    if (!currentCoupon || !currentCoupon.validUntil) return false;
    return new Date(currentCoupon.validUntil) < new Date();
  }

  getStatusColor(): string {
    const currentCoupon = this.coupon();
    if (!currentCoupon) return 'gray';
    if (!currentCoupon.isActive) return 'red';
    if (this.isExpired()) return 'orange';
    return 'green';
  }

  getStatusText(): string {
    const currentCoupon = this.coupon();
    if (!currentCoupon) return 'Desconocido';
    if (!currentCoupon.isActive) return 'Inactivo';
    if (this.isExpired()) return 'Expirado';
    return 'Activo';
  }

  getUsageTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'subscription': 'Suscripciones',
      'extra': 'Extras',
      'ad_subscription': 'Publicidad'
    };
    return labels[type] || type;
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return 'No definido';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    const formatted = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'BOB'
    }).format(amount);
    // Reemplazar "BOB" por "Bs" para usar el símbolo local
    return formatted.replace('BOB', 'Bs');
  }

  getUsagePercentageByType(usageCount: number | undefined): number {
    const totalUses = this.stats()?.totalUses ?? 1;
    const count = usageCount ?? 0;
    return (count / totalUses) * 100;
  }

  goBack(): void {
    this.router.navigate(['/coupons']);
  }
}
