import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdPlan } from '../../../ad-plan/interfaces/ad-plan';
import { AdPlanService } from '../../../ad-plan/services/ad-plan.service';
import { Advertisement, CreateSubscriptionDTO } from '../../interfaces/advertising.interface';
import { AdvertisingService } from '../../services/advertising.service';
import { environment } from '../../../../../environment/environment';
import { CouponService } from '../../../coupons/services/coupon.service';
import { CouponValidation } from '../../../coupons/interfaces/coupon.interface';
import { StorageService } from '../../../user-management/services/storage.service';

@Component({
  selector: 'app-subscription-modal',
  standalone: false,
  templateUrl: './subscription-modal.component.html',
  styleUrl: './subscription-modal.component.css'
})
export class SubscriptionModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adService = inject(AdvertisingService);
  private planService = inject(AdPlanService);
  private couponService = inject(CouponService);
  private storageService = inject(StorageService);
  private dialogRef = inject(MatDialogRef<SubscriptionModalComponent>);
  private snackBar = inject(MatSnackBar);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { advertisement: Advertisement }) {}

  plans: AdPlan[] = [];
  isLoading = false;

  form: FormGroup = this.fb.group({
    planId: [null, [Validators.required]],
    startDate: [new Date().toISOString().slice(0, 10), [Validators.required]],
    couponCode: ['']
  });

  selectedPlan: AdPlan | null = null;
  endDatePreview: Date | null = null;

  // Estado del cupón
  couponCode: string = '';
  appliedCoupon: CouponValidation | null = null;
  originalPrice: number = 0;
  discountAmount: number = 0;
  finalPrice: number = 0;
  isValidatingCoupon: boolean = false;
  couponError: string = '';

  ngOnInit() {
    this.loadPlans();

    this.form.get('planId')?.valueChanges.subscribe(id => {
      this.selectedPlan = this.plans.find(p => p.id === id) || null;
      this.calculateEndDate();
    });

    this.form.get('startDate')?.valueChanges.subscribe(() => {
      this.calculateEndDate();
    });
  }

  loadPlans() {

    this.planService.getAll(false).subscribe({
      next: (res) => this.plans = res.data,
      error: () => this.snackBar.open('Error cargando planes', 'Cerrar')
    });
  }

  calculateEndDate() {
    const startDateStr = this.form.get('startDate')?.value;

    if (this.selectedPlan && startDateStr) {
      const [year, month, day] = startDateStr.split('-').map(Number);

      const start = new Date(year, month - 1, day);

      const days = this.selectedPlan.durationInDays;

      const end = new Date(start);
      end.setDate(end.getDate() + days);

      this.endDatePreview = end;
    } else {
      this.endDatePreview = null;
    }
  }

  /**
   * Aplica y valida un cupón de descuento
   */
  applyCoupon() {
    const code = this.form.get('couponCode')?.value?.trim().toUpperCase();
    const planId = this.form.get('planId')?.value;

    // Validaciones básicas
    if (!code) {
      this.couponError = 'Ingresa un código de cupón';
      return;
    }

    if (!planId || !this.selectedPlan) {
      this.couponError = 'Primero selecciona un plan';
      return;
    }

    // Obtener usuario actual
    const admin = this.storageService.getAdminFromLocalStorage();
    if (!admin?.id) {
      this.couponError = 'No se pudo identificar el usuario';
      return;
    }

    // Iniciar validación
    this.isValidatingCoupon = true;
    this.couponError = '';

    this.couponService.validate({
      code: code,
      userId: admin.id,
      appliesTo: 'ads',
      targetId: planId,
      amount: this.selectedPlan.price
    }).subscribe({
      next: (response) => {
        this.isValidatingCoupon = false;

        if (response.success && response.data.valid) {
          // Cupón válido
          this.appliedCoupon = response.data;
          this.originalPrice = this.selectedPlan!.price;
          this.discountAmount = response.data.discountAmount || 0;
          this.finalPrice = response.data.finalAmount || this.originalPrice;
          this.couponCode = code;
          
          this.snackBar.open(
            `¡Cupón aplicado! Descuento: ${this.discountAmount} BOB`,
            'Ok',
            { duration: 3000 }
          );
        } else {
          // Cupón inválido
          this.handleCouponError(response.data.reason || 'Cupón inválido');
        }
      },
      error: (err) => {
        this.isValidatingCoupon = false;
        this.handleCouponError(err.error?.message || 'Error al validar cupón');
      }
    });
  }

  /**
   * Maneja errores de validación de cupón
   */
  handleCouponError(reason: string) {
    this.appliedCoupon = null;
    this.couponError = this.getErrorMessage(reason);
    this.snackBar.open(this.couponError, 'Cerrar', { duration: 4000 });
  }

  /**
   * Traduce códigos de error a mensajes amigables
   */
  getErrorMessage(reason: string): string {
    const errorMessages: { [key: string]: string } = {
      'expired': 'Este cupón ya expiró',
      'max_uses_reached': 'Este cupón alcanzó su límite de usos',
      'user_limit_reached': 'Ya usaste este cupón el máximo de veces permitido',
      'invalid_plan': 'Este cupón no es válido para el plan seleccionado',
      'not_active': 'Este cupón no está activo',
      'not_started': 'Este cupón aún no está vigente'
    };

    return errorMessages[reason] || 'Cupón no válido';
  }

  /**
   * Remueve el cupón aplicado
   */
  removeCoupon() {
    this.appliedCoupon = null;
    this.couponCode = '';
    this.couponError = '';
    this.discountAmount = 0;
    this.finalPrice = 0;
    this.originalPrice = 0;
    this.form.patchValue({ couponCode: '' });
    this.snackBar.open('Cupón removido', 'Ok', { duration: 2000 });
  }

  /**
   * Verifica si hay un cupón aplicado
   */
  get hasCoupon(): boolean {
    return !!this.appliedCoupon;
  }

  /**
   * Obtiene el precio a mostrar (con o sin descuento)
   */
  get displayPrice(): number {
    return this.hasCoupon ? this.finalPrice : (this.selectedPlan?.price || 0);
  }


  submit() {
    if (this.form.invalid) return;
    this.isLoading = true;

    const dto: CreateSubscriptionDTO = {
      advertisementId: this.data.advertisement.id,
      planId: this.form.value.planId,
      startDate: this.form.value.startDate
    };

    // Agregar cupón si fue aplicado
    if (this.hasCoupon && this.couponCode) {
      dto.couponCode = this.couponCode;
    }

    this.adService.createSubscription(dto).subscribe({
      next: () => {
        const message = this.hasCoupon
          ? `Plan activado con descuento de ${this.discountAmount} BOB`
          : 'Plan activado exitosamente';
        
        this.snackBar.open(message, 'Ok', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(err.error?.message || 'Error al activar plan', 'Cerrar');
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  imgUrl(ad: Advertisement): string {
    return `${environment.imgUrl}${ad.imageUrl}`;
  }
}
