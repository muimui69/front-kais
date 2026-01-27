import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { ApiResponse, AdPlan, CreateAdPlanDTO, UpdateAdPlanDTO, AdPlanStats } from '../interfaces/ad-plan';

@Injectable({
  providedIn: 'root'
})
export class AdPlanService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/ad-plans`;

  getAll(includeInactive: boolean = true): Observable<ApiResponse<AdPlan[]>> {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<ApiResponse<AdPlan[]>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<AdPlan>> {
    return this.http.get<ApiResponse<AdPlan>>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateAdPlanDTO): Observable<ApiResponse<AdPlan>> {
    return this.http.post<ApiResponse<AdPlan>>(this.apiUrl, data, { withCredentials: true });
  }

  update(id: number, data: UpdateAdPlanDTO): Observable<ApiResponse<AdPlan>> {
    return this.http.put<ApiResponse<AdPlan>>(`${this.apiUrl}/${id}`, data, { withCredentials: true });
  }

  delete(id: number): Observable<ApiResponse<{ success: boolean }>> {
    return this.http.delete<ApiResponse<{ success: boolean }>>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  toggleStatus(id: number): Observable<ApiResponse<AdPlan>> {
    return this.http.patch<ApiResponse<AdPlan>>(`${this.apiUrl}/${id}/status`, {}, { withCredentials: true });
  }

  getStats(): Observable<ApiResponse<AdPlanStats>> {
    return this.http.get<ApiResponse<AdPlanStats>>(`${this.apiUrl}/stats`);
  }

  search(term: string, includeInactive: boolean = false): Observable<ApiResponse<AdPlan[]>> {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<ApiResponse<AdPlan[]>>(`${this.apiUrl}/search/${term}`, { params });
  }
}
