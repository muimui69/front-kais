import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { cleanHttpParams } from '../../../core/utils/http-params.util';
import { PaginatedResponseMeta } from '../../../core/interface/pagination.interface';
import {
  ApiResponse,
  DocumentReviewResult,
  ProfessionalDocumentDetail,
  ProfessionalDocumentFilters,
  ProfessionalDocumentListItem,
  ProfessionalDocumentStats,
} from '../interfaces/professional-documents.interface';

@Injectable({ providedIn: 'root' })
export class ProfessionalDocumentsService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/admin/professional-documents`;
  private readonly httpOptions = { withCredentials: true } as const;

  getStats(): Observable<ApiResponse<ProfessionalDocumentStats>> {
    return this.http.get<ApiResponse<ProfessionalDocumentStats>>(
      `${this.apiUrl}/stats`,
      this.httpOptions
    );
  }

  getAll(
    filters: ProfessionalDocumentFilters
  ): Observable<PaginatedResponseMeta<ProfessionalDocumentListItem[]>> {
    return this.http.get<PaginatedResponseMeta<ProfessionalDocumentListItem[]>>(
      this.apiUrl,
      { params: cleanHttpParams(filters as Record<string, any>), ...this.httpOptions }
    );
  }

  getByProfessionalId(
    professionalId: number
  ): Observable<ApiResponse<ProfessionalDocumentDetail>> {
    return this.http.get<ApiResponse<ProfessionalDocumentDetail>>(
      `${this.apiUrl}/${professionalId}`,
      this.httpOptions
    );
  }

  approveDocument(documentId: number): Observable<ApiResponse<DocumentReviewResult>> {
    return this.http.patch<ApiResponse<DocumentReviewResult>>(
      `${this.apiUrl}/${documentId}/approve`,
      {},
      this.httpOptions
    );
  }

  rejectDocument(
    documentId: number,
    reason: string
  ): Observable<ApiResponse<DocumentReviewResult>> {
    return this.http.patch<ApiResponse<DocumentReviewResult>>(
      `${this.apiUrl}/${documentId}/reject`,
      { reason },
      this.httpOptions
    );
  }
}
