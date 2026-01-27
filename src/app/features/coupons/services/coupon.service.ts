import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import {
  Coupon,
  CreateCouponDTO,
  UpdateCouponDTO,
  CouponValidation,
  CouponUsage,
  CouponStats,
  CouponFilters,
  ValidateCouponParams,
  PublicCouponInfo,
  GlobalCouponStats
} from '../interfaces/coupon.interface';

/**
 * Interface para respuestas de la API
 */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Servicio para gestión de cupones de descuento
 * 
 * Este servicio maneja todas las operaciones CRUD de cupones,
 * validaciones, estadísticas y consultas de uso.
 */
@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/coupons`;

  /**
   * Obtiene todos los cupones con filtros opcionales
   * @param filters Filtros para aplicar a la consulta
   * @returns Observable con array de cupones
   */
  getAll(filters?: CouponFilters): Observable<ApiResponse<Coupon[]>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.isActive !== undefined) {
        params = params.set('isActive', filters.isActive.toString());
      }
      if (filters.appliesTo) {
        params = params.set('appliesTo', filters.appliesTo);
      }
      if (filters.discountType) {
        params = params.set('discountType', filters.discountType);
      }
      if (filters.searchTerm) {
        params = params.set('searchTerm', filters.searchTerm);
      }
      if (filters.validNow !== undefined) {
        params = params.set('validNow', filters.validNow.toString());
      }
    }
    
    return this.http.get<ApiResponse<Coupon[]>>(this.apiUrl, { params });
  }

  /**
   * Obtiene un cupón por su ID
   * @param id ID del cupón
   * @returns Observable con el cupón
   */
  getById(id: number): Observable<ApiResponse<Coupon>> {
    return this.http.get<ApiResponse<Coupon>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene información pública de un cupón por su código
   * @param code Código del cupón
   * @returns Observable con información pública
   */
  getPublicInfo(code: string): Observable<ApiResponse<PublicCouponInfo>> {
    return this.http.get<ApiResponse<PublicCouponInfo>>(`${this.apiUrl}/public/${code}`);
  }

  /**
   * Crea un nuevo cupón
   * @param data Datos del cupón a crear
   * @returns Observable con el cupón creado
   */
  create(data: CreateCouponDTO): Observable<ApiResponse<Coupon>> {
    return this.http.post<ApiResponse<Coupon>>(
      this.apiUrl, 
      data, 
      { withCredentials: true }
    );
  }

  /**
   * Actualiza un cupón existente
   * @param id ID del cupón
   * @param data Datos a actualizar
   * @returns Observable con el cupón actualizado
   */
  update(id: number, data: UpdateCouponDTO): Observable<ApiResponse<Coupon>> {
    return this.http.put<ApiResponse<Coupon>>(
      `${this.apiUrl}/${id}`, 
      data, 
      { withCredentials: true }
    );
  }

  /**
   * Elimina un cupón
   * Solo se pueden eliminar cupones sin usos
   * @param id ID del cupón
   * @returns Observable con resultado de la operación
   */
  delete(id: number): Observable<ApiResponse<{ success: boolean }>> {
    return this.http.delete<ApiResponse<{ success: boolean }>>(
      `${this.apiUrl}/${id}`, 
      { withCredentials: true }
    );
  }

  /**
   * Desactiva un cupón permanentemente
   * @param id ID del cupón
   * @returns Observable con el cupón desactivado
   */
  deactivate(id: number): Observable<ApiResponse<Coupon>> {
    return this.http.post<ApiResponse<Coupon>>(
      `${this.apiUrl}/${id}/deactivate`, 
      {}, 
      { withCredentials: true }
    );
  }

  /**
   * Valida un cupón antes de usarlo
   * @param params Parámetros de validación
   * @returns Observable con resultado de validación
   */
  validate(params: ValidateCouponParams): Observable<ApiResponse<CouponValidation>> {
    return this.http.post<ApiResponse<CouponValidation>>(
      `${this.apiUrl}/validate`,
      params,
      { withCredentials: true }
    );
  }

  /**
   * Obtiene el historial de usos de un cupón
   * @param id ID del cupón
   * @returns Observable con array de usos
   */
  getUsages(id: number): Observable<ApiResponse<CouponUsage[]>> {
    return this.http.get<ApiResponse<CouponUsage[]>>(`${this.apiUrl}/${id}/usages`);
  }

  /**
   * Obtiene estadísticas detalladas de un cupón
   * @param id ID del cupón
   * @returns Observable con estadísticas
   */
  getStats(id: number): Observable<ApiResponse<CouponStats>> {
    return this.http.get<ApiResponse<CouponStats>>(`${this.apiUrl}/${id}/stats`);
  }

  /**
   * Obtiene estadísticas globales del sistema de cupones
   * @returns Observable con estadísticas globales
   */
  getGlobalStats(): Observable<ApiResponse<GlobalCouponStats>> {
    return this.http.get<ApiResponse<GlobalCouponStats>>(`${this.apiUrl}/global-stats`);
  }

  /**
   * Obtiene los usos de un cupón por un usuario específico
   * @param couponId ID del cupón
   * @param userId ID del usuario
   * @returns Observable con array de usos del usuario
   */
  getUserUsages(couponId: number, userId: number): Observable<ApiResponse<CouponUsage[]>> {
    return this.http.get<ApiResponse<CouponUsage[]>>(
      `${this.apiUrl}/${couponId}/my-usage?userId=${userId}`
    );
  }

  /**
   * Busca cupones por término
   * @param term Término de búsqueda
   * @returns Observable con cupones encontrados
   */
  search(term: string): Observable<ApiResponse<Coupon[]>> {
    return this.http.get<ApiResponse<Coupon[]>>(`${this.apiUrl}/search?term=${term}`);
  }

  /**
   * Verifica si un cupón está disponible (activo y no expirado)
   * @param code Código del cupón
   * @returns Observable con disponibilidad
   */
  checkAvailability(code: string): Observable<ApiResponse<{
    available: boolean;
    reason?: string;
  }>> {
    return this.http.get<ApiResponse<{ available: boolean; reason?: string }>>(
      `${this.apiUrl}/check-availability/${code}`
    );
  }
}
