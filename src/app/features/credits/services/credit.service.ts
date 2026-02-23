import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreditTransaction,
  CreditBalance,
  GrantCreditsDTO,
  UseCreditsDTO,
  UserCreditStats,
  GlobalCreditStats,
  CreditTransactionFilters,
  ApiResponse
} from '../interfaces/credit.interface';
import {
  CreditStats,
  UserCreditInfo,
  UserCreditStatsDetailed,
  TransactionListResponse,
  GrantCreditResponse,
  BulkGrantResponse,
  RefundResponse,
  UpcomingExpirationsResponse,
  ExpireCreditsResponse,
  GrantCreditForm,
  BulkGrantCreditForm,
  RefundCreditForm
} from '../interfaces/credit-stats.interface';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/credits`;

  /**
   * Obtener balance de créditos de un usuario
   */
  getBalance(userId: number): Observable<ApiResponse<CreditBalance>> {
    return this.http.get<ApiResponse<CreditBalance>>(
      `${this.apiUrl}/balance/${userId}`,
      { withCredentials: true }
    );
  }

  /**
   * Obtener balance de créditos de múltiples usuarios
   */
  getMultipleBalances(userIds: number[]): Observable<ApiResponse<CreditBalance[]>> {
    return this.http.post<ApiResponse<CreditBalance[]>>(
      `${this.apiUrl}/balances`,
      { userIds },
      { withCredentials: true }
    );
  }


  grantCredits(data: GrantCreditsDTO): Observable<ApiResponse<CreditTransaction>> {
    return this.http.post<ApiResponse<CreditTransaction>>(
      `${this.apiUrl}/grant`,
      data,
      { withCredentials: true }
    );
  }


  useCredits(data: UseCreditsDTO): Observable<ApiResponse<CreditTransaction>> {
    return this.http.post<ApiResponse<CreditTransaction>>(
      `${this.apiUrl}/use`,
      data,
      { withCredentials: true }
    );
  }


  refundCredits(transactionId: number): Observable<ApiResponse<CreditTransaction>> {
    return this.http.post<ApiResponse<CreditTransaction>>(
      `${this.apiUrl}/refund/${transactionId}`,
      {},
      { withCredentials: true }
    );
  }


  getUserTransactions(userId: number): Observable<ApiResponse<CreditTransaction[]>> {
    return this.http.get<ApiResponse<CreditTransaction[]>>(
      `${this.apiUrl}/transactions/${userId}`,
      { withCredentials: true }
    );
  }

  getAllTransactions(filters?: CreditTransactionFilters): Observable<ApiResponse<CreditTransaction[]>> {
    let url = `${this.apiUrl}/transactions`;

    if (filters) {
      const params = new URLSearchParams();
      if (filters.userId) params.append('userId', filters.userId.toString());
      if (filters.type) params.append('type', filters.type);
      if (filters.source) params.append('source', filters.source);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.minAmount) params.append('minAmount', filters.minAmount.toString());
      if (filters.maxAmount) params.append('maxAmount', filters.maxAmount.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
    }

    return this.http.get<ApiResponse<CreditTransaction[]>>(url, { withCredentials: true });
  }

  getUserStats(userId: number): Observable<ApiResponse<UserCreditStats>> {
    return this.http.get<ApiResponse<UserCreditStats>>(
      `${this.apiUrl}/stats/${userId}`,
      { withCredentials: true }
    );
  }


  getGlobalStats(): Observable<ApiResponse<GlobalCreditStats>> {
    return this.http.get<ApiResponse<GlobalCreditStats>>(
      `${this.apiUrl}/stats`,
      { withCredentials: true }
    );
  }


  processExpiredCredits(): Observable<ApiResponse<{ expiredCount: number; totalAmount: number }>> {
    return this.http.post<ApiResponse<{ expiredCount: number; totalAmount: number }>>(
      `${this.apiUrl}/process-expired`,
      {},
      { withCredentials: true }
    );
  }

  // ========== MÉTODOS PARA PANEL DE ADMINISTRACIÓN ==========

  /**
   * Obtener estadísticas globales del dashboard
   */
  getCreditStats(): Observable<ApiResponse<CreditStats>> {
    return this.http.get<ApiResponse<CreditStats>>(
      `${this.apiUrl}/stats`,
      { withCredentials: true }
    );
  }

  /**
   * Obtener información completa de créditos de un usuario
   */
  getUserCreditInfo(userId: string): Observable<ApiResponse<UserCreditInfo>> {
    return this.http.get<ApiResponse<UserCreditInfo>>(
      `${this.apiUrl}/users/${userId}`,
      { withCredentials: true }
    );
  }

  /**
   * Obtener transacciones paginadas de un usuario
   */
  getUserTransactionsPaginated(
    userId: string,
    page: number = 1,
    limit: number = 20,
    filters?: Partial<CreditTransactionFilters>
  ): Observable<ApiResponse<TransactionListResponse>> {
    let url = `${this.apiUrl}/users/${userId}/transactions?page=${page}&limit=${limit}`;

    if (filters) {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.source) params.append('source', filters.source);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const queryString = params.toString();
      if (queryString) url += `&${queryString}`;
    }

    return this.http.get<ApiResponse<TransactionListResponse>>(url, { withCredentials: true });
  }

  /**
   * Obtener estadísticas detalladas de un usuario
   */
  getUserCreditStatsDetailed(userId: string): Observable<ApiResponse<UserCreditStatsDetailed>> {
    return this.http.get<ApiResponse<UserCreditStatsDetailed>>(
      `${this.apiUrl}/users/${userId}/stats`,
      { withCredentials: true }
    );
  }

  /**
   * Otorgar créditos a un usuario (formulario individual)
   */
  grantCreditsForm(data: GrantCreditForm): Observable<ApiResponse<GrantCreditResponse>> {
    return this.http.post<ApiResponse<GrantCreditResponse>>(
      `${this.apiUrl}/grant`,
      data,
      { withCredentials: true }
    );
  }

  /**
   * Otorgar créditos masivamente
   */
  bulkGrantCredits(data: BulkGrantCreditForm): Observable<ApiResponse<BulkGrantResponse>> {
    return this.http.post<ApiResponse<BulkGrantResponse>>(
      `${this.apiUrl}/bulk-grant`,
      data,
      { withCredentials: true }
    );
  }

  /**
   * Reembolsar créditos
   */
  refundCreditsForm(data: RefundCreditForm): Observable<ApiResponse<RefundResponse>> {
    return this.http.post<ApiResponse<RefundResponse>>(
      `${this.apiUrl}/refund`,
      data,
      { withCredentials: true }
    );
  }

  /**
   * Obtener créditos próximos a vencer
   */
  getUpcomingExpirations(days: number = 30): Observable<ApiResponse<UpcomingExpirationsResponse>> {
    return this.http.get<ApiResponse<UpcomingExpirationsResponse>>(
      `${this.apiUrl}/upcoming-expirations?days=${days}`,
      { withCredentials: true }
    );
  }

  /**
   * Ejecutar expiración de créditos manualmente
   */
  expireCreditsNow(): Observable<ApiResponse<ExpireCreditsResponse>> {
    return this.http.post<ApiResponse<ExpireCreditsResponse>>(
      `${this.apiUrl}/expire`,
      {},
      { withCredentials: true }
    );
  }

  /**
   * Obtener todas las transacciones paginadas (auditoría global)
   */
  getAllTransactionsPaginated(
    page: number = 1,
    limit: number = 50,
    filters?: CreditTransactionFilters
  ): Observable<ApiResponse<TransactionListResponse>> {
    let url = `${this.apiUrl}/transactions?page=${page}&limit=${limit}`;

    if (filters) {
      const params = new URLSearchParams();
      if (filters.userId) params.append('userId', filters.userId.toString());
      if (filters.type) params.append('type', filters.type);
      if (filters.source) params.append('source', filters.source);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.minAmount) params.append('minAmount', filters.minAmount.toString());
      if (filters.maxAmount) params.append('maxAmount', filters.maxAmount.toString());

      const queryString = params.toString();
      if (queryString) url += `&${queryString}`;
    }

    return this.http.get<ApiResponse<TransactionListResponse>>(url, { withCredentials: true });
  }
}
