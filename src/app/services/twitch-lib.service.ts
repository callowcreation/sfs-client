import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { TwitchAuth } from '../interfaces/twitch-auth';
import { WindowRef } from '../window-ref';

@Injectable({
    providedIn: 'root'
})
export class TwitchLibService {

    authorized$: Subject<TwitchAuth> = new Subject<TwitchAuth>();

    auth!: TwitchAuth;

    private get ext(): any {
        return this.winRef.nativeWindow.Twitch.ext;
    }

    constructor(private winRef: WindowRef, private zone: NgZone) {
        this.ext.onAuthorized((auth: any) => {
            this.auth = auth;
            this.zone.run(() => this.authorized$.next(auth));
        });
    }
}
