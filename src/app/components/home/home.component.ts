import { Component } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { TwitchLibService } from 'src/app/services/twitch-lib.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    
    showSettings: boolean = false;

    constructor(public settings: SettingsService, public twitchLib: TwitchLibService) {

    }
}
