import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

import { WindowRef } from '../window-ref';
import { environment } from 'src/environments/environment';
import { Authorized, PubSubMessage } from '../shared/interfaces';

export type Mode = 'viewer' | 'dashboard' | 'config';
export interface Context {
    mode: Mode;
}

@Injectable({
    providedIn: 'root'
})
export class TwitchLibService {

    context$: Subject<Context> = new Subject<Context>();

    authorized$: Subject<Authorized> = new Subject<Authorized>();

    broadcast$: Subject<PubSubMessage> = new Subject<PubSubMessage>();

    is_authorized: boolean = false;

    broadcast_listen_timestamps: number[] = [];

    private get ext(): any {
        return this.winRef.nativeWindow.Twitch.ext;
    }

    public get bits(): any {
        return this.ext.bits;
    }

    constructor(private winRef: WindowRef, private zone: NgZone) {

        this.ext.onContext((context: Context, properties: string[]) => {
            this.ext.rig.log(context, properties);
            this.zone.run(() => this.context$.next(context));
        });

        this.ext.onAuthorized((auth: Authorized) => {
            this.is_authorized = true;
            this.ext.rig.log(auth.channelId);
            this.zone.run(() => this.authorized$.next({
                clientId: auth.clientId,
                token: auth.token,
                channelId: auth.channelId,
                userId: auth.userId
            }));
        });

        this.ext.listen('broadcast', (target: string, contentType: string, message: string) => {
            const pub_sub_message = JSON.parse(message) as PubSubMessage;
            this.ext.rig.log('Received broadcast message', target, contentType, pub_sub_message, `isProduction: ${environment.production}`);
            console.log('Received broadcast message', target, contentType, pub_sub_message, `isProduction: ${environment.production}`);
            this.zone.run(() => {
                const { cycle, version, timestamp } = pub_sub_message;

                if (this.broadcast_listen_timestamps.includes(timestamp)) { // still a bug where there are multiple messages received
                    console.log(`--- Double response for ${timestamp}`, pub_sub_message);
                    return;
                }
                this.broadcast_listen_timestamps.push(timestamp);

                if (version === environment.version && cycle === environment.cycle) {
                    this.broadcast$.next(pub_sub_message);
                }
                //this.broadcast$.next(obj);
            });
        });
    }

    send(message: any) {
        this.ext.send('broadcast', 'application/json', JSON.stringify(message));
    }
}
