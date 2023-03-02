import { Component } from '@angular/core';
import { TwitchAuth } from 'src/app/interfaces/twitch-auth';
import { TwitchLibService } from 'src/app/services/twitch-lib.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    constructor(twitchLib: TwitchLibService) {
        twitchLib.authorized$.subscribe((auth: TwitchAuth) => {
            console.log(auth);
        });
    }
}
