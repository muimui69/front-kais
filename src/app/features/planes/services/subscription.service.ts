import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environment/environment';
import { cleanHttpParams } from '../../../core/utils/http-params.util';
import { PaginationParams } from '../../../core/interface/pagination.interface';
import { ApiResponse, PaginatedApiResponse } from '../interfaces/plan.interface';
import {
  Subscription,
  SubscriptionDetail,
  GrantSubscriptionDTO,
  CancelSubscriptionDTO,
  SubscriptionListQuery,
} from '../interfaces/subscription.interface';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/admin/subscriptions`;
  private readonly httpOptions = { withCredentials: true } as const;

  getAll(query: SubscriptionListQuery, pagination: PaginationParams): Observable<PaginatedApiResponse<Subscription[]>> {
    return this.http.get<PaginatedApiResponse<Subscription[]>>(
      this.apiUrl,
      { params: cleanHttpParams({ ...query, ...pagination }), ...this.httpOptions },
    );
  }

  getById(id: number): Observable<ApiResponse<SubscriptionDetail>> {
    return this.http.get<ApiResponse<SubscriptionDetail>>(
      `${this.apiUrl}/${id}`,
      this.httpOptions,
    );
  }

  getByUser(userId: number): Observable<ApiResponse<Subscription[]>> {
    return this.http.get<ApiResponse<Subscription[]>>(
      `${this.apiUrl}/user/${userId}`,
      this.httpOptions,
    );
  }

  grant(dto: GrantSubscriptionDTO): Observable<ApiResponse<Subscription>> {
    return this.http.post<ApiResponse<Subscription>>(
      `${this.apiUrl}/grant`,
      dto,
      this.httpOptions,
    );
  }

  cancel(id: number, dto: CancelSubscriptionDTO): Observable<ApiResponse<Subscription>> {
    return this.http.patch<ApiResponse<Subscription>>(
      `${this.apiUrl}/${id}/cancel`,
      dto,
      this.httpOptions,
    );
  }
}
