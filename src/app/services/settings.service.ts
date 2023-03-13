import { Injectable } from '@angular/core';
import { first, Observable, Subject, take } from 'rxjs';
import { TwitchAuth } from '../interfaces/twitch-auth';
import { BackendApiService } from './backend-api.service';
import { TwitchLibService } from './twitch-lib.service';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    values$: Subject<any> = new Subject<any>();

    constructor(private twitchLib: TwitchLibService, private backendApi: BackendApiService) {
        twitchLib.authorized$.subscribe((auth: TwitchAuth) => {
            backendApi.get<any>(`/settings/${auth.channelId}`).subscribe(values => {
                this.values$.next(values);
            });
        });
    }

    updateApperance(values: any) {
        this.backendApi.put(`/settings/${this.twitchLib.auth.channelId}`, { values }).pipe(take(1)).subscribe(value => {
            this.values$.next(value);
        });
    }
}
