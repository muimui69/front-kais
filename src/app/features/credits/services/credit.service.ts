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

  /**
   * Otorgar créditos a un usuario
   */
  grantCredits(data: GrantCreditsDTO): Observable<ApiResponse<CreditTransaction>> {
    return this.http.post<ApiResponse<CreditTransaction>>(
      `${this.apiUrl}/grant`,
      data,
      { withCredentials: true }
    );
  }

  /**
   * Usar créditos (aplicar a una compra)
   */
  useCredits(data: UseCreditsDTO): Observable<ApiResponse<CreditTransaction>> {
    return this.http.post<ApiResponse<CreditTransaction>>(
      `${this.apiUrl}/use`,
      data,
      { withCredentials: true }
    );
  }

  /**
   * Reembolsar créditos
   */
  refundCredits(transactionId: number): Observable<ApiResponse<CreditTransaction>> {
    return this.http.post<ApiResponse<CreditTransaction>>(
      `${this.apiUrl}/refund/${transactionId}`,
      {},
      { withCredentials: true }
    );
  }

  /**
   * Obtener historial de transacciones de un usuario
   */
  getUserTransactions(userId: number): Observable<ApiResponse<CreditTransaction[]>> {
    return this.http.get<ApiResponse<CreditTransaction[]>>(
      `${this.apiUrl}/transactions/${userId}`,
      { withCredentials: true }
    );
  }

  /**
   * Obtener todas las transacciones con filtros
   */
  getAllTransactions(filters?: CreditTransactionFilters): Observable<ApiResponse<CreditTransaction[]>> {
    let url = `${this.apiUrl}/transactions`;

    if (filters) {
      const params = new URLSearchParams();
      if (filters.userId) params.append('userId', filters.userId.toString());
      if (filters.type) params.append('type', filters.type);
      if (filters.referenceType) params.append('referenceType', filters.referenceType);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.minAmount) params.append('minAmount', filters.minAmount.toString());
      if (filters.maxAmount) params.append('maxAmount', filters.maxAmount.toString());

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;
    }

    return this.http.get<ApiResponse<CreditTransaction[]>>(url, { withCredentials: true });
  }

  /**
   * Obtener estadísticas de créditos de un usuario
   */
  getUserStats(userId: number): Observable<ApiResponse<UserCreditStats>> {
    return this.http.get<ApiResponse<UserCreditStats>>(
      `${this.apiUrl}/stats/${userId}`,
      { withCredentials: true }
    );
  }

  /**
   * Obtener estadísticas globales del sistema
   */
  getGlobalStats(): Observable<ApiResponse<GlobalCreditStats>> {
    return this.http.get<ApiResponse<GlobalCreditStats>>(
      `${this.apiUrl}/stats`,
      { withCredentials: true }
    );
  }

  /**
   * Procesar créditos expirados
   */
  processExpiredCredits(): Observable<ApiResponse<{ expiredCount: number; totalAmount: number }>> {
    return this.http.post<ApiResponse<{ expiredCount: number; totalAmount: number }>>(
      `${this.apiUrl}/process-expired`,
      {},
      { withCredentials: true }
    );
  }
}
