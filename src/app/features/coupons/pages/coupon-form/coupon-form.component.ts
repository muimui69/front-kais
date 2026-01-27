import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { CouponService } from '../../services/coupon.service';
import { AdPlanService } from '../../../ad-plan/services/ad-plan.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-coupon-form',
  standalone: false,
  templateUrl: './coupon-form.component.html',
  styleUrl: './coupon-form.component.css'
})
export class CouponFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private couponService = inject(CouponService);
  private adPlanService = inject(AdPlanService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  // Form
  form: FormGroup = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.minLength(10)]],
    discountType: ['percentage', [Validators.required]],
    discountValue: [10, [Validators.required, Validators.min(0.01)]],
    appliesTo: ['plans', [Validators.required]],
    specificPlanIds: [[]],
    maxDiscountAmount: [null],
    minPurchaseAmount: [null, [Validators.min(0)]],
    maxTotalUses: [null, [Validators.min(1)]],
    maxUsesPerUser: [null, [Validators.min(1)]],
    validFrom: ['', [Validators.required]],
    validUntil: ['', [Validators.required]]
  });

  // Estado
  isEditMode = false;
  couponId: number | null = null;
  isLoading = signal(false);
  isSaving = signal(false);
  pageTitle = signal('Crear Cupón');
  currentAppliesTo = signal<string>('plans'); // Signal para trackear el valor actual de appliesTo

  // Datos para selects
  availableAdPlans = signal<any[]>([]);
  availableSubscriptionPlans = signal<any[]>([]);
  
  // Computed para obtener los planes según appliesTo
  availablePlans = computed(() => {
    const appliesTo = this.currentAppliesTo();
    
    if (appliesTo === 'ads') {
      return this.availableAdPlans();
    } else if (appliesTo === 'plans') {
      return this.availableSubscriptionPlans();
    }
    
    return [];
  });

  // Computed para saber si debe mostrar el selector de planes
  shouldShowPlanSelector = computed(() => {
    const appliesTo = this.currentAppliesTo();
    return appliesTo === 'ads' || appliesTo === 'plans';
  });

  ngOnInit() {
    // Inicializar fechas por defecto
    this.form.patchValue({
      validFrom: this.formatDateForInput(new Date()),
      validUntil: this.formatDateForInput(this.getDefaultEndDate())
    });

    this.loadPlans();
    
    // Verificar si es edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.couponId = +params['id'];
        this.isEditMode = true;
        this.pageTitle.set('Editar Cupón');
        this.loadCoupon(this.couponId);
      }
    });

    // Listeners de cambios en el formulario
    this.setupFormListeners();
  }

  /**
   * Carga los planes disponibles para el selector
   */
  loadPlans() {
    // Cargar planes de publicidad
    this.adPlanService.getAll(false).subscribe({
      next: (res) => {
        if (res.success) {
          this.availableAdPlans.set(res.data);
        }
      },
      error: (err) => {
        console.error('Error loading ad plans:', err);
      }
    });

    // Cargar planes de suscripción
    this.http.get<any>('http://localhost:3000/api/plans').subscribe({
      next: (res) => {
        if (res.success) {
          this.availableSubscriptionPlans.set(res.data);
        }
      },
      error: (err) => {
        console.error('Error loading subscription plans:', err);
      }
    });
  }

  /**
   * Carga un cupón para edición
   */
  loadCoupon(id: number) {
    this.isLoading.set(true);
    
    this.couponService.getById(id).subscribe({
      next: (res) => {
        if (res.success) {
          const coupon = res.data;
          
          // Convertir fechas a formato YYYY-MM-DD para inputs HTML5
          const validFrom = coupon.validFrom ? this.formatDateForInput(new Date(coupon.validFrom)) : this.formatDateForInput(new Date());
          const validUntil = coupon.validUntil ? this.formatDateForInput(new Date(coupon.validUntil)) : this.formatDateForInput(this.getDefaultEndDate());
          
          this.form.patchValue({
            ...coupon,
            validFrom,
            validUntil
          });
          
          // Actualizar el signal de appliesTo
          this.currentAppliesTo.set(coupon.appliesTo || 'plans');
          
          // Deshabilitar el código en modo edición
          this.form.get('code')?.disable();
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading coupon:', err);
        this.snackBar.open('Error al cargar cupón', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/coupons']);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Configura listeners para cambios en el formulario
   */
  setupFormListeners() {
    // Validar discount value según el tipo
    this.form.get('discountType')?.valueChanges.subscribe(type => {
      const valueControl = this.form.get('discountValue');
      
      if (type === 'percentage') {
        valueControl?.setValidators([Validators.required, Validators.min(0.01), Validators.max(100)]);
      } else {
        valueControl?.setValidators([Validators.required, Validators.min(0.01)]);
      }
      
      valueControl?.updateValueAndValidity();
    });

    // Si cambia appliesTo, limpiar los IDs específicos y actualizar signal
    this.form.get('appliesTo')?.valueChanges.subscribe((value) => {
      this.currentAppliesTo.set(value);
      this.form.patchValue({ specificPlanIds: [] });
    });
  }

  /**
   * Genera un código aleatorio
   */
  generateCode() {
    const prefix = 'CUPON';
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.form.patchValue({ code: `${prefix}${random}` });
  }

  /**
   * Obtiene la fecha por defecto para el final (30 días desde hoy)
   */
  private getDefaultEndDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
  }

  /**
   * Formatea una fecha para inputs HTML5 de tipo date (YYYY-MM-DD)
   */
  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Guarda el cupón (crear o actualizar)
   */
  save() {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      this.snackBar.open('Por favor completa todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isSaving.set(true);

    // Preparar datos
    const formValue = this.form.getRawValue(); // getRawValue incluye campos deshabilitados
    
    // Debug: Verificar los IDs seleccionados
    console.log('🎯 Valores del formulario:', {
      appliesTo: formValue.appliesTo,
      specificPlanIds: formValue.specificPlanIds,
      tipo: typeof formValue.specificPlanIds,
      esArray: Array.isArray(formValue.specificPlanIds),
      cantidad: formValue.specificPlanIds?.length
    });
    
    // Convertir fechas a ISO string
    const data = {
      code: formValue.code,
      name: formValue.name,
      description: formValue.description || undefined,
      discountType: formValue.discountType,
      discountValue: formValue.discountValue,
      appliesTo: formValue.appliesTo,
      specificPlanIds: formValue.specificPlanIds?.length > 0 ? formValue.specificPlanIds : undefined,
      maxDiscountAmount: formValue.maxDiscountAmount || undefined,
      minPurchaseAmount: formValue.minPurchaseAmount || undefined,
      maxTotalUses: formValue.maxTotalUses || undefined,
      maxUsesPerUser: formValue.maxUsesPerUser || undefined,
      validFrom: formValue.validFrom ? new Date(formValue.validFrom).toISOString() : undefined,
      validUntil: formValue.validUntil ? new Date(formValue.validUntil).toISOString() : undefined
    };

    console.log('📦 Datos a enviar:', data);

    const request = this.isEditMode && this.couponId
      ? this.couponService.update(this.couponId, data)
      : this.couponService.create(data);

    request.subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open(
            this.isEditMode ? 'Cupón actualizado exitosamente' : 'Cupón creado exitosamente',
            'Ok',
            { duration: 3000 }
          );
          this.router.navigate(['/coupons']);
        }
      },
      error: (err) => {
        console.error('Error saving coupon:', err);
        this.snackBar.open(
          err.error?.message || 'Error al guardar cupón',
          'Cerrar',
          { duration: 3000 }
        );
        this.isSaving.set(false);
      }
    });
  }

  /**
   * Cancela y vuelve al listado
   */
  cancel() {
    this.router.navigate(['/coupons']);
  }

  /**
   * Marca todos los campos del formulario como tocados para mostrar errores
   */
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Verifica si el cupón tiene límite de usos
   */
  get hasMaxUses(): boolean {
    return this.form.get('maxTotalUses')?.value !== null && this.form.get('maxTotalUses')?.value !== '';
  }

  /**
   * Verifica si el cupón tiene límite por usuario
   */
  get hasMaxUsesPerUser(): boolean {
    return this.form.get('maxUsesPerUser')?.value !== null && this.form.get('maxUsesPerUser')?.value !== '';
  }

  /**
   * Verifica si el cupón tiene descuento máximo
   */
  get hasMaxDiscount(): boolean {
    return this.form.get('maxDiscountAmount')?.value !== null && this.form.get('maxDiscountAmount')?.value !== '';
  }

  /**
   * Verifica si el cupón tiene monto mínimo
   */
  get hasMinPurchase(): boolean {
    return this.form.get('minPurchaseAmount')?.value !== null && this.form.get('minPurchaseAmount')?.value !== '';
  }

  /**
   * Obtiene el símbolo del descuento según el tipo
   */
  get discountSymbol(): string {
    return this.form.get('discountType')?.value === 'percentage' ? '%' : 'BOB';
  }

  /**
   * Verifica si un plan está seleccionado
   */
  isPlanSelected(planId: number): boolean {
    const selectedIds = this.form.get('specificPlanIds')?.value || [];
    return selectedIds.includes(planId);
  }

  /**
   * Alterna la selección de un plan (checkbox)
   */
  togglePlanSelection(planId: number): void {
    const control = this.form.get('specificPlanIds');
    const currentValue = control?.value || [];
    
    if (this.isPlanSelected(planId)) {
      // Remover del array
      control?.setValue(currentValue.filter((id: number) => id !== planId));
    } else {
      // Agregar al array
      control?.setValue([...currentValue, planId]);
    }
  }

  /**
   * Obtiene la cantidad de planes seleccionados
   */
  getSelectedPlansCount(): number {
    return this.form.get('specificPlanIds')?.value?.length || 0;
  }
}
