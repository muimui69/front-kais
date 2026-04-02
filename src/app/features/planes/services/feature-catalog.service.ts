import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environment/environment';
import { cleanHttpParams } from '../../../core/utils/http-params.util';
import { ApiResponse } from '../interfaces/plan.interface';
import { Feature, CreateFeatureDTO, UpdateFeatureDTO } from '../interfaces/feature-catalog.interface';

@Injectable({ providedIn: 'root' })
export class FeatureCatalogService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/admin/features`;
  private readonly httpOptions = { withCredentials: true } as const;

  getAll(isActive?: boolean): Observable<ApiResponse<Feature[]>> {
    const params = isActive !== undefined ? cleanHttpParams({ isActive: String(isActive) }) : {};
    return this.http.get<ApiResponse<Feature[]>>(this.apiUrl, { params, ...this.httpOptions });
  }

  create(dto: CreateFeatureDTO): Observable<ApiResponse<Feature>> {
    return this.http.post<ApiResponse<Feature>>(this.apiUrl, dto, this.httpOptions);
  }

  update(id: number, dto: UpdateFeatureDTO): Observable<ApiResponse<Feature>> {
    return this.http.put<ApiResponse<Feature>>(`${this.apiUrl}/${id}`, dto, this.httpOptions);
  }

  toggleStatus(id: number): Observable<ApiResponse<Feature>> {
    return this.http.patch<ApiResponse<Feature>>(`${this.apiUrl}/${id}/status`, null, this.httpOptions);
  }
}
