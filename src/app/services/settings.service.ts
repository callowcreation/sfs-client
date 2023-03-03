import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TwitchAuth } from '../interfaces/twitch-auth';
import { BackendApiService } from './backend-api.service';
import { TwitchLibService } from './twitch-lib.service';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    values$: Subject<any> = new Subject<any>();

    constructor(twitchLib: TwitchLibService, backendApi: BackendApiService) {
        twitchLib.authorized$.subscribe((auth: TwitchAuth) => {
            backendApi.get<any>(`/settings/${75987197}`).subscribe(data => {
                console.log(data);
                this.values$.next(data);
            });
        });
    }
}
