import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { environment } from '../../../../../environment/environment';
import { AdPlan } from '../../../ad-plan/interfaces/ad-plan';
import { AdPlanService } from '../../../ad-plan/services/ad-plan.service';
import { Advertisement, CreateSubscriptionDTO } from '../../../advertising/interfaces/advertising.interface';
import { AdvertisingService } from '../../../advertising/services/advertising.service';
import { Company } from '../../../company/interfaces/company.interface';
import { CompanyService } from '../../../company/services/company.service';
import { CouponService } from '../../../coupons/services/coupon.service';
import { CouponValidation } from '../../../coupons/interfaces/coupon.interface';
import { StorageService } from '../../../user-management/services/storage.service';

export interface CreateAdSubscriptionDTO {
  advertisementId: number;
  planId: number;
  startDate: Date;
}
@Component({
  selector: 'app-ad-subscription-create',
  standalone: false,
  templateUrl: './ad-subscription-create.component.html',
  styleUrl: './ad-subscription-create.component.css'
})


export class AdSubscriptionCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private companyService = inject(CompanyService);
  private planService = inject(AdPlanService);
  private adService = inject(AdvertisingService);
  private couponService = inject(CouponService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  adType: 'EXISTING' | 'NEW' = 'EXISTING';
  step1Company = this.fb.group({ companyId: [null as number | null, Validators.required] });

  step2Ad = this.fb.group({
    adType: ['EXISTING', Validators.required],
    existingAdId: [null as number | null],
    newAdFile: [null as File | null],
    newActionType: ['WEB_URL'],
    newActionValue: ['']
  });

  step3Plan = this.fb.group({
    planId: [null as number | null, Validators.required],
    startDate: [new Date().toISOString().slice(0, 10), Validators.required],
    couponCode: ['']
  });

  companies: Company[] = [];
  companyAds: Advertisement[] = [];
  plans: AdPlan[] = [];
  isLoading = false;
  selectedPlan: AdPlan | null = null;
  endDatePreview: Date | null = null;
  newAdPreview: string | ArrayBuffer | null = null;

  // Estado del cupón
  couponCode: string = '';
  appliedCoupon: CouponValidation | null = null;
  originalPrice: number = 0;
  discountAmount: number = 0;
  finalPrice: number = 0;
  isValidatingCoupon: boolean = false;
  couponError: string = '';

  ngOnInit() {
    this.loadInitialData();

    this.step1Company.get('companyId')?.valueChanges.subscribe(id => {
        if(id) this.loadCompanyAds(id);
    });

    this.step3Plan.get('planId')?.valueChanges.subscribe(id => {
      this.selectedPlan = this.plans.find(p => p.id === id) || null;
      this.calculateEndDate();
    });
    this.step3Plan.get('startDate')?.valueChanges.subscribe(() => this.calculateEndDate());
  }

  loadInitialData() {
    this.companyService.getAll(false).subscribe(res => this.companies = res.data);
    this.planService.getAll(false).subscribe(res => this.plans = res.data);
  }

  setAdType(type: 'EXISTING' | 'NEW') {
  this.adType = type;
  this.step2Ad.get('adType')?.setValue(type);

  // Opcional: Resetear validaciones cruzadas si es necesario
}
  loadCompanyAds(companyId: number) {
    this.companyAds = [];
    this.step2Ad.patchValue({ existingAdId: null });
    this.adService.getAdsByCompany(companyId).subscribe(res => this.companyAds = res.data);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.step2Ad.patchValue({ newAdFile: file });
      const reader = new FileReader();
      reader.onload = () => this.newAdPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  calculateEndDate() {
    const dateStr = this.step3Plan.get('startDate')?.value;
    if (this.selectedPlan && dateStr) {
      const [y, m, d] = dateStr.split('-').map(Number);
      const start = new Date(y, m - 1, d);
      const end = new Date(start);
      end.setDate(end.getDate() + this.selectedPlan.durationInDays);
      this.endDatePreview = end;
    }
  }

  /**
   * Aplica y valida un cupón de descuento
   */
  applyCoupon() {
    const code = this.step3Plan.get('couponCode')?.value?.trim().toUpperCase();
    const planId = this.step3Plan.get('planId')?.value;

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
    this.step3Plan.patchValue({ couponCode: '' });
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


  async submit() {
    this.isLoading = true;
    try {
      let finalAdId: number;

      if (this.step2Ad.get('adType')?.value === 'NEW') {
        const file = this.step2Ad.get('newAdFile')?.value;
        if (!file) throw new Error('Falta la imagen');

        const formData = new FormData();

        const companyId = this.step1Company.get('companyId')?.value;
        const actionType = this.step2Ad.get('newActionType')?.value;
        const actionValue = this.step2Ad.get('newActionValue')?.value;

        formData.append('companyId', String(companyId || ''));
        formData.append('actionType', String(actionType || ''));
        formData.append('actionValue', String(actionValue || ''));
        formData.append('image', file); // file ya es tipo File/Blob

        const res: any = await new Promise((resolve, reject) => {
            this.adService.createAd(formData).subscribe({ next: resolve, error: reject });
        });
        finalAdId = res.data.id;
      } else {
        const existingId = this.step2Ad.get('existingAdId')?.value;
        if (!existingId) throw new Error('Selecciona un anuncio');
        finalAdId = Number(existingId);
      }

      const planId = this.step3Plan.get('planId')?.value;
      const startDate = this.step3Plan.get('startDate')?.value;


      if(!planId || !startDate) throw new Error('Datos del plan incompletos');

      const subDto: CreateSubscriptionDTO = {
        advertisementId: finalAdId,
        planId: Number(planId),
        startDate: new Date(startDate).toISOString()
      };

      // Agregar cupón si fue aplicado
      if (this.hasCoupon && this.couponCode) {
        subDto.couponCode = this.couponCode;
      }


      this.adService.createSubscription(subDto).subscribe({
        next: () => {
          const message = this.hasCoupon
            ? `¡Venta registrada con descuento de ${this.discountAmount} BOB!`
            : '¡Venta registrada exitosamente!';
          
          this.snackBar.open(message, 'Ok', { duration: 3000 });
          this.router.navigate(['/ad-subscriptions']);
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open('Error al crear suscripción', 'Cerrar');
        }
      });

    } catch (error: any) {
      this.isLoading = false;
      this.snackBar.open(error.message || 'Ocurrió un error', 'Cerrar');
    }
  }
  selectExistingAd(adId: number) {
  this.step2Ad.patchValue({ existingAdId: adId });
}
  imgUrl(path: string): string {
    return path?.startsWith('http') ? path : `${environment.imgUrl}${path}`;
  }

  getSelectedCompanyName(): string {
  const id = this.step1Company.get('companyId')?.value;
  const company = this.companies.find(c => c.id === id);
  return company ? company.businessName : '';
}
}
