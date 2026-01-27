/**
 * Interfaces para el sistema de referidos
 * 
 * Este archivo contiene todas las interfaces TypeScript necesarias para el sistema de referidos,
 * ALINEADAS 100% CON EL BACKEND según documentación oficial.
 * 
 * Documentación: /docs/REFERIDOS_ADMIN.md
 */

/**
 * Tipo de recompensa del sistema de referidos
 */
export type ReferralRewardType = 'credit' | 'coupon' | 'both' | 'none';

/**
 * Programa de Referidos (Configuración global)
 * Endpoint: GET/PUT /api/referrals/program
 * 
 * ESTRUCTURA REAL DEL BACKEND (sincronizada 100%)
 */
export interface ReferralProgram {
  id?: number;
  isActive: boolean;
  
  // Referidor (quien invita)
  referrerRewardType: ReferralRewardType;
  referrerCouponCode: string | null;
  referrerCouponName: string | null;
  referrerCreditAmount: number | null;
  
  // Referido (invitado)
  referredRewardType: ReferralRewardType;
  referredCouponCode: string | null;
  referredCouponName: string | null;
  referredCreditAmount: number | null;
  
  createdAt?: string;
  updatedAt: string;
}

/**
 * DTO para actualizar configuración del programa
 * Solo incluye campos editables por API (sincronizado con backend)
 */
export interface UpdateProgramDTO {
  isActive?: boolean;
  referrerRewardType?: ReferralRewardType;
  referrerCouponCode?: string | null;
  referrerCreditAmount?: number | null;
  referredRewardType?: ReferralRewardType;
  referredCouponCode?: string | null;
  referredCreditAmount?: number | null;
}

/**
 * Código de Referido generado por un profesional
 * Endpoint: GET /api/referrals/codes
 */
export interface ReferralCode {
  id: number;
  code: string;
  professionalId: number;
  professionalName?: string;
  professionalEmail?: string;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Relación de Referido (usuario invitado por código)
 */
export interface Referral {
  id: number;
  referralCodeId: number;
  referralCode?: ReferralCode;
  referrerId: number;
  referrerName?: string;
  referrerEmail?: string;
  referredId: number;
  referredName?: string;
  referredEmail?: string;
  status: 'pending' | 'completed' | 'expired';
  completedAt?: string | null;
  firstPurchaseId?: number | null;
  firstPurchaseAmount?: number | null;
  referrerRewardType?: 'credits' | 'discount' | null;
  referrerRewardAmount?: number | null;
  referrerRewardGranted: boolean;
  referredRewardType?: 'credits' | 'discount' | null;
  referredRewardAmount?: number | null;
  referredRewardGranted: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Estadísticas de un profesional específico
 * Endpoint: GET /api/referrals/my-stats (requiere autenticación del profesional)
 */
export interface ProfessionalReferralStats {
  professionalId: number;
  professionalName?: string;
  code: string;
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  expiredReferrals: number;
  totalRewardsEarned: number;
  conversionRate: number;
  referrals: Array<{
    id: number;
    referredName: string;
    referredEmail?: string;
    status: 'pending' | 'completed' | 'expired';
    createdAt: string;
    completedAt?: string;
    rewardAmount?: number;
  }>;
}

/**
 * Estadísticas globales del sistema de referidos
 * Endpoint: GET /api/referrals/stats
 */
export interface GlobalReferralStats {
  totalReferrals: number;
  totalCompletedReferrals: number;
  totalRewardsGiven: number;
  currency: string;
  averageConversionRate: number;
  averageTimeToConvert: number;
  topReferrers: Array<{
    professionalId: number;
    professionalName: string;
    referralCode: string;
    totalReferrals: number;
    successfulReferrals: number;
    conversionRate: number;
    totalEarnings: number;
    rank: number;
  }>;
  recentReferrals: any[]; // ReferralResponseDTO[]
  referralTimeline: Array<{
    date: string;
    referrals: number;
    completed: number;
    rewardsGiven: number;
  }>;
}

/**
 * Item del Leaderboard (Ranking de referidores)
 * Endpoint: GET /api/referrals/leaderboard
 */
export interface LeaderboardEntry {
  rank: number;
  professionalId: number;
  professionalName: string;
  professionalAvatar: string | null;
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  isCurrentUser: boolean;
}

export interface LeaderboardResponse {
  period: 'all-time' | 'this-month' | 'this-week';
  topReferrers: LeaderboardEntry[];
  currentUserRank: number | null;
  currentUserStats: {
    totalReferrals: number;
    totalEarnings: number;
  } | null;
}

/**
 * Historial de Cambios de Configuración
 * Endpoint: GET /api/referrals/program/history
 */
export interface ProgramHistoryEntry {
  id: number;
  changeType: 'create' | 'update' | 'activate' | 'deactivate';
  changedBy: string;  // Nombre del administrador que realizó el cambio
  changedByAdminId: number | null;
  oldValues: Record<string, any>;
  newValues: Record<string, any>;
  ipAddress: string;
  notes: string | null;
  changedAt: string;
}

/**
 * Respuesta del endpoint de historial
 * GET /api/referrals/program/history
 * 
 * Estructura real del backend:
 * {
 *   "success": true,
 *   "data": [ {...}, {...} ],  // Array de ProgramHistoryEntry directamente
 *   "pagination": { total, page, limit, totalPages }
 * }
 * 
 * NOTA: A diferencia de otros endpoints, aquí "data" contiene el array directamente,
 * y "pagination" está al mismo nivel que "data" (no dentro de data)
 */
export interface ProgramHistoryResponse {
  success: boolean;
  data: ProgramHistoryEntry[];  // Array de historial directamente
  pagination: {
    total: number;       // Total de registros
    page: number;        // Página actual
    limit: number;       // Registros por página
    totalPages: number;  // Total de páginas
  };
}

/**
 * Filtros para consultar historial de cambios
 */
export interface HistoryFilters {
  page?: number;
  limit?: number;
  changeType?: 'create' | 'update' | 'activate' | 'deactivate';
  adminId?: number;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * DTO para marcar un referido como completado manualmente
 * Endpoint: POST /api/referrals/mark-completed
 */
export interface MarkCompletedDTO {
  referralId: number;
  purchaseId: number;
  purchaseAmount: number;
}

/**
 * Filtros para consultar referidos
 */
export interface ReferralFilters {
  status?: 'pending' | 'completed' | 'expired' | 'all';
  professionalId?: number;
  referredId?: number;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

/**
 * Respuesta de API genérica
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Información pública de un código de referido
 * Endpoint: GET /api/referrals/code/:code
 */
export interface PublicReferralInfo {
  code: string;
  professionalName: string;
  isActive: boolean;
  program?: {
    referredRewardType: 'credits' | 'discount';
    referredRewardAmount: number;
  };
}

/**
 * Cupón del sistema
 * Usado para seleccionar cupones en la configuración de referidos
 */
export interface Coupon {
  id: number;
  code: string;
  name: string;
  discountType: 'percentage' | 'fixed_amount';
  discountValue: number;
  isActive: boolean;
  description?: string | null;
  appliesTo?: string;
  validUntil?: Date | null;
}

/**
 * Respuesta del endpoint GET /api/coupons
 */
export interface CouponListResponse {
  total: number;
  active: number;
  inactive: number;
  expired: number;
  coupons: Coupon[];
}
