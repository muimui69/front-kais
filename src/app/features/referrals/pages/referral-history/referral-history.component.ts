import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ReferralService } from '../../services/referral.service';
import { ProgramHistoryEntry, HistoryFilters, ProgramHistoryResponse } from '../../interfaces/referral.interface';

@Component({
  selector: 'app-referral-history',
  standalone: false,
  templateUrl: './referral-history.component.html',
  styleUrl: './referral-history.component.css'
})
export class ReferralHistoryComponent implements OnInit {
  private referralService = inject(ReferralService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Estado de carga
  loading = signal(true);

  // Datos de historial
  dataSource = new MatTableDataSource<ProgramHistoryEntry>([]);
  displayedColumns: string[] = [
    'changedAt',
    'changeType',
    'changedByName',
    'changes',
    'ipAddress'
  ];

  // Paginación
  pagination = signal<any>(null);
  currentPage = 1;

  // Filtros
  filters: HistoryFilters = {
    page: 1,
    limit: 20
  };

  // Controls de filtros
  changeTypeControl = new FormControl('');
  limitControl = new FormControl(20);
  dateFromControl = new FormControl('');
  dateToControl = new FormControl('');

  // Opciones
  changeTypeOptions = [
    { value: '', label: 'Todos los tipos' },
    { value: 'create', label: 'Creación' },
    { value: 'update', label: 'Actualización' },
    { value: 'activate', label: 'Activación' },
    { value: 'deactivate', label: 'Desactivación' }
  ];

  limitOptions = [
    { value: 10, label: '10 por página' },
    { value: 20, label: '20 por página' },
    { value: 50, label: '50 por página' },
    { value: 100, label: '100 por página' }
  ];

  ngOnInit(): void {
    this.loadHistory();
    this.setupFilters();
  }

  /**
   * Configura los observables de filtros
   */
  private setupFilters(): void {
    this.changeTypeControl.valueChanges.subscribe(value => {
      this.filters.changeType = value as any || undefined;
      this.filters.page = 1;
      this.loadHistory();
    });

    this.limitControl.valueChanges.subscribe(value => {
      this.filters.limit = value || 20;
      this.filters.page = 1;
      this.loadHistory();
    });

    this.dateFromControl.valueChanges.subscribe(value => {
      this.filters.dateFrom = value ? new Date(value).toISOString() : undefined;
      this.filters.page = 1;
      this.loadHistory();
    });

    this.dateToControl.valueChanges.subscribe(value => {
      this.filters.dateTo = value ? new Date(value).toISOString() : undefined;
      this.filters.page = 1;
      this.loadHistory();
    });
  }

  /**
   * Carga el historial de cambios
   */

  getFormattedChanges(changeDescription: string): string {
    // Si no hay flecha, devolver tal cual
    if (!changeDescription.includes('→')) {
      return changeDescription;
    }

    const parts = changeDescription.split('→');
    const leftPart = parts[0].trim(); // "Campo: ValorViejo"
    const newValue = parts[1].trim(); // "ValorNuevo"

    // Separar el nombre del campo del valor antiguo
    const separatorIndex = leftPart.indexOf(':');

    if (separatorIndex === -1) return changeDescription;

    const fieldName = leftPart.substring(0, separatorIndex + 1); // "Campo:"
    const oldValue = leftPart.substring(separatorIndex + 1).trim(); // "ValorViejo"

    // Retornar HTML seguro (usaremos [innerHTML] en la vista)
    return `
      <span class="diff-field">${fieldName}</span>
      <span class="diff-old">${oldValue}</span>
      <span class="diff-arrow">→</span>
      <span class="diff-new">${newValue}</span>
    `;
  }

  /**
   * Obtiene iniciales para el avatar
   */
  getInitials(name: string): string {
    return name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : '??';
  }

  private loadHistory(): void {
    this.loading.set(true);

    this.referralService.getProgramHistory(this.filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // response.data contiene el array de historial directamente
          this.dataSource.data = response.data;
          // pagination está en la raíz del response
          this.pagination.set(response.pagination);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading history:', error);

        let errorMessage = 'Error al cargar historial';
        if (error.status === 404) {
          errorMessage = 'El endpoint de historial no está disponible';
        } else if (error.status === 401 || error.status === 403) {
          errorMessage = 'No tienes permisos de administrador';
        } else if (error.status === 0) {
          errorMessage = 'No se puede conectar al servidor';
        }

        this.snackBar.open(errorMessage, 'Cerrar', { duration: 5000 });
        this.loading.set(false);
      }
    });
  }

  /**
   * Maneja el cambio de página
   */
  onPageChange(event: PageEvent): void {
    this.filters.page = event.pageIndex + 1;
    this.filters.limit = event.pageSize;
    this.loadHistory();
  }

  /**
   * Limpia todos los filtros
   */
  clearFilters(): void {
    this.changeTypeControl.setValue('');
    this.limitControl.setValue(20);
    this.dateFromControl.setValue('');
    this.dateToControl.setValue('');
    this.filters = { page: 1, limit: 20 };
    this.loadHistory();
    this.snackBar.open('Filtros limpiados', 'Ok', { duration: 2000 });
  }

  /**
   * Recarga el historial
   */
  refresh(): void {
    this.loadHistory();
    this.snackBar.open('Historial actualizado', 'Ok', { duration: 2000 });
  }

  /**
   * Navega al dashboard
   */
  goToDashboard(): void {
    this.router.navigate(['/referrals']);
  }

  /**
   * Navega a la configuración
   */
  goToConfig(): void {
    this.router.navigate(['/referrals/config']);
  }

  /**
   * Obtiene el label del tipo de cambio
   */
  getChangeTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'create': 'Creación',
      'update': 'Actualización',
      'activate': 'Activación',
      'deactivate': 'Desactivación'
    };
    return labels[type] || type;
  }

  /**
   * Obtiene la clase CSS del tipo de cambio
   */
  getChangeTypeClass(type: string): string {
    return `change-type-${type}`;
  }

  /**
   * Formatea los cambios realizados
   */
  formatChanges(entry: ProgramHistoryEntry): string {
    const changes: string[] = [];
    const processedKeys = new Set<string>();

    Object.keys(entry.newValues).forEach(key => {
      // Saltar si ya procesamos este campo
      if (processedKeys.has(key)) return;

      const oldVal = entry.oldValues[key];
      const newVal = entry.newValues[key];

      if (oldVal !== newVal) {
        // Agrupar información de cupones (código + nombre + descuento)
        if (key === 'referrerCouponCode' || key === 'referredCouponCode') {
          const prefix = key.startsWith('referrer') ? 'referrer' : 'referred';
          const label = key.startsWith('referrer') ? 'Cupón Referidor' : 'Cupón Referido';

          // Obtener valores asociados
          const oldCode = entry.oldValues[`${prefix}CouponCode`];
          const newCode = entry.newValues[`${prefix}CouponCode`];
          const oldName = entry.oldValues[`${prefix}CouponName`];
          const newName = entry.newValues[`${prefix}CouponName`];
          const oldDiscountValue = entry.oldValues[`${prefix}CouponDiscountValue`];
          const newDiscountValue = entry.newValues[`${prefix}CouponDiscountValue`];
          const oldDiscountType = entry.oldValues[`${prefix}CouponDiscountType`];
          const newDiscountType = entry.newValues[`${prefix}CouponDiscountType`];

          // Formatear valores completos
          const oldFormatted = this.formatCouponFull(oldCode, oldName, oldDiscountValue, oldDiscountType);
          const newFormatted = this.formatCouponFull(newCode, newName, newDiscountValue, newDiscountType);

          if (oldFormatted !== newFormatted) {
            changes.push(`${label}: ${oldFormatted} → ${newFormatted}`);
          }

          // Marcar campos relacionados como procesados
          processedKeys.add(`${prefix}CouponCode`);
          processedKeys.add(`${prefix}CouponName`);
          processedKeys.add(`${prefix}CouponDiscountValue`);
          processedKeys.add(`${prefix}CouponDiscountType`);
          processedKeys.add(`${prefix}CouponId`);

          return;
        }

        // Saltar campos de cupones individuales (ya los agrupamos arriba)
        if (key.includes('CouponName') || key.includes('CouponId') ||
            key.includes('CouponDiscount')) {
          return;
        }

        // Nombres de campos en español
        const fieldNames: Record<string, string> = {
          'referrerRewardType': 'Tipo Recompensa Referidor',
          'referrerCreditAmount': 'Crédito Referidor',
          'referredRewardType': 'Tipo Recompensa Referido',
          'referredCreditAmount': 'Crédito Referido',
          'isActive': 'Estado Programa'
        };

        const fieldName = fieldNames[key] || key;

        // Formatear valores
        let oldFormatted = this.formatValue(key, oldVal);
        let newFormatted = this.formatValue(key, newVal);

        changes.push(`${fieldName}: ${oldFormatted} → ${newFormatted}`);
      }
    });

    return changes.join(' | ') || 'Sin cambios detectados';
  }

  /**
   * Formatea información completa de un cupón (código + nombre + descuento)
   */
  private formatCouponFull(code: string | null, name: string | null,
                           discountValue: string | null, discountType: string | null): string {
    if (!code) return 'Ninguno';

    let result = code;

    // Agregar nombre si existe
    if (name) {
      result += ` (${name}`;

      // Agregar descuento si existe
      if (discountValue && discountType) {
        const discount = discountType === 'percentage'
          ? `${discountValue}% desc`
          : `Bs ${Number(discountValue).toLocaleString('es-BO')}`;
        result += `, ${discount}`;
      }

      result += ')';
    } else if (discountValue && discountType) {
      // Si no hay nombre pero sí descuento
      const discount = discountType === 'percentage'
        ? `${discountValue}% desc`
        : `Bs ${Number(discountValue).toLocaleString('es-BO')}`;
      result += ` (${discount})`;
    }

    return result;
  }

  /**
   * Formatea un valor según su tipo
   */
  private formatValue(key: string, value: any): string {
    if (value === null || value === undefined) return 'Ninguno';

    // Tipos de recompensa
    if (key === 'referrerRewardType' || key === 'referredRewardType') {
      const rewardTypes: Record<string, string> = {
        'credit': 'Crédito',
        'coupon': 'Cupón',
        'both': 'Crédito + Cupón',
        'none': 'Sin recompensa'
      };
      return rewardTypes[value] || value;
    }

    // Códigos de cupón
    if (key === 'referrerCouponCode' || key === 'referredCouponCode') {
      return value || 'Ninguno';
    }

    // Nombres de cupón
    if (key === 'referrerCouponName' || key === 'referredCouponName') {
      return value || 'Ninguno';
    }

    // Montos de crédito
    if (key === 'referrerCreditAmount' || key === 'referredCreditAmount') {
      return `Bs ${Number(value).toLocaleString('es-BO')}`;
    }

    // Estado del programa
    if (key === 'isActive') {
      return value ? 'Activo' : 'Inactivo';
    }

    return String(value);
  }

  /**
   * Formatea una fecha
   */
  formatDate(date: string): string {
    return new Date(date).toLocaleString('es-BO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
