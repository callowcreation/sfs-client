// ebs (Extension Backend Servise
// Extension Bot Service)

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PinnedExpired, SettingsResponse, ShoutoutsResponse, TransactionPayload, User } from '../shared/interfaces';

const iStaged = true;
const PRODUCTION = { STAGED: 0, LIVE: 1 };

const URLS = {
    DEV: 'http://localhost:5000',
    PROD: ['https://shoutoutsdev-38a1d.firebaseapp.com', 'https://shoutouts-for-streamers.firebaseapp.com']
};

interface Header {
    headers: HttpHeaders;
}

@Injectable({
    providedIn: 'root'
})
export class EBSService {

    private base: string = environment.production
        ? (iStaged ? URLS.PROD[PRODUCTION.STAGED] : URLS.PROD[PRODUCTION.LIVE])
        : URLS.DEV;

    private urls = {
        get: {
            settings: 'v2/settings',
            shoutouts: 'v2/shoutouts',
            join: 'v2/bot/join',
            users: 'v2/users'
        },
        post: {
            channels: {
                delete: 'v2/channels/delete',
                settings: 'v2/channels/settings'
            },
            bits: {
                moveUp: 'v3/bits/move-up',
                moveUpExpired: 'v3/bits/move-up-expired',
                pinToTop: 'v3/bits/pin-to-top',
                pinToTopExpired: 'v3/bits/pin-to-top-expired',
            },
            products: 'v3/products'
        }
    };

    private httpOptions: Header = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': ''
        })
    };

    constructor(private http: HttpClient) { }

    getSettings(token: string): Observable<SettingsResponse> {
        return this.http.get<SettingsResponse>(this.getUrl(this.urls.get.settings), this.getHttpOptions(token))
            .pipe(map(x => x));
    }

    getShoutouts(token: string): Observable<ShoutoutsResponse> {
        return this.http.get<ShoutoutsResponse>(this.getUrl(this.urls.get.shoutouts), this.getHttpOptions(token))
            .pipe(map(x => ({ shoutouts: x.shoutouts, posted_bys: x.posted_bys, pinned: x.pinned })));
    }

    postUsers(token: string, usernames: string[]): Observable<User[]> {
        return this.http.post<User[]>(this.getUrl(this.urls.get.users), { usernames }, this.getHttpOptions(token))
            .pipe(map(x => x));
    }

    postDelete(token: string, username: string): Observable<string> {
        return this.http.post<string>(this.getUrl(this.urls.post.channels.delete), { username }, this.getHttpOptions(token));
    }

    postSetting(token: string, setting: any): Observable<string> {
        return this.http.post<string>(this.getUrl(this.urls.post.channels.settings), setting, this.getHttpOptions(token));
    }

    postMoveUp(token: string, transaction_data: TransactionPayload): Observable<string> {
        return this.http.post<string>(this.getUrl(this.urls.post.bits.moveUp), transaction_data, this.getHttpOptions(token));
    }

    moveUpExpired(token: string): Observable<string> {
        return this.http.post<string>(this.getUrl(this.urls.post.bits.moveUpExpired), null, this.getHttpOptions(token));
    }

    postPinToTop(token: string, transaction_data: TransactionPayload): Observable<string> {
        return this.http.post<string>(this.getUrl(this.urls.post.bits.pinToTop), transaction_data, this.getHttpOptions(token));
    }

    pinToTopExpired(token: string, timestampExpired: PinnedExpired): Observable<string> {
        return this.http.post<string>(this.getUrl(this.urls.post.bits.pinToTopExpired), timestampExpired, this.getHttpOptions(token));
    }

    joinChannel(token: string) {
        return this.http.get<void>(this.getUrl(this.urls.get.join), this.getHttpOptions(token));
    }

    postProducts(token: string, products: any): Observable<string> {
        return this.http.post<string>(this.getUrl(this.urls.post.products), { products }, this.getHttpOptions(token));
    }

    private getUrl(endpoint: string): string {
        const path: string = `${this.base}/${endpoint}`;
        //console.log(`ENV_PATH_ENDPOINT------> ${path}`);
        return path;
    }

    private getHttpOptions(token: string): Header {
        this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + token);
        return this.httpOptions;
    }
}
