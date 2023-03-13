import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TwitchAuth } from '../interfaces/twitch-auth';
import { WindowRef } from '../window-ref';

export type Mode = 'viewer' | 'dashboard' | 'config';
export interface Context {
    mode: Mode;
}
@Injectable({
    providedIn: 'root'
})
export class TwitchLibService {
    
    private _pubsub$: Subject<any> = new Subject<any>();

    private _context$: Subject<Context> = new Subject<Context>();

    private _authorized$: Subject<TwitchAuth> = new Subject<TwitchAuth>();

    ctx!: Context;
    auth!: TwitchAuth;

    broadcast_listen_timestamps: number[] = [];

    public get pubsub$(): Subject<any> {
        return this._pubsub$;
    }

    public get context$(): Subject<Context> {
        return this._context$;
    }

    public get authorized$(): Subject<TwitchAuth> {
        return this._authorized$;
    }

    private get ext(): any {
        return this.winRef.nativeWindow.Twitch.ext;
    }

    public get bits(): any {
        return this.ext.bits;
    }

    constructor(private winRef: WindowRef, private zone: NgZone) {
        
        this.ext.bits.setUserLoopBack = true; // used to stop bit transaction from using my bits when testing
		this.ext.bits.showBitsBalance();

        this.ext.onContext((context: Context, properties: string[]) => {
            this.ctx = context;
            this.zone.run(() => this._context$.next(context));
        });

        this.ext.onAuthorized((auth: any) => {
            this.auth = auth;
            this.zone.run(() => this._authorized$.next(auth));
        });

        this.ext.listen('broadcast', (target: string, contentType: string, message: string) => {
            const pub_sub_message = JSON.parse(message);
            // console.log('--------------------------------------------------------')
            // console.log({pub_sub_message})
            // console.log('--------------------------------------------------------')
            const { internal } = pub_sub_message;
            const { cycle, version, timestamp } = pub_sub_message.environment;

            if(internal) {
                this.zone.run(() => {
                    //console.log({internal: 'Received broadcast message', target, contentType, pub_sub_message, cycle: `isProduction: ${environment.production}`});
                    this._pubsub$.next(pub_sub_message);
                });
                return;
            }

            if (this.broadcast_listen_timestamps.includes(timestamp)) { // still a bug where there are multiple messages received
                //console.log(`--- Double response for ${timestamp}`, pub_sub_message);
                return;
            }
            this.broadcast_listen_timestamps.push(timestamp);

            this.zone.run(() => {
                console.log({msg: 'Received broadcast message', target, contentType, pub_sub_message, cycle: `isProduction: ${environment.production}`});
                if (version === environment.version && cycle === environment.cycle) {
                    this._pubsub$.next(pub_sub_message);
                }
            });
        });
    }
    
    send(message: any) {
        this.ext.send('broadcast', 'application/json', JSON.stringify(attachEnvironment(message)));
    }
}

function attachEnvironment(payload: any): any {
    payload.environment = {
        cycle: environment.cycle,
        version: environment.version,
        timestamp: Date.now(),
    };
    return payload;
}
