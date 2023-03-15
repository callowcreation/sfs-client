import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { first, Observable, Subject, take } from 'rxjs';
import { TwitchAuth } from '../interfaces/twitch-auth';
import { BackendApiService } from './backend-api.service';
import { TwitchLibService } from './twitch-lib.service';

export type Tier = 'Tier 1' | 'Tier 2' | 'Tier 3';

export interface Appearance {
    'background-color': string;
    'border-color': string;
    'color': string;
}
export interface Behaviour {
    'auto-shoutouts': boolean;
    'badge-vip': boolean;
    'commands': string[];
}
export interface Bits {
    'enable-bits': boolean;
    'bits-tier': Tier;
    'pin-days': number;
}
export interface Settings extends Bits, Behaviour, Appearance {}

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    appearance$: Subject<Appearance> = new Subject<Appearance>();
    behaviour$: Subject<Behaviour> = new Subject<Behaviour>();
    bits$: Subject<Bits> = new Subject<Bits>();

    constructor(private twitchLib: TwitchLibService, private backendApi: BackendApiService) {
        twitchLib.authorized$.subscribe((auth: TwitchAuth) => {
            backendApi.get<Settings>(`/settings/${auth.channelId}`).subscribe(values => {
                this.appearance$.next(values);
                this.behaviour$.next(values);
                this.bits$.next(values);
            });
        });
    }

    updateApperance(values: Appearance) {
        this.backendApi.put<Appearance>(`/settings/${this.twitchLib.auth.channelId}`, { values }).pipe(take(1)).subscribe(value => {
            console.log({appearance: value});
            this.appearance$.next(value);
        });
    }
    updateBehaviour(values: Behaviour) {
        this.backendApi.put<Behaviour>(`/settings/${this.twitchLib.auth.channelId}`, { values }).pipe(take(1)).subscribe(value => {
            console.log({behaviour: value});
            this.behaviour$.next(value);
        });
    }
    updateBits(values: Bits) {
        this.backendApi.put<Bits>(`/settings/${this.twitchLib.auth.channelId}`, { values }).pipe(take(1)).subscribe(value => {
            console.log({bits: value});
            this.bits$.next(value);
        });
    }

    public static SetSelective(value: any, group: FormGroup<any>) {
        Object.keys(value).forEach((key: string) => {
            if (Object.keys(group.value).includes(key)) {
                group.controls[key].setValue(value[key]);
            }
        });
    }
}
