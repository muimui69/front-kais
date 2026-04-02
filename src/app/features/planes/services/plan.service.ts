import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environment/environment';
import { cleanHttpParams } from '../../../core/utils/http-params.util';
import { PaginationParams } from '../../../core/interface/pagination.interface';

import {
  ApiResponse,
  PaginatedApiResponse,
  Plan,
  PlanInterval,
  PlanIntervalFeature,
  PlanStats,
  CreatePlanDTO,
  UpdatePlanDTO,
  CreateIntervalDTO,
  UpdateIntervalDTO,
  AddFeatureToIntervalDTO,
  PlanListQuery,
} from '../interfaces/plan.interface';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/admin/plans`;
  private readonly httpOptions = { withCredentials: true } as const;

  // ── Plans ──────────────────────────────────────────────

  getAll(query: PlanListQuery, pagination: PaginationParams): Observable<PaginatedApiResponse<Plan[]>> {
    return this.http.get<PaginatedApiResponse<Plan[]>>(
      this.apiUrl,
      { params: cleanHttpParams({ ...query, ...pagination }), ...this.httpOptions },
    );
  }

  getById(id: number): Observable<ApiResponse<Plan>> {
    return this.http.get<ApiResponse<Plan>>(
      `${this.apiUrl}/${id}`,
      this.httpOptions,
    );
  }

  getStats(): Observable<ApiResponse<PlanStats>> {
    return this.http.get<ApiResponse<PlanStats>>(
      `${this.apiUrl}/stats`,
      this.httpOptions,
    );
  }

  create(dto: CreatePlanDTO): Observable<ApiResponse<Plan>> {
    return this.http.post<ApiResponse<Plan>>(this.apiUrl, dto, this.httpOptions);
  }

  update(id: number, dto: UpdatePlanDTO): Observable<ApiResponse<Plan>> {
    return this.http.put<ApiResponse<Plan>>(`${this.apiUrl}/${id}`, dto, this.httpOptions);
  }

  toggleStatus(id: number): Observable<ApiResponse<Plan>> {
    return this.http.patch<ApiResponse<Plan>>(`${this.apiUrl}/${id}/status`, null, this.httpOptions);
  }

  // ── Intervals ─────────────────────────────────────────

  createInterval(planId: number, dto: CreateIntervalDTO): Observable<ApiResponse<PlanInterval>> {
    return this.http.post<ApiResponse<PlanInterval>>(
      `${this.apiUrl}/${planId}/intervals`,
      dto,
      this.httpOptions,
    );
  }

  getInterval(intervalId: number): Observable<ApiResponse<PlanInterval>> {
    return this.http.get<ApiResponse<PlanInterval>>(
      `${this.apiUrl}/intervals/${intervalId}`,
      this.httpOptions,
    );
  }

  updateInterval(intervalId: number, dto: UpdateIntervalDTO): Observable<ApiResponse<PlanInterval>> {
    return this.http.put<ApiResponse<PlanInterval>>(
      `${this.apiUrl}/intervals/${intervalId}`,
      dto,
      this.httpOptions,
    );
  }

  deleteInterval(intervalId: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}/intervals/${intervalId}`,
      this.httpOptions,
    );
  }

  // ── Interval Features ─────────────────────────────────

  addFeatureToInterval(intervalId: number, dto: AddFeatureToIntervalDTO): Observable<ApiResponse<PlanIntervalFeature>> {
    return this.http.post<ApiResponse<PlanIntervalFeature>>(
      `${this.apiUrl}/intervals/${intervalId}/features`,
      dto,
      this.httpOptions,
    );
  }

  /** id = PlanIntervalFeature.id (el vínculo), NO el featureId del catálogo */
  removeFeatureFromInterval(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.apiUrl}/intervals/features/${id}`,
      this.httpOptions,
    );
  }
}
