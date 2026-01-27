import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CouponService } from '../../services/coupon.service';
import { Coupon, CouponFilters, GlobalCouponStats } from '../../interfaces/coupon.interface';
import { DialogComponent } from '../../../../shared/dialog/dialog.component';

@Component({
  selector: 'app-coupon-manager',
  standalone: false,
  templateUrl: './coupon-manager.component.html',
  styleUrl: './coupon-manager.component.css'
})
export class CouponManagerComponent implements OnInit {
  private couponService = inject(CouponService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private dialog = inject(DialogComponent);

  // Columnas de la tabla
  displayedColumns: string[] = [
    'code', 
    'description', 
    'discountType', 
    'discountValue', 
    'currentUses',
    'validUntil', 
    'isActive', 
    'actions'
  ];

  // Datos de la tabla
  dataSource = new MatTableDataSource<Coupon>([]);
  
  // Estado de carga
  isLoading = signal(true);
  
  // Estadísticas globales
  stats = signal<GlobalCouponStats | null>(null);
  
  // Filtros
  filters: CouponFilters = {
    isActive: true,
    validNow: false
  };

  // Filtro de búsqueda
  searchTerm = '';

  ngOnInit() {
    this.loadData();
    // TODO: Implementar estadísticas globales cuando el backend tenga la ruta
    // this.loadStats();
  }

  /**
   * Carga todos los cupones
   */
  loadData() {
    this.isLoading.set(true);
    
    this.couponService.getAll(this.filters).subscribe({
      next: (res) => {
        if (res.success) {
          // El backend devuelve { total, active, inactive, expired, coupons }
          this.dataSource.data = (res.data as any).coupons || res.data;
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading coupons:', err);
        this.snackBar.open('Error al cargar cupones', 'Cerrar', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Carga estadísticas globales
   */
  loadStats() {
    this.couponService.getGlobalStats().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats.set(res.data);
        }
      },
      error: (err) => {
        console.error('Error loading stats:', err);
      }
    });
  }

  /**
   * Aplica filtros y recarga los datos
   */
  applyFilters() {
    this.loadData();
  }

  /**
   * Busca cupones por término
   */
  search() {
    if (this.searchTerm.trim().length === 0) {
      this.loadData();
      return;
    }

    this.isLoading.set(true);
    
    this.couponService.search(this.searchTerm).subscribe({
      next: (res) => {
        if (res.success) {
          this.dataSource.data = res.data;
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error searching coupons:', err);
        this.snackBar.open('Error al buscar', 'Cerrar', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Limpia los filtros
   */
  clearFilters() {
    this.filters = {
      isActive: true,
      validNow: false
    };
    this.searchTerm = '';
    this.loadData();
  }

  /**
   * Navega al formulario de creación
   */
  createCoupon() {
    this.router.navigate(['/coupons/create']);
  }

  /**
   * Navega al formulario de edición
   */
  editCoupon(id: number) {
    this.router.navigate(['/coupons/edit', id]);
  }

  /**
   * Navega a las estadísticas del cupón
   */
  viewStats(id: number) {
    this.router.navigate(['/coupons/stats', id]);
  }

  /**
   * Activa o desactiva un cupón según su estado actual
   */
  toggleActive(coupon: Coupon) {
    const action = coupon.isActive ? 'desactivar' : 'activar';
    const actionCapitalized = coupon.isActive ? 'Desactivar' : 'Activar';
    
    this.dialog.openDialogQuestion(
      `¿Estás seguro de ${action} este cupón?`,
      `${actionCapitalized} Cupón`
    ).afterClosed().subscribe(result => {
      if (result) {
        const serviceCall = coupon.isActive 
          ? this.couponService.deactivate(coupon.id)
          : this.couponService.update(coupon.id, { isActive: true });

        serviceCall.subscribe({
          next: (res) => {
            if (res.success) {
              coupon.isActive = !coupon.isActive;
              this.snackBar.open(
                `Cupón ${coupon.isActive ? 'activado' : 'desactivado'} exitosamente`, 
                'Ok', 
                { duration: 2000 }
              );
            }
          },
          error: (err) => {
            console.error(`Error ${action}ing coupon:`, err);
            this.snackBar.open(
              err.error?.message || `Error al ${action} cupón`, 
              'Cerrar', 
              { duration: 3000 }
            );
          }
        });
      }
    });
  }

  /**
   * Desactiva un cupón permanentemente
   */
  deactivateCoupon(coupon: Coupon) {
    this.dialog.openDialogQuestion(
      '¿Estás seguro de desactivar este cupón?',
      'Desactivar Cupón'
    ).afterClosed().subscribe(result => {
      if (result) {
        this.couponService.deactivate(coupon.id).subscribe({
          next: (res) => {
            if (res.success) {
              this.snackBar.open('Cupón desactivado exitosamente', 'Ok', { duration: 2000 });
              coupon.isActive = false;
            }
          },
          error: (err) => {
            console.error('Error deactivating coupon:', err);
            this.snackBar.open(
              err.error?.message || 'Error al desactivar cupón', 
              'Cerrar', 
              { duration: 3000 }
            );
          }
        });
      }
    });
  }

  /**
   * Elimina un cupón
   */
  deleteCoupon(id: number, code: string) {
    this.dialog.openDialogQuestion(
      `¿Estás seguro de eliminar el cupón "${code}"? Solo se pueden eliminar cupones sin usos.`,
      'Eliminar Cupón'
    ).afterClosed().subscribe(result => {
      if (result) {
        this.couponService.delete(id).subscribe({
          next: (res) => {
            if (res.success) {
              this.snackBar.open('Cupón eliminado exitosamente', 'Ok', { duration: 2000 });
              this.dataSource.data = this.dataSource.data.filter(c => c.id !== id);
              this.loadStats(); // Recargar estadísticas
            }
          },
          error: (err) => {
            console.error('Error deleting coupon:', err);
            this.snackBar.open(
              err.error?.message || 'Error al eliminar cupón', 
              'Cerrar', 
              { duration: 3000 }
            );
          }
        });
      }
    });
  }

  /**
   * Verifica si un cupón está expirado
   */
  isExpired(validUntil: string): boolean {
    return new Date(validUntil) < new Date();
  }

  /**
   * Verifica si un cupón está próximo a expirar (7 días)
   */
  isExpiringSoon(validUntil: string): boolean {
    const expirationDate = new Date(validUntil);
    const today = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiration <= 7 && daysUntilExpiration > 0;
  }

  /**
   * Obtiene el porcentaje de uso de un cupón
   */
  getUsagePercentage(coupon: Coupon): number {
    if (!coupon.maxTotalUses) return 0;
    return (coupon.timesUsed / coupon.maxTotalUses) * 100;
  }

  /**
   * Determina si un cupón está cerca de su límite (80%)
   */
  isNearLimit(coupon: Coupon): boolean {
    return this.getUsagePercentage(coupon) >= 80;
  }

  /**
   * Formatea el valor del descuento
   */
  formatDiscount(coupon: Coupon): string {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}%`;
    } else {
      return `${coupon.discountValue} BOB`;
    }
  }

  /**
   * Traduce el tipo de aplicación
   */
  translateAppliesTo(appliesTo: string): string {
    const translations: { [key: string]: string } = {
      'plans': 'Planes',
      'extras': 'Extras',
      'ads': 'Publicidad',
      'all': 'Todos'
    };
    return translations[appliesTo] || appliesTo;
  }
}
