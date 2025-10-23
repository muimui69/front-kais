import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { CreateUserDto, ListUsersParams, PaginatedUsers, User } from '../interfaces/user.interface';



@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl: string = `${environment.baseUrl}/users`;

    constructor(private http: HttpClient) { }

    listUsers(params?: ListUsersParams): Observable<PaginatedUsers> {
        let httpParams = new HttpParams();

        if (params) {
            if (params.page) httpParams = httpParams.set('page', params.page.toString());
            if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
            if (params.search) httpParams = httpParams.set('fullName', params.search);
            if (params.roleId) httpParams = httpParams.set('roleId', params.roleId.toString());
            // if (params.search) httpParams = httpParams.set('search', params.search);
            // if (params.state !== undefined) httpParams = httpParams.set('state', params.state.toString());
            // if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
            // if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);
        }

        return this.http.get<PaginatedUsers>(this.baseUrl, {
            params: httpParams,
            withCredentials: true
        });
    }

    createUser(userData: CreateUserDto): Observable<User> {
        return this.http.post<User>(this.baseUrl, userData, {
            withCredentials: true
        });
    }
}