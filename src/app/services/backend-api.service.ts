import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BackendApiService {

    constructor(private http: HttpClient) { }

    get<T>(endpoint: string): Observable<T> {
        return this.http.get<T>(`${environment.backend.api}${endpoint}`);
    }

    /**
     * POST creates a resource.
     * @param endpoint 
     * @param payload 
     * @returns 
     */
    post<T>(endpoint: string, payload: any): Observable<T> {
        return this.http.post<T>(`${environment.backend.api}${endpoint}`, payload);
    }

    /**
     * PUT replaces a resource.
     * @param endpoint 
     * @param payload 
     * @returns 
     */
    put<T>(endpoint: string, payload: any): Observable<T> {
        return this.http.put<T>(`${environment.backend.api}${endpoint}`, payload);
    }

    /**
     * PATCH updates a resource.
     * @param endpoint 
     * @param payload 
     * @returns 
     */
    patch<T>(endpoint: string, payload: any): Observable<T> {
        return this.http.patch<T>(`${environment.backend.api}${endpoint}`, payload);
    }

    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${environment.backend.api}${endpoint}`);
    }
}