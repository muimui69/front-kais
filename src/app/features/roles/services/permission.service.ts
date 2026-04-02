import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environment/environment';
import { ApiResponse } from '../interfaces/role.interface';
import { PermissionModule } from '../interfaces/permission.interface';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/permissions`;
  private readonly httpOptions = { withCredentials: true } as const;

  getStructure(): Observable<ApiResponse<PermissionModule[]>> {
    return this.http.get<ApiResponse<PermissionModule[]>>(
      `${this.apiUrl}/structure`,
      this.httpOptions
    );
  }
}
