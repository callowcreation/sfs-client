import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, first, Observable, Subject, take } from 'rxjs';
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
export interface Settings extends Bits, Behaviour, Appearance { }

const defaultSettings: Settings = {
    'background-color': '#6441A5',
    'border-color': '#808080',
    'color': '#FFFFFF',
    'auto-shoutouts': false,
    'enable-bits': true,
    'bits-tier': 'Tier 1',
    'pin-days': 3,
    'badge-vip': true,
    'commands': ['so', 'shoutout'],
};

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    appearance$: BehaviorSubject<Appearance> = new BehaviorSubject<Appearance>(defaultSettings);
    behaviour$: BehaviorSubject<Behaviour> = new BehaviorSubject<Behaviour>(defaultSettings);
    bits$: BehaviorSubject<Bits> = new BehaviorSubject<Bits>(defaultSettings);

    get defaultValues(): Settings {
        return defaultSettings;
    }

    constructor(private twitchLib: TwitchLibService, private backendApi: BackendApiService) {
        twitchLib.authorized$.subscribe((auth: TwitchAuth) => {
            if(!auth.channelId) return;
            backendApi.get<Settings>(`/settings/${auth.channelId}`).subscribe(values => {
                this.appearance$.next(values);
                this.behaviour$.next(values);
                this.bits$.next(values);
            });
        });

        this.twitchLib.pubsub$.subscribe(value => {
            if (value.internal && value.internal.settings) {
                this.appearance$.next(value.internal.settings);
                this.behaviour$.next(value.internal.settings);
                this.bits$.next(value.internal.settings);
            }
        });
    }

    update(values: any) {
        this.backendApi.put<Settings>(`/settings/${this.twitchLib.authorized$.value.channelId}`, { values }).subscribe((value) => {
            console.log(value);
            this.twitchLib.send({ internal: { settings: value } });
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
