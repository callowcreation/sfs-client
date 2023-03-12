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

    post<T>(endpoint: string, payload: any): Observable<T> {
        return this.http.post<T>(`${environment.backend.api}${endpoint}`, payload);
    }

    put<T>(endpoint: string, payload: any): Observable<T> {
        return this.http.put<T>(`${environment.backend.api}${endpoint}`, payload);
    }

    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${environment.backend.api}${endpoint}`);
    }
}