import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';

@Injectable({
    providedIn: 'root'
})
export class TwitchApiService {

    constructor(private http: HttpClient) { }

    users(values: string[]): Observable<User[]> {
        return this.http.get<User[]>(`${environment.twitch.api}/users?${values.join('&')}`);
    }

    user(value: string): Observable<User> {
        return this.http.get<User[]>(`${environment.twitch.api}/users?${value}`).pipe(take(1), map(users => users[0]));
    }
}
