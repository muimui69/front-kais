import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environment/environment';
import {
  ApiResponse,
  AssignPermissionsDTO,
  CreateRoleDTO,
  PaginatedApiResponse,
  Role,
  RolePaginated,
  RolePermissionsData,
  UpdateRoleDTO,
} from '../interfaces/role.interface';

export interface RoleListParams {
  name?: string;
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/roles`;
  private readonly httpOptions = { withCredentials: true } as const;

  getAll(params: RoleListParams = {}): Observable<PaginatedApiResponse<Role[]>> {
    let httpParams = new HttpParams();
    if (params.name) httpParams = httpParams.set('name', params.name);
    if (params.page) httpParams = httpParams.set('page', String(params.page));
    if (params.limit) httpParams = httpParams.set('limit', String(params.limit));

    return this.http.get<PaginatedApiResponse<Role[]>>(this.apiUrl, {
      params: httpParams,
      ...this.httpOptions,
    });
  }

  getById(id: number): Observable<ApiResponse<Role>> {
    return this.http.get<ApiResponse<Role>>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  create(dto: CreateRoleDTO): Observable<ApiResponse<Role>> {
    return this.http.post<ApiResponse<Role>>(this.apiUrl, dto, this.httpOptions);
  }

  update(id: number, dto: UpdateRoleDTO): Observable<ApiResponse<Role>> {
    return this.http.put<ApiResponse<Role>>(`${this.apiUrl}/${id}`, dto, this.httpOptions);
  }

  delete(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  getPermissions(id: number): Observable<ApiResponse<RolePermissionsData>> {
    return this.http.get<ApiResponse<RolePermissionsData>>(
      `${this.apiUrl}/${id}/permissions`,
      this.httpOptions
    );
  }

  assignPermissions(id: number, dto: AssignPermissionsDTO): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/${id}/permissions`,
      dto,
      this.httpOptions
    );
  }
}
