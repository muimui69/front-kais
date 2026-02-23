import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import {
  ApiResponse,
  Advertisement,
  CreateAdvertisementDTO,
  AdSubscription,
  CreateSubscriptionDTO,
  PaginatedApiResponse
} from '../interfaces/advertising.interface';

@Injectable({
  providedIn: 'root'
})
export class AdvertisingService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseUrl}`;
  createAd(formData: FormData): Observable<ApiResponse<Advertisement>> {
      return this.http.post<ApiResponse<Advertisement>>(
      `${this.baseUrl}/ads`,
      formData,
      { withCredentials: true }
    );
  }

  updateAd(id: number, formData: FormData): Observable<ApiResponse<Advertisement>> {
    return this.http.put<ApiResponse<Advertisement>>(
      `${this.baseUrl}/ads/${id}`,
      formData,
      { withCredentials: true }
    );
  }

  getAllAds(params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    companyId?: number;
  }): Observable<PaginatedApiResponse<Advertisement[]>> {
    let httpParams = new HttpParams();
    
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params?.isActive !== undefined) {
      httpParams = httpParams.set('isActive', params.isActive.toString());
    }
    if (params?.companyId) {
      httpParams = httpParams.set('companyId', params.companyId.toString());
    }

    return this.http.get<PaginatedApiResponse<Advertisement[]>>(
      `${this.baseUrl}/ads`,
      { params: httpParams }
    );
  }

  getById(id: number): Observable<ApiResponse<Advertisement>> {
    return this.http.get<ApiResponse<Advertisement>>(`${this.baseUrl}/ads/${id}`);
  }
  getAdsByCompany(companyId: number): Observable<ApiResponse<Advertisement[]>> {
    return this.http.get<ApiResponse<Advertisement[]>>(`${this.baseUrl}/ads/company/${companyId}`);
  }
  deleteAd(id: number): Observable<ApiResponse<{ success: boolean }>> {
    return this.http.delete<ApiResponse<{ success: boolean }>>(`${this.baseUrl}/ads/${id}`, { withCredentials: true });
  }
  createSubscription(data: CreateSubscriptionDTO): Observable<ApiResponse<AdSubscription>> {
    return this.http.post<ApiResponse<AdSubscription>>(`${this.baseUrl}/ads/subscriptions`, data, { withCredentials: true });
  }
  getAllSubscriptions(): Observable<ApiResponse<AdSubscription[]>> {
    return this.http.get<ApiResponse<AdSubscription[]>>(`${this.baseUrl}/ads/subscriptions`, { withCredentials: true });
  }
}
