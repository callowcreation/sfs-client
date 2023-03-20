import { Component, Input } from '@angular/core';
import { timer } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Patron } from 'src/app/interfaces/patron';
import { Guest } from 'src/app/interfaces/guest';
import PinItem from 'src/app/interfaces/pin-item';
import { TransactionObject } from 'src/app/interfaces/transaction';
import { TwitchAuth } from 'src/app/interfaces/twitch-auth';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Mode, TwitchLibService } from 'src/app/services/twitch-lib.service';
import { TwitchUsersService } from 'src/app/services/twitch-users.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { RawUsersService } from 'src/app/services/raw-users.service';

@Component({
    selector: 'app-guest-list',
    templateUrl: './guest-list.component.html',
    styleUrls: ['./guest-list.component.scss']
})
export class GuestListComponent {

    @Input() showSettings: boolean = false;

    disableActions: boolean = false;

    error: Error | null = null;

    get hasPatrons(): boolean {
        return this.rawUsers.patrons$.value.length > 0;
    }

    constructor(
        public twitchLib: TwitchLibService,
        private twitchUsers: TwitchUsersService,
        public rawUsers: RawUsersService,
        private backendApi: BackendApiService,
        public settings: SettingsService,
        public dialog: MatDialog) {
    }
    
    ngOnInit() {

        this.twitchLib.authorized$.subscribe((auth: TwitchAuth) => {
            if(!auth.channelId) return;
            this.rawUsers.getShoutouts(auth.channelId);
        });

        this.twitchLib.pubsub$.subscribe(value => {
            console.log({ pubsub: value })

            if (value.internal && value.internal.disableActions) {
                this.disableActions = value.internal.disableActions;
                return;
            }

            this.disableActions = true;
            timer(3000).subscribe(() => {
                this.disableActions = false;
            });
        });
    }

    ngOnDestroy() {
        this.twitchLib.pubsub$.unsubscribe();
    }

    removeItem(guest: Guest) {

        if (this.disableActions) return;
        this.disableActions = true;
        this.twitchLib.send({ internal: { disableActions: this.disableActions } });

        const displayName = this.twitchUsers.user(guest.streamer_id).display_name;
        const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { content: `Remove shoutout for ${displayName}?` } });
        dialogRef.afterClosed().subscribe(result => {
            if (coerceBooleanProperty(result) === true) {
                this.backendApi.delete(`/shoutouts/${this.twitchLib.authorized$.value.channelId}?key=${guest.key}`).subscribe();
            } else {
                timer(1000).subscribe(() => {
                    console.log(`Delete ${displayName} was cancelled`);
                    this.disableActions = false;

                    this.twitchLib.send({ internal: { disableActions: this.disableActions } });
                });
            }
        });
    }

    actionClick(guest: Guest, action: 'move-up' | 'pin-item') {
        // try {
        //     ({} as any).willThrow();
        // } catch (error) {
        //     if(error instanceof Error) {
        //         this.error = error;
        //         return;
        //     }
        // }

        if (this.disableActions) return;
        this.disableActions = true;

        this.twitchLib.send({ internal: { disableActions: this.disableActions } });

        const bits = this.twitchLib.bits;

        bits.onTransactionCancelled(() => {
            timer(1000).subscribe(() => {
                console.log(`Transaction ${action} was cancelled`);
                this.disableActions = false;

                this.twitchLib.send({ internal: { disableActions: this.disableActions } });
            });
        });

        bits.onTransactionComplete((transaction: TransactionObject) => {
            this.backendApi.put<PinItem>(`/shoutouts/${this.twitchLib.authorized$.value.channelId}/${action}`, { pinner_id: transaction.userId, key: guest.key }).subscribe(value => {
                console.log({ TransactionComplete: value })
            });
        });

        // const sku = this.getSkuTierFromLocalStorage();
        bits.useBits(`${action}-10`);

        console.log(`${guest.streamer_id} ${action} callback usebits`);
    }
}
