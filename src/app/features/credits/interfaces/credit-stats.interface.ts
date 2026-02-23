/**
 * Interfaces para estadísticas y operaciones del panel de administración de créditos
 */

/**
 * Datos de tendencia mensual
 */
export interface MonthlyTrend {
  month: string; // 'YYYY-MM'
  earned: number;
  used: number;
}

/**
 * Transacción con información del usuario (para tablas globales)
 */
export interface TransactionSummary {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  type: 'earned' | 'used' | 'expired' | 'refunded';
  amount: number;
  source: 'referral' | 'admin' | 'promotion' | 'refund';
  description: string;
  balanceAfter: number;
  expiresAt?: string;
  createdAt: string;
}

/**
 * Estadísticas globales del dashboard
 */
export interface CreditStats {
  totalActiveCredits: number;
  totalUsersWithCredits: number;
  creditsGrantedThisMonth: number;
  creditsUsedThisMonth: number;
  creditsExpiringIn30Days: number;
  averageBalancePerUser: number;
  bySource: {
    referral: number;
    admin: number;
    promotion: number;
    refund: number;
  };
  monthlyTrend: MonthlyTrend[];
  recentTransactions: TransactionSummary[];
}

/**
 * Información completa de créditos de un usuario
 */
export interface UserCreditInfo {
  userId: string;
  userName: string;
  userEmail: string;
  balance: number;
  totalEarned: number;
  totalUsed: number;
  totalExpired: number;
  creditsToExpire: {
    amount: number;
    expirationDate: string;
  } | null;
  firstTransactionDate: string;
  lastTransactionDate: string;
}

/**
 * Actividad mensual del usuario
 */
export interface MonthlyActivity {
  month: string;
  earned: number;
  used: number;
}

/**
 * Estadísticas detalladas de un usuario para el panel admin
 */
export interface UserCreditStatsDetailed {
  totalEarned: number;
  totalUsed: number;
  totalExpired: number;
  currentBalance: number;
  bySource: {
    referral: number;
    admin: number;
    promotion: number;
    refund: number;
  };
  byType: {
    earned: number;
    used: number;
    expired: number;
  };
  monthlyActivity: MonthlyActivity[];
}

/**
 * Lista paginada de transacciones
 */
export interface TransactionListResponse {
  transactions: TransactionSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Detalle de crédito próximo a vencer
 */
export interface ExpirationDetail {
  userId: string;
  userName: string;
  userEmail: string;
  currentBalance: number;
  amountToExpire: number;
  expirationDate: string;
  daysRemaining: number;
  transactionId: string;
}

/**
 * Respuesta de créditos próximos a vencer
 */
export interface UpcomingExpirationsResponse {
  summary: {
    totalCreditsExpiring: number;
    totalUsersAffected: number;
    expiringIn7Days: number;
    expiringIn30Days: number;
  };
  expirations: ExpirationDetail[];
  lastCronRun: string;
}

/**
 * Respuesta al otorgar créditos
 */
export interface GrantCreditResponse {
  success: boolean;
  message: string;
  transaction: TransactionSummary;
  newBalance: number;
}

/**
 * Detalle de resultado de otorgamiento masivo
 */
export interface BulkGrantDetail {
  userId: string;
  success: boolean;
  transaction?: TransactionSummary;
  error?: string;
}

/**
 * Respuesta de otorgamiento masivo
 */
export interface BulkGrantResponse {
  success: boolean;
  message: string;
  results: {
    successful: number;
    failed: number;
    totalAmount: number;
  };
  details: BulkGrantDetail[];
}

/**
 * Respuesta de reembolso
 */
export interface RefundResponse {
  success: boolean;
  message: string;
  refundTransaction: TransactionSummary;
  newBalance: number;
}

/**
 * Detalle de expiración ejecutada
 */
export interface ExpireDetail {
  userId: string;
  amountExpired: number;
  transactionId: string;
}

/**
 * Respuesta de expiración de créditos
 */
export interface ExpireCreditsResponse {
  success: boolean;
  message: string;
  result: {
    totalExpired: number;
    usersAffected: number;
    transactionsCreated: number;
  };
  details: ExpireDetail[];
}

/**
 * Formulario para otorgar créditos individual
 */
export interface GrantCreditForm {
  userId: string;
  amount: number;
  source: 'admin' | 'promotion' | 'refund' | 'referral';
  description: string;
  expiresAt?: string; // ISO date string
}

/**
 * Formulario para otorgar créditos masivo
 */
export interface BulkGrantCreditForm {
  userIds: string[];
  amount: number;
  source: 'admin' | 'promotion' | 'refund' | 'referral';
  description: string;
  expiresAt?: string;
}

/**
 * Formulario para reembolso
 */
export interface RefundCreditForm {
  userId: string;
  originalTransactionId: string;
  reason: string;
}

/**
 * Criterios de búsqueda de usuario
 */
export interface UserSearchCriteria {
  query: string; // email, nombre, o ID
}
