import { Injectable } from '@angular/core';
import { first, Observable, Subject } from 'rxjs';
import { TwitchAuth } from '../interfaces/twitch-auth';
import { BackendApiService } from './backend-api.service';
import { TwitchLibService } from './twitch-lib.service';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    values$: Observable<any> = new Observable<any>();

    constructor(twitchLib: TwitchLibService, backendApi: BackendApiService) {
        twitchLib.authorized$.pipe(first()).subscribe((auth: TwitchAuth) => {
            this.values$ = backendApi.get<any>(`/settings/${auth.channelId}`);
        });
    }
}
