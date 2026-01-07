import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  Category,
  CategoryStats,
  CategoryTree,
  CreateCategoryDTO,
  MoveCategoryDTO,
  ReorderCategoriesDTO,
  UpdateCategoryDTO
} from '../interfaces/category.interface';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.baseUrl}/categories`;


  getAll(includeInactive: boolean = false): Observable<ApiResponse<Category[]>> {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}`, { params });
  }

  getRoot(includeInactive: boolean = false): Observable<ApiResponse<Category[]>> {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/root`, { params });
  }

  getTree(includeInactive: boolean = false): Observable<ApiResponse<CategoryTree[]>> {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<ApiResponse<CategoryTree[]>>(`${this.apiUrl}/tree`, { params });
  }

  getFullHierarchy(includeInactive: boolean = false): Observable<ApiResponse<Category[]>> {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/hierarchy`, { params });
  }

  getTop(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/top`);
  }
  getStats(): Observable<ApiResponse<CategoryStats>> {
    return this.http.get<ApiResponse<CategoryStats>>(`${this.apiUrl}/stats`);
  }

  getById(id: number, includeChildren: boolean = true): Observable<ApiResponse<Category>> {
    const params = new HttpParams().set('includeChildren', includeChildren);
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/${id}`, { params });
  }

  getBySlug(slug: string, includeChildren: boolean = true): Observable<ApiResponse<Category>> {
    const params = new HttpParams().set('includeChildren', includeChildren);
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/slug/${slug}`, { params });
  }

  search(term: string, includeInactive: boolean = false): Observable<ApiResponse<Category[]>> {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<ApiResponse<Category[]>>(
      `${this.apiUrl}/search/${term}`,
      { params }
    );
  }

  getLevel1(includeInactive: boolean = false): Observable<ApiResponse<Category[]>> {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/level1`, { params });
  }

  getLevel2(includeInactive: boolean = false): Observable<ApiResponse<Category[]>> {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/level2`, { params });
  }

  getLevel3(includeInactive: boolean = false): Observable<ApiResponse<Category[]>> {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/level3`, { params });
  }

  getByLevel(level: number, includeInactive: boolean = false): Observable<ApiResponse<Category[]>> {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/level/${level}`, { params });
  }

  getSubcategories(parentId: number, includeInactive: boolean = false): Observable<ApiResponse<Category[]>> {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/${parentId}/subcategories`, { params });
  }

  getLevel2ByParent(parentId: number, includeInactive: boolean = false): Observable<ApiResponse<Category[]>> {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/${parentId}/level2`, { params });
  }

  getLevel3ByParent(parentId: number, includeInactive: boolean = false): Observable<ApiResponse<Category[]>> {
    const params = new HttpParams().set('includeInactive', includeInactive);
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/${parentId}/level3`, { params });
  }

  create(data: CreateCategoryDTO): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}`, data,
      {withCredentials: true}
    );
  }

  update(id: number, data: UpdateCategoryDTO): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/${id}`, data,
      {withCredentials: true}
    );
  }
  move(id: number, data: MoveCategoryDTO): Observable<ApiResponse<Category>> {
    return this.http.patch<ApiResponse<Category>>(`${this.apiUrl}/${id}/move`, data,
      {withCredentials: true}
    );
  }

  reorder(data: ReorderCategoriesDTO): Observable<ApiResponse<Category[]>> {
    return this.http.post<ApiResponse<Category[]>>(`${this.apiUrl}/reorder`, data,
      {withCredentials: true}
    );856341
  }

  delete(id: number): Observable<ApiResponse<{ success: true }>> {
    return this.http.delete<ApiResponse<{ success: true }>>(`${this.apiUrl}/${id}`,
      {withCredentials: true}
    );
  }
}
