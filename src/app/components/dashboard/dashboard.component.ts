import { Component, OnInit } from '@angular/core';
import { EBSService } from '../../services/ebs.service';
import { Mode, TwitchLibService } from '../../services/twitch-lib.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Authorized, Settings, SettingsResponse } from 'src/app/shared/interfaces';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	mode: Mode = 'viewer';
	isBroadcaster: boolean = false;
	isConfig: boolean = false;

	// Appearance
	backgroundColor: string = '#6441a5';
	color: string = '#ffffff';
	borderColor: string = '#c0c0c0';

	//Behaviour
	autoShoutouts: boolean = false;

	// Bits
	enableBits: boolean = false;
	bitsTier: string = 'Tier 1';
	pinDays: number = 3;

	auth: Authorized;

	constructor(
		private localStorage: LocalStorageService,
		private twitchLibService: TwitchLibService,
		private ebsService: EBSService) { }

	ngOnInit(): void {

		const { context$, authorized$, broadcast$ } = this.twitchLibService;

		context$.subscribe(context => {
			this.mode = context.mode;
            this.isConfig = context.mode === 'config' ? true : false;
			this.isBroadcaster = (context.mode === 'dashboard' || context.mode === 'config') ? true : false;
		});

		authorized$.subscribe(auth => {
			this.auth = auth;
            const settings = this.localStorage.loadSettings(this.auth.channelId);
			const settingsResponse: SettingsResponse = {
				settings,
                error: settings ? null : 'Can not load local settings'
			};
            this.setSettingsValues(settingsResponse);

			this.ebsService.getSettings(auth.token)
				.subscribe(settingsResponse => {
					this.setSettingsValues(settingsResponse);
				});
		});

		broadcast$.subscribe(obj => this.setSettingsValues(obj.settingsResponse));
	}

	private setSettingsValues(settingsResponse: SettingsResponse): void {
		if (!settingsResponse) return;
        if (settingsResponse.error) {
            console.error(settingsResponse.error);
            return;
        }        
        if (!settingsResponse.settings) {
            console.error('No settings in ebs response');
            return;
        }
		const settings: Settings = settingsResponse.settings;
		//console.log({ settingsResponse });

		this.backgroundColor = settings.hasOwnProperty('background-color') ? settings['background-color'] : this.backgroundColor;
		this.color = settings.hasOwnProperty('color') ? settings['color'] : this.color;
		this.borderColor = settings.hasOwnProperty('border-color') ? settings['border-color'] : this.borderColor;
		this.autoShoutouts = settings.hasOwnProperty('auto-shoutouts') ? settings['auto-shoutouts'] : this.autoShoutouts;
		this.enableBits = settings.hasOwnProperty('enable-bits') ? settings['enable-bits'] : this.enableBits;
		this.bitsTier = settings.hasOwnProperty('bits-tier') ? settings['bits-tier'] : this.bitsTier;
		this.pinDays = settings.hasOwnProperty('pin-days') ? settings['pin-days'] : this.pinDays;

		const localSettings = {
			'background-color': this.backgroundColor,
			'color': this.color,
			'border-color': this.borderColor,
			'auto-shoutouts': this.autoShoutouts,
			'enable-bits': this.enableBits,
			'bits-tier': this.bitsTier,
			'pin-days': this.pinDays
		};
		this.localStorage.storeSettings(this.auth.channelId, localSettings);
	}

	receiveChange($event: any): void {
		console.log({ settingsEvent: $event });
		this.setSettingsValues($event);
		this.ebsService.postSetting(this.auth.token, $event).subscribe();
	}
}
