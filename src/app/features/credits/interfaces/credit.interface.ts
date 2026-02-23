/**
 * Interfaces para el sistema de créditos
 * 
 * Este archivo contiene todas las interfaces TypeScript necesarias para el sistema de créditos,
 * incluyendo transacciones, balances y estadísticas.
 */

/**
 * Transacción de crédito
 */
export interface CreditTransaction {
  id: number;
  userId: number;
  amount: number;
  type: 'earned' | 'used' | 'expired' | 'refunded';
  description?: string;
  source: 'referral' | 'admin' | 'promotion' | 'refund';
  referenceId?: number;
  balanceBefore: number;
  balanceAfter: number;
  grantedBy?: number;
  expiresAt?: string;
  createdAt: string;
  userName?: string;
  userEmail?: string;
  grantedByName?: string;
  relatedTransactionId?: number; // Para refunds
}

/**
 * Balance de créditos de un usuario
 */
export interface CreditBalance {
  userId: number;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  totalExpired: number;
  lastUpdated: string;
  userName?: string;
  userEmail?: string;
}

/**
 * DTO para otorgar créditos
 */
export interface GrantCreditsDTO {
  userId: number;
  amount: number;
  source: 'referral' | 'admin' | 'promotion' | 'refund';
  description: string;
  expiresAt?: string;
}

/**
 * DTO para usar créditos
 */
export interface UseCreditsDTO {
  userId: number;
  amount: number;
  source: 'referral' | 'admin' | 'promotion' | 'refund';
  referenceId: number;
}

/**
 * Estadísticas de créditos de un usuario
 */
export interface UserCreditStats {
  userId: number;
  currentBalance: number;
  totalEarned: number;
  totalSpent: number;
  totalExpired: number;
  totalRefunded: number;
  transactionCount: number;
  lastTransaction?: string;
  sources: {
    admin: number;
    referral: number;
    promotion: number;
    refund: number;
  };
  usage: {
    subscription: number;
    extra: number;
    ad_subscription: number;
  };
}

/**
 * Estadísticas globales del sistema de créditos
 */
export interface GlobalCreditStats {
  totalCreditsGranted: number;
  totalCreditsUsed: number;
  totalCreditsExpired: number;
  totalCreditsRefunded: number;
  activeBalance: number;
  usersWithCredits: number;
  averageBalance: number;
  topUsers: Array<{
    userId: number;
    userName: string;
    balance: number;
    totalEarned: number;
  }>;
  transactionsByType: {
    earned: number;
    used: number;
    refunded: number;
    expired: number;
  };
  creditsGrantedByMonth: Array<{
    month: string;
    amount: number;
  }>;
}

/**
 * Filtros para consultar transacciones de créditos
 */
export interface CreditTransactionFilters {
  userId?: number;
  type?: 'earned' | 'used' | 'expired' | 'refunded';
  source?: 'referral' | 'admin' | 'promotion' | 'refund';
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
}

/**
 * Respuesta de API genérica
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
