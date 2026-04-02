import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environment/environment';
import { ApiResponse, PaginatedApiResponse } from '../../roles/interfaces/role.interface';
import {
  Administrator,
  AdminListParams,
  CreateAdminDTO,
  UpdateAdminDTO,
  ChangePasswordDTO,
  AdminSearchUserResult
} from '../interfaces/administrator.interface';

@Injectable({ providedIn: 'root' })
export class AdministratorService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/administrators`;
  private readonly httpOptions = { withCredentials: true } as const;

  getAll(params: AdminListParams = {}): Observable<PaginatedApiResponse<Administrator[]>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return this.http.get<PaginatedApiResponse<Administrator[]>>(this.apiUrl, {
      params: httpParams,
      ...this.httpOptions,
    });
  }

  getById(id: number): Observable<ApiResponse<Administrator>> {
    return this.http.get<ApiResponse<Administrator>>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  create(dto: CreateAdminDTO): Observable<ApiResponse<Administrator>> {
    return this.http.post<ApiResponse<Administrator>>(this.apiUrl, dto, this.httpOptions);
  }

  update(id: number, dto: UpdateAdminDTO): Observable<ApiResponse<Administrator>> {
    return this.http.put<ApiResponse<Administrator>>(`${this.apiUrl}/${id}`, dto, this.httpOptions);
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  changeState(id: number): Observable<ApiResponse<Administrator>> {
    return this.http.patch<ApiResponse<Administrator>>(`${this.apiUrl}/${id}/state`, {}, this.httpOptions);
  }

  changePassword(id: number, dto: ChangePasswordDTO): Observable<ApiResponse<{ success: boolean }>> {
    return this.http.patch<ApiResponse<{ success: boolean }>>(`${this.apiUrl}/${id}/password`, dto, this.httpOptions);
  }

  searchUser(term: string): Observable<ApiResponse<AdminSearchUserResult[]>> {
    return this.http.post<ApiResponse<AdminSearchUserResult[]>>(`${this.apiUrl}/search-user`, { term }, this.httpOptions);
  }
}
