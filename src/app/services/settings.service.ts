import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Appearance, Behaviour, Bits, Settings } from '../interfaces/settings';
import { TwitchAuth } from '../interfaces/twitch-auth';
import { BackendApiService } from './backend-api.service';
import { TwitchLibService } from './twitch-lib.service';

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
            if (value.self && value.self.settings) {
                this.appearance$.next(value.self.settings);
                this.behaviour$.next(value.self.settings);
                this.bits$.next(value.self.settings);
            }
        });
    }

    update(values: any) {
        this.backendApi.patch<Settings>(`/settings/${this.twitchLib.authorized$.value.channelId}`, { values }).subscribe((value) => {
            console.log(value);
            this.twitchLib.send({ self: { settings: value } });
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
