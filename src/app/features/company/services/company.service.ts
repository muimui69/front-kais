import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import {
  ApiResponse,
  Company,
  CompanyStats,
  CreateCompanyDTO,
  UpdateCompanyDTO
} from '../interfaces/company.interface';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/companies`;

  getAll(includeInactive: boolean = false): Observable<ApiResponse<Company[]>> {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<ApiResponse<Company[]>>(this.apiUrl, { params });
  }


  getById(id: number): Observable<ApiResponse<Company>> {
    return this.http.get<ApiResponse<Company>>(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<ApiResponse<CompanyStats>> {
    return this.http.get<ApiResponse<CompanyStats>>(`${this.apiUrl}/stats`);
  }

  search(term: string, includeInactive: boolean = false): Observable<ApiResponse<Company[]>> {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<ApiResponse<Company[]>>(`${this.apiUrl}/search/${term}`, { params });
  }

  create(data: CreateCompanyDTO): Observable<ApiResponse<Company>> {
    return this.http.post<ApiResponse<Company>>(this.apiUrl, data, { withCredentials: true });
  }

  update(id: number, data: UpdateCompanyDTO): Observable<ApiResponse<Company>> {
    return this.http.put<ApiResponse<Company>>(`${this.apiUrl}/${id}`, data, { withCredentials: true });
  }

  delete(id: number): Observable<ApiResponse<{ success: true }>> {
    return this.http.delete<ApiResponse<{ success: true }>>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  toggleStatus(id: number): Observable<ApiResponse<Company>> {
    return this.http.patch<ApiResponse<Company>>(`${this.apiUrl}/${id}/status`, {}, { withCredentials: true });
  }
}
