import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importante: importar 'map'
import { environment } from '../../../../environment/environment';
import { BitacoraCleanResponse, BitacoraBackendResponse, Bitacora } from '../interface/bitacora.interface';


@Injectable({
  providedIn: 'root'
})
export class BitacoraService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.baseUrl}/bitacora`;

  getAll(
    page: number = 1,
    limit: number = 10,
    filters: any = {}
  ): Observable<BitacoraCleanResponse> {


    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (filters.action) params = params.set('action', filters.action);
    if (filters.administratorId) params = params.set('administratorId', filters.administratorId);
    if (filters.startDate) params = params.set('startDate', filters.startDate);
    if (filters.endDate) params = params.set('endDate', filters.endDate);

    return this.http.get<BitacoraBackendResponse>(this.apiUrl, { params }).pipe(
      map(response => {
        return {
          data: response.data.data,
          total: response.data.pagination.totalItems
        };
      })
    );
  }


  getById(id: number): Observable<{ success: boolean; data: Bitacora }> {
    return this.http.get<{ success: boolean; data: Bitacora }>(`${this.apiUrl}/${id}`);
  }
}
