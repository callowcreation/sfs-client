import { Component, Input } from '@angular/core';
import { TwitchLibService } from '../../services/twitch-lib.service';
import { BaseSettingsComponent } from '../base-settings/base-settings.component';

@Component({
	selector: 'app-settings-panel',
	templateUrl: './settings-panel.component.html',
	styleUrls: ['./settings-panel.component.scss']
})
export class SettingsPanelComponent extends BaseSettingsComponent {
	
	@Input() isBroadcaster: boolean = false;
	@Input() isConfig: boolean = false;

	showPopup: boolean = false;

	constructor(twitchLibService: TwitchLibService) {
		super(twitchLibService);
	}

	gearClick(): void {
		this.showPopup = !this.showPopup;
	}
	
	receiveChange($event: any): void {
		this.changeEvent.emit($event);
	}
}
