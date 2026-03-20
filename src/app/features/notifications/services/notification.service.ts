import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environment/environment';
import { cleanHttpParams } from '../../../core/utils/http-params.util';
import { PaginatedResponseMeta, PaginationParams } from '../../../core/interface/pagination.interface';

import {
    ApiResponse,
    SimpleApiResponse,
    CreateScheduledNotificationDTO,
    UpdateScheduledNotificationDTO,
    ScheduledNotification,
    ScheduledNotificationWithCreator,
    ScheduledNotificationDetail,
} from '../interfaces/notification.interface';

import { ScheduleNotificationQuery } from '../interfaces/query.notification';

@Injectable({ providedIn: 'root' })
export class NotificationService {

    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.baseUrl}/notifications`;


    private readonly httpOptions = { withCredentials: true } as const;

    private buildUrl(...segments: string[]): string {
        return [this.apiUrl, 'scheduled', ...segments].join('/');
    }


    create(data: CreateScheduledNotificationDTO): Observable<ApiResponse<ScheduledNotification>> {
        return this.http.post<ApiResponse<ScheduledNotification>>(
            this.buildUrl(),
            data,
            this.httpOptions,
        );
    }

    getAll(
        query: ScheduleNotificationQuery,
        pagination: PaginationParams,
    ): Observable<PaginatedResponseMeta<ScheduledNotificationWithCreator[]>> {
        return this.http.get<PaginatedResponseMeta<ScheduledNotificationWithCreator[]>>(
            this.buildUrl(),
            { params: cleanHttpParams({ ...query, ...pagination }), ...this.httpOptions },
        );
    }

    getById(id: string): Observable<ApiResponse<ScheduledNotificationDetail>> {
        return this.http.get<ApiResponse<ScheduledNotificationDetail>>(
            this.buildUrl(id),
            this.httpOptions,
        );
    }

    update(id: string, data: UpdateScheduledNotificationDTO): Observable<ApiResponse<ScheduledNotification>> {
        return this.http.patch<ApiResponse<ScheduledNotification>>(
            this.buildUrl(id),
            data,
            this.httpOptions,
        );
    }

    delete(id: string): Observable<SimpleApiResponse> {
        return this.http.delete<SimpleApiResponse>(
            this.buildUrl(id),
            this.httpOptions,
        );
    }

    send(id: string): Observable<SimpleApiResponse> {
        return this.http.post<SimpleApiResponse>(
            this.buildUrl(id, 'send'),
            null,
            this.httpOptions,
        );
    }

    cancel(id: string): Observable<SimpleApiResponse> {
        return this.http.post<SimpleApiResponse>(
            this.buildUrl(id, 'cancel'),
            null,
            this.httpOptions,
        );
    }
}