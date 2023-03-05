import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
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

    public get bits(): any {
        return this.ext.bits;
    }

    constructor(private winRef: WindowRef, private zone: NgZone) {
        
        this.ext.bits.setUserLoopBack = true; // used to stop bit transaction from using my bits when testing
		this.ext.bits.showBitsBalance();

        this.ext.onAuthorized((auth: any) => {
            this.auth = auth;
            this.zone.run(() => this.authorized$.next(auth));
        });

        this.ext.listen('broadcast', (target: string, contentType: string, message: string) => {
            const pub_sub_message = JSON.parse(message);
            console.log({msg: 'Received broadcast message', target, contentType, pub_sub_message, cycle: `isProduction: ${environment.production}`});
            this.zone.run(() => {

            });
        });
    }
    
    send(message: any) {
        this.ext.send('broadcast', 'application/json', JSON.stringify(message));
    }
}
