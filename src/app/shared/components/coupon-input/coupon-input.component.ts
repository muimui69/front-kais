import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
import { CouponService } from '../../../features/coupons/services/coupon.service';
import { CouponValidation } from '../../../features/coupons/interfaces/coupon.interface';

/**
 * Componente reutilizable para input de cupones con validación en tiempo real
 * 
 * Uso:
 * <app-coupon-input
 *   [userId]="companyId"
 *   [appliesTo]="'plans'"
 *   [targetId]="planId"
 *   [amount]="price"
 *   [disabled]="false"
 *   (couponApplied)="onCouponApplied($event)"
 * ></app-coupon-input>
 */
@Component({
  selector: 'app-coupon-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './coupon-input.component.html',
  styleUrl: './coupon-input.component.css'
})
export class CouponInputComponent implements OnInit, OnDestroy {
  @Input() userId!: number;
  @Input() appliesTo!: 'plans' | 'extras' | 'ads';
  @Input() targetId!: number;
  @Input() amount!: number;
  @Input() disabled = false;
  @Output() couponApplied = new EventEmitter<CouponValidation>();
  @Output() couponRemoved = new EventEmitter<void>();

  // Signals para estado reactivo
  code = signal('');
  validating = signal(false);
  isValid = signal(false);
  discountAmount = signal(0);
  finalAmount = signal(0);
  errorMessage = signal('');

  private debouncer = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private couponService: CouponService) {}

  ngOnInit() {
    // Configurar debounce para validación automática
    this.debouncer.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(code => this.validateCoupon(code))
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Maneja el cambio del código de cupón
   */
  onCodeChange(newCode: string) {
    this.code.set(newCode.toUpperCase());
    this.debouncer.next(this.code());
  }

  /**
   * Valida el cupón contra el backend
   */
  private validateCoupon(code: string) {
    // Si el código está vacío o muy corto, resetear estado
    if (!code || code.length < 3) {
      this.reset();
      return of(void 0);
    }

    this.validating.set(true);
    this.errorMessage.set('');

    return this.couponService.validate({
      code: code,
      userId: this.userId,
      appliesTo: this.appliesTo,
      targetId: this.targetId,
      amount: this.amount
    }).pipe(
      tap(response => {
        this.validating.set(false);
        
        if (response.success && response.data.valid) {
          // Cupón válido
          this.isValid.set(true);
          this.discountAmount.set(response.data.discountAmount || 0);
          this.finalAmount.set(response.data.finalAmount || this.amount);
          this.errorMessage.set('');
          
          // Emitir evento de cupón aplicado
          this.couponApplied.emit(response.data);
        } else {
          // Cupón no válido
          this.isValid.set(false);
          this.discountAmount.set(0);
          this.finalAmount.set(this.amount);
          this.errorMessage.set(response.data.reason || 'Cupón no válido');
          
          // Emitir evento con cupón no válido
          this.couponApplied.emit({ valid: false, reason: this.errorMessage() });
        }
      }),
      catchError((error) => {
        this.validating.set(false);
        this.isValid.set(false);
        this.discountAmount.set(0);
        this.finalAmount.set(this.amount);
        this.errorMessage.set('Error al validar cupón');
        
        console.error('Error validating coupon:', error);
        
        this.couponApplied.emit({ valid: false, reason: 'Error al validar cupón' });
        return of(void 0);
      })
    );
  }

  /**
   * Resetea el estado del componente
   */
  reset() {
    this.isValid.set(false);
    this.discountAmount.set(0);
    this.finalAmount.set(this.amount);
    this.errorMessage.set('');
    this.couponApplied.emit({ valid: false });
  }

  /**
   * Limpia el cupón aplicado
   */
  clear() {
    this.code.set('');
    this.reset();
    this.couponRemoved.emit();
  }

  /**
   * Método público para aplicar un cupón programáticamente
   */
  applyCoupon(code: string) {
    this.code.set(code.toUpperCase());
    this.onCodeChange(this.code());
  }
}
