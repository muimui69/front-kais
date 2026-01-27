/**
 * Interfaces para el sistema de cupones de descuento
 * 
 * Este archivo contiene todas las interfaces TypeScript necesarias para el sistema de cupones,
 * incluyendo DTOs para crear/actualizar cupones, validaciones, estadísticas y usos.
 */

/**
 * Interface principal del cupón
 */
export interface Coupon {
  id: number;
  code: string;
  name: string;
  description: string | null;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  maxDiscountPercent?: number | null;
  maxDiscountAmount?: number | null;
  appliesTo: 'plans' | 'extras' | 'ads' | 'all';
  specificPlanIds?: number[] | null;
  specificExtraIds?: number[] | null;
  specificAdPlanIds?: number[] | null;
  validFrom: string | null;
  validUntil: string | null;
  maxTotalUses?: number | null;
  maxUsesPerUser?: number | null;
  minPurchaseAmount?: number | null;
  currency: string;
  restrictedToUserIds?: number[] | null;
  isStackable: boolean;
  isActive: boolean;
  isReferralCoupon: boolean;
  referralType?: string | null;
  timesUsed: number;
  totalDiscountGiven: number;
  usesRemaining?: number | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO para crear un nuevo cupón
 */
export interface CreateCouponDTO {
  code?: string;
  name: string;
  description?: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  maxDiscountPercent?: number;
  maxDiscountAmount?: number;
  appliesTo: 'plans' | 'extras' | 'ads' | 'all';
  specificPlanIds?: number[];
  specificExtraIds?: number[];
  specificAdPlanIds?: number[];
  validFrom?: string;
  validUntil?: string;
  maxTotalUses?: number;
  maxUsesPerUser?: number;
  minPurchaseAmount?: number;
  currency?: string;
  restrictedToUserIds?: number[];
  isStackable?: boolean;
  isActive?: boolean;
  isReferralCoupon?: boolean;
  referralType?: 'generic' | 'personal' | null;
}

/**
 * DTO para actualizar un cupón existente
 */
export interface UpdateCouponDTO {
  name?: string;
  description?: string;
  isActive?: boolean;
  validUntil?: string;
  maxTotalUses?: number;
  maxUsesPerUser?: number;
}

/**
 * Resultado de la validación de un cupón
 */
export interface CouponValidation {
  valid: boolean;
  coupon?: Coupon;
  discountAmount?: number;
  finalAmount?: number;
  reason?: string;
}

/**
 * Registro de uso de un cupón
 */
export interface CouponUsage {
  id: number;
  couponId: number;
  userId: number;
  usedAt: string;
  discountAmount: number;
  originalAmount: number;
  finalAmount: number;
  userName?: string;
  userEmail?: string;
  targetType?: string;
  targetId?: number;
  targetName?: string;
}

/**
 * Estadísticas detalladas de un cupón
 */
export interface CouponStats {
  couponId: number;
  code: string;
  totalUses: number;
  uniqueUsers: number;
  totalDiscount: number;
  averageDiscount: number;
  conversionRate: number;
  usageByType: {
    subscription?: number;
    extra?: number;
    ad_subscription?: number;
  };
  topUsers: Array<{
    userId: number;
    userName: string;
    uses: number;
    totalDiscount: number;
  }>;
}

/**
 * Filtros para consultar cupones
 */
export interface CouponFilters {
  isActive?: boolean;
  appliesTo?: 'plans' | 'extras' | 'ads' | 'all';
  discountType?: 'percentage' | 'fixed_amount';
  searchTerm?: string;
  validNow?: boolean;
}

/**
 * Parámetros para validar un cupón antes de usarlo
 */
export interface ValidateCouponParams {
  code: string;
  userId: number;
  appliesTo: 'plans' | 'extras' | 'ads';
  targetId: number;
  amount: number;
}

/**
 * Información pública de un cupón (sin datos sensibles)
 */
export interface PublicCouponInfo {
  code: string;
  name: string;
  description: string | null;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  appliesTo: 'plans' | 'extras' | 'ads' | 'all';
  minPurchaseAmount?: number | null;
  validUntil: string | null;
  isActive: boolean;
}

/**
 * Estadísticas globales del sistema de cupones
 */
export interface GlobalCouponStats {
  totalCoupons: number;
  activeCoupons: number;
  inactiveCoupons: number;
  expiredCoupons: number;
  totalUsages: number;
  totalDiscountGranted: number;
  averageDiscountPerCoupon: number;
  mostUsedCoupons: Array<{
    code: string;
    uses: number;
    totalDiscount: number;
  }>;
}
