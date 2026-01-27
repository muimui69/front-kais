import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ReferralService } from '../../services/referral.service';
import { ReferralProgram, UpdateProgramDTO, ReferralRewardType, Coupon } from '../../interfaces/referral.interface';

@Component({
  selector: 'app-referral-config',
  standalone: false,
  templateUrl: './referral-config.component.html',
  styleUrl: './referral-config.component.css'
})
export class ReferralConfigComponent implements OnInit {
  private fb = inject(FormBuilder);
  private referralService = inject(ReferralService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  // Estado de carga
  loading = signal(true);
  saving = signal(false);
  loadingCoupons = signal(false);

  // Programa actual
  currentProgram = signal<ReferralProgram | null>(null);

  // Cupones disponibles
  availableCoupons = signal<Coupon[]>([]);

  // Estados de los paneles expandibles
  panelStates = {
    programa: true,
    referidor: true,
    referido: true,
    avanzado: false
  };

  // Formulario
  configForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadCoupons();
    this.loadProgram();
  }

  /**
   * Inicializa el formulario con validaciones dinámicas según el backend
   */
  private initForm(): void {
    this.configForm = this.fb.group({
      // Estado del programa
      isActive: [true],
      
      // Referidor (quien invita)
      referrerRewardType: ['credit', Validators.required],
      referrerCouponCode: [null],
      referrerCreditAmount: [50, [Validators.min(0)]],
      
      // Referido (invitado)
      referredRewardType: ['coupon', Validators.required],
      referredCouponCode: [null],
      referredCreditAmount: [null, [Validators.min(0)]]
    });
    
    // Suscribirse a cambios de rewardType para validaciones dinámicas
    this.configForm.get('referrerRewardType')?.valueChanges.subscribe(type => {
      this.updateReferrerValidations(type);
    });
    
    this.configForm.get('referredRewardType')?.valueChanges.subscribe(type => {
      this.updateReferredValidations(type);
    });
  }

  /**
   * Actualiza validaciones del referidor según tipo seleccionado
   */
  private updateReferrerValidations(type: ReferralRewardType): void {
    const creditControl = this.configForm.get('referrerCreditAmount');
    const couponControl = this.configForm.get('referrerCouponCode');
    
    if (type === 'credit') {
      creditControl?.setValidators([Validators.required, Validators.min(0)]);
      couponControl?.clearValidators();
      couponControl?.setValue(null);
    } else if (type === 'coupon') {
      creditControl?.clearValidators();
      creditControl?.setValue(null);
      couponControl?.setValidators([Validators.required]);
    } else if (type === 'both') {
      creditControl?.setValidators([Validators.required, Validators.min(0)]);
      couponControl?.setValidators([Validators.required]);
    } else if (type === 'none') {
      creditControl?.clearValidators();
      couponControl?.clearValidators();
      creditControl?.setValue(null);
      couponControl?.setValue(null);
    }
    
    creditControl?.updateValueAndValidity();
    couponControl?.updateValueAndValidity();
  }

  /**
   * Actualiza validaciones del referido según tipo seleccionado
   */
  private updateReferredValidations(type: ReferralRewardType): void {
    const creditControl = this.configForm.get('referredCreditAmount');
    const couponControl = this.configForm.get('referredCouponCode');
    
    if (type === 'credit') {
      creditControl?.setValidators([Validators.required, Validators.min(0)]);
      couponControl?.clearValidators();
      couponControl?.setValue(null);
    } else if (type === 'coupon') {
      creditControl?.clearValidators();
      creditControl?.setValue(null);
      couponControl?.setValidators([Validators.required]);
    } else if (type === 'both') {
      creditControl?.setValidators([Validators.required, Validators.min(0)]);
      couponControl?.setValidators([Validators.required]);
    } else if (type === 'none') {
      creditControl?.clearValidators();
      couponControl?.clearValidators();
      creditControl?.setValue(null);
      couponControl?.setValue(null);
    }
    
    creditControl?.updateValueAndValidity();
    couponControl?.updateValueAndValidity();
  }

  /**
   * Carga lista de cupones disponibles
   */
  private loadCoupons(): void {
    this.loadingCoupons.set(true);
    
    this.referralService.getCoupons({ isActive: true }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.availableCoupons.set(response.data.coupons);
        }
        this.loadingCoupons.set(false);
      },
      error: (error) => {
        console.error('Error loading coupons:', error);
        this.snackBar.open('Error al cargar cupones', 'Cerrar', { duration: 3000 });
        this.loadingCoupons.set(false);
      }
    });
  }

  /**
   * Carga la configuración actual del programa desde el backend
   */
  private loadProgram(): void {
    this.loading.set(true);

    this.referralService.getProgram().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.currentProgram.set(response.data);
          this.patchFormValues(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading program:', error);
        this.snackBar.open(
          'Error al cargar configuración del programa',
          'Cerrar',
          { duration: 5000 }
        );
        this.loading.set(false);
      }
    });
  }

  /**
   * Rellena el formulario con los datos cargados
   */
  private patchFormValues(program: ReferralProgram): void {
    this.configForm.patchValue({
      isActive: program.isActive,
      referrerRewardType: program.referrerRewardType,
      referrerCouponCode: program.referrerCouponCode,
      referrerCreditAmount: program.referrerCreditAmount,
      referredRewardType: program.referredRewardType,
      referredCouponCode: program.referredCouponCode,
      referredCreditAmount: program.referredCreditAmount
    }, { emitEvent: false }); // No emitir eventos para evitar triggers de validación
    
    // Aplicar validaciones según tipos cargados
    this.updateReferrerValidations(program.referrerRewardType);
    this.updateReferredValidations(program.referredRewardType);
  }

  /**
   * Guarda la configuración
   */
  onSave(): void {
    if (this.configForm.invalid) {
      this.snackBar.open(
        'Por favor, completa todos los campos correctamente',
        'Cerrar',
        { duration: 3000 }
      );
      this.configForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const formValue = this.configForm.value;
    const updateData: UpdateProgramDTO = {
      isActive: formValue.isActive,
      referrerRewardType: formValue.referrerRewardType,
      referrerCouponCode: formValue.referrerCouponCode,
      referrerCreditAmount: formValue.referrerCreditAmount,
      referredRewardType: formValue.referredRewardType,
      referredCouponCode: formValue.referredCouponCode,
      referredCreditAmount: formValue.referredCreditAmount
    };

    this.referralService.updateProgram(updateData).subscribe({
      next: (response) => {
        if (response.success) {
          this.currentProgram.set(response.data);
          this.snackBar.open(
            '✅ Configuración guardada exitosamente',
            'Ok',
            { duration: 3000 }
          );
        }
        this.saving.set(false);
      },
      error: (error) => {
        console.error('Error saving program:', error);
        this.snackBar.open(
          error.error?.message || 'Error al guardar configuración',
          'Cerrar',
          { duration: 5000 }
        );
        this.saving.set(false);
      }
    });
  }

  /**
   * Cancela la edición y vuelve al dashboard
   */
  onCancel(): void {
    this.router.navigate(['/referrals']);
  }

  /**
   * Resetea el formulario a los valores originales
   */
  onReset(): void {
    if (this.currentProgram()) {
      this.patchFormValues(this.currentProgram()!);
      this.snackBar.open('Formulario reseteado', 'Ok', { duration: 2000 });
    }
  }

  /**
   * Navega al historial de cambios
   */
  goToHistory(): void {
    this.router.navigate(['/referrals/history']);
  }

  /**
   * Verifica si debe mostrar campo de crédito del referidor
   */
  shouldShowReferrerCredit(): boolean {
    const type = this.configForm.get('referrerRewardType')?.value;
    return type === 'credit' || type === 'both';
  }

  /**
   * Verifica si debe mostrar campo de cupón del referidor
   */
  shouldShowReferrerCoupon(): boolean {
    const type = this.configForm.get('referrerRewardType')?.value;
    return type === 'coupon' || type === 'both';
  }

  /**
   * Verifica si debe mostrar campo de crédito del referido
   */
  shouldShowReferredCredit(): boolean {
    const type = this.configForm.get('referredRewardType')?.value;
    return type === 'credit' || type === 'both';
  }

  /**
   * Verifica si debe mostrar campo de cupón del referido
   */
  shouldShowReferredCoupon(): boolean {
    const type = this.configForm.get('referredRewardType')?.value;
    return type === 'coupon' || type === 'both';
  }

  /**
   * Formatea nombre del cupón para el selector
   */
  formatCouponOption(coupon: Coupon): string {
    if (coupon.discountType === 'percentage') {
      return `${coupon.code} - ${coupon.name} (${coupon.discountValue}% desc)`;
    } else {
      return `${coupon.code} - ${coupon.name} (Bs ${coupon.discountValue})`;
    }
  }

  /**
   * Formatea tipo de recompensa para mostrar
   */
  formatRewardType(type: ReferralRewardType): string {
    const types: Record<ReferralRewardType, string> = {
      'credit': 'Crédito',
      'coupon': 'Cupón',
      'both': 'Crédito + Cupón',
      'none': 'Sin recompensa'
    };
    return types[type] || type;
  }

  /**
   * Formatea recompensa para el resumen
   */
  formatRewardSummary(
    type: ReferralRewardType, 
    creditAmount: number | null, 
    couponCode: string | null
  ): string {
    if (type === 'credit' && creditAmount) {
      return `Bs ${creditAmount.toLocaleString('es-BO')}`;
    } else if (type === 'coupon' && couponCode) {
      const coupon = this.availableCoupons().find(c => c.code === couponCode);
      return coupon ? coupon.name : couponCode;
    } else if (type === 'both' && creditAmount && couponCode) {
      const coupon = this.availableCoupons().find(c => c.code === couponCode);
      return `Bs ${creditAmount.toLocaleString('es-BO')} + ${coupon?.name || couponCode}`;
    } else if (type === 'none') {
      return 'Sin recompensa';
    }
    return '-';
  }

  /**
   * Obtiene el error de un campo del formulario
   */
  getFieldError(fieldName: string): string {
    const field = this.configForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (field.errors['required']) return 'Este campo es requerido';
    if (field.errors['min']) return `El valor mínimo es ${field.errors['min'].min}`;
    if (field.errors['max']) return `El valor máximo es ${field.errors['max'].max}`;

    return '';
  }

  /**
   * Verifica si un campo tiene error
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.configForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
