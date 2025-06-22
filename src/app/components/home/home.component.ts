import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsService } from 'src/app/services/settings.service';
import { TwitchLibService } from 'src/app/services/twitch-lib.service';
import { ConfigurationDialogComponent } from '../configuration-dialog/configuration-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    
    showSettings: boolean = false;

    constructor(public settings: SettingsService, public twitchLib: TwitchLibService, public dialog: MatDialog) {

    }

    openConfiguration() {
        const dialogRef = this.dialog.open(ConfigurationDialogComponent, { data: { content: `Welcome to Terra` } });
        dialogRef.afterClosed().subscribe(result => {
            // if (coerceBooleanProperty(result) === true) {
            //     this.backendApi.delete(`/shoutouts/${this.twitchLib.authorized$.value.channelId}?key=${guest.key}`).subscribe();
            // } else {
            //     timer(1000).subscribe(() => {
            //         console.log(`Delete ${displayName} was cancelled`);
            //         this.disableActions = false;

            //         this.twitchLib.send({ self: { disableActions: this.disableActions } });
            //     });
            // }
        });
    }
}
