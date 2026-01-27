import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import {
  ReferralProgram,
  ReferralCode,
  Referral,
  GlobalReferralStats,
  LeaderboardEntry,
  UpdateProgramDTO,
  MarkCompletedDTO,
  ProfessionalReferralStats,
  PublicReferralInfo,
  ApiResponse,
  ProgramHistoryResponse,
  HistoryFilters,
  Coupon,
  CouponListResponse
} from '../interfaces/referral.interface';

/**
 * Servicio para gestión de referidos
 * 
 * Este servicio maneja todas las operaciones relacionadas con el sistema de referidos
 * según la API documentada en /docs/REFERIDOS_ADMIN.md
 * 
 * Base URL: ${environment.baseUrl}/referrals
 */
@Injectable({
  providedIn: 'root'
})
export class ReferralService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/referrals`;

  // ==========================================
  // CONFIGURACIÓN DEL PROGRAMA
  // ==========================================

  /**
   * Obtiene la configuración actual del programa de referidos
   * 
   * Endpoint: GET /api/referrals/program
   * Requiere: Autenticación de admin
   * 
   * @returns Observable con la configuración del programa
   */
  getProgram(): Observable<ApiResponse<ReferralProgram>> {
    return this.http.get<ApiResponse<ReferralProgram>>(
      `${this.apiUrl}/program`,
      { withCredentials: true }
    );
  }

  /**
   * Actualiza la configuración del programa de referidos
   * 
   * Endpoint: PUT /api/referrals/program
   * Requiere: Autenticación de admin
   * 
   * Campos editables:
   * - isActive (activar/desactivar programa)
   * - referrerRewardType (credit/coupon/both/none)
   * - referrerCouponCode (código de cupón si type es coupon o both)
   * - referrerCreditAmount (monto en BOB si type es credit o both)
   * - referredRewardType (credit/coupon/both/none)
   * - referredCouponCode (código de cupón si type es coupon o both)
   * - referredCreditAmount (monto en BOB si type es credit o both)
   * 
   * @param data Datos de configuración a actualizar
   * @returns Observable con la configuración actualizada
   */
  updateProgram(data: UpdateProgramDTO): Observable<ApiResponse<ReferralProgram>> {
    return this.http.put<ApiResponse<ReferralProgram>>(
      `${this.apiUrl}/program`,
      data,
      { withCredentials: true }
    );
  }

  /**
   * Obtiene la lista de cupones disponibles
   * 
   * Endpoint: GET /api/coupons
   * Requiere: Autenticación de admin
   * 
   * @param filters Filtros opcionales (isActive, search)
   * @returns Observable con lista de cupones
   */
  getCoupons(filters?: {
    isActive?: boolean;
    search?: string;
  }): Observable<ApiResponse<CouponListResponse>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.isActive !== undefined) {
        params = params.set('isActive', filters.isActive.toString());
      }
      if (filters.search) {
        params = params.set('search', filters.search);
      }
    }
    
    return this.http.get<ApiResponse<CouponListResponse>>(
      `${environment.baseUrl}/coupons`,
      { params, withCredentials: true }
    );
  }

  /**
   * Obtiene el historial de cambios de la configuración
   * 
   * Endpoint: GET /api/referrals/program/history
   * Requiere: Autenticación de admin
   * 
   * NOTA: Este endpoint devuelve una estructura diferente al resto:
   * { success, data: [...], pagination: {...} }
   * En lugar de: { success, data: { history: [...], pagination: {...} } }
   * 
   * @param filters Filtros de búsqueda (página, límite, tipo, fechas)
   * @returns Observable con historial de cambios y paginación
   */
  getProgramHistory(filters?: HistoryFilters): Observable<ProgramHistoryResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.changeType) params = params.set('changeType', filters.changeType);
      if (filters.adminId) params = params.set('adminId', filters.adminId.toString());
      if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params = params.set('dateTo', filters.dateTo);
    }

    return this.http.get<ProgramHistoryResponse>(
      `${this.apiUrl}/program/history`,
      { params, withCredentials: true }
    );
  }

  // ==========================================
  // CÓDIGOS DE REFERIDO
  // ==========================================

  /**
   * Obtiene todos los códigos de referido generados en el sistema
   * 
   * Endpoint: GET /api/referrals/codes
   * Requiere: Autenticación de admin
   * 
   * @returns Observable con array de códigos
   */
  getAllReferralCodes(): Observable<ApiResponse<ReferralCode[]>> {
    return this.http.get<ApiResponse<ReferralCode[]>>(
      `${this.apiUrl}/codes`,
      { withCredentials: true }
    );
  }

  /**
   * Obtiene información pública de un código de referido
   * 
   * Endpoint: GET /api/referrals/code/:code
   * No requiere autenticación
   * 
   * @param code Código de referido
   * @returns Observable con información pública
   */
  getPublicInfo(code: string): Observable<ApiResponse<PublicReferralInfo>> {
    return this.http.get<ApiResponse<PublicReferralInfo>>(
      `${this.apiUrl}/code/${code}`
    );
  }

  // ==========================================
  // ESTADÍSTICAS
  // ==========================================

  /**
   * Obtiene estadísticas globales del sistema de referidos
   * 
   * Endpoint: GET /api/referrals/stats
   * Requiere: Autenticación de admin
   * 
   * Incluye:
   * - Total de referidos, completados, recompensas
   * - Top referidores
   * - Referidos recientes
   * - Timeline de conversiones
   * 
   * @returns Observable con estadísticas globales
   */
  getGlobalStats(): Observable<ApiResponse<GlobalReferralStats>> {
    return this.http.get<ApiResponse<GlobalReferralStats>>(
      `${this.apiUrl}/stats`,
      { withCredentials: true }
    );
  }

  /**
   * Obtiene estadísticas de un profesional específico
   * 
   * Endpoint: GET /api/referrals/my-stats
   * Requiere: Autenticación del profesional
   * 
   * Nota: Este endpoint devuelve las estadísticas del usuario autenticado.
   * Para obtener estadísticas de otro profesional, el backend debe implementar
   * el endpoint GET /api/referrals/professional/:id
   * 
   * @returns Observable con estadísticas del profesional
   */
  getMyStats(): Observable<ApiResponse<ProfessionalReferralStats>> {
    return this.http.get<ApiResponse<ProfessionalReferralStats>>(
      `${this.apiUrl}/my-stats`,
      { withCredentials: true }
    );
  }

  // ==========================================
  // LEADERBOARD
  // ==========================================

  /**
   * Obtiene el leaderboard (ranking) de top referidores
   * 
   * Endpoint: GET /api/referrals/leaderboard
   * Requiere: Autenticación de admin
   * 
   * @param limit Número de registros a retornar (default: 20)
   * @param period Período de tiempo ('all-time' | 'this-month' | 'this-week')
   * @returns Observable con array de top referidores
   */
  getLeaderboard(
    limit: number = 20,
    period: 'all-time' | 'this-month' | 'this-week' = 'all-time'
  ): Observable<ApiResponse<LeaderboardEntry[]>> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('period', period);
    
    return this.http.get<ApiResponse<LeaderboardEntry[]>>(
      `${this.apiUrl}/leaderboard`,
      { params, withCredentials: true }
    );
  }

  // ==========================================
  // OPERACIONES DE REFERIDOS
  // ==========================================

  /**
   * Marca un referido como completado manualmente
   * 
   * Endpoint: POST /api/referrals/mark-completed
   * Requiere: Autenticación de admin
   * 
   * @param data Datos del referido a completar (referralId, purchaseId, purchaseAmount)
   * @returns Observable con el referido actualizado
   */
  markCompleted(data: MarkCompletedDTO): Observable<ApiResponse<Referral>> {
    return this.http.post<ApiResponse<Referral>>(
      `${this.apiUrl}/mark-completed`,
      data,
      { withCredentials: true }
    );
  }
}
