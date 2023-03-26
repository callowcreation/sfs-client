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
import { Warning } from '../warning-notice/warning-notice.component';

@Component({
    selector: 'app-guest-list',
    templateUrl: './guest-list.component.html',
    styleUrls: ['./guest-list.component.scss']
})
export class GuestListComponent {

    @Input() showSettings: boolean = false;

    disableActions: boolean = false;

    error: Error | null = null;
    warning: Warning | null = null;

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
            if (!auth.channelId) return;

            this.backendApi.get(`/shoutouts/${auth.channelId}/migration`)
                .subscribe((value: any) => {
                    if(value.migrate) {
                        this.warning = new Warning(`We are still migrating data ${value.counter} of ${value.total}, this message will go away automatically.`);
                        this.rawUsers.getLegacyShoutouts(auth.channelId);
                    } else {
                        this.rawUsers.getShoutouts(auth.channelId);
                    }
                    console.log({ migration: value })
                });
        });

        this.twitchLib.pubsub$.subscribe(value => {
            console.log({ pubsub: value })

            if (value.internal && value.internal.disableActions) {
                this.disableActions = value.internal.disableActions;
                return;
            }

            if(value.action === 'migration') {
                if(value.migrate === false) {
                    this.warning = null;
                    this.rawUsers.getShoutouts(this.twitchLib.authorized$.value.channelId);
                } else {
                    this.warning = new Warning(`We are still migrating data ${value.counter} of ${value.total}, this message will go away automatically.`);
                    this.rawUsers.getLegacyShoutouts(this.twitchLib.authorized$.value.channelId);
                }
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
            this.backendApi.patch<PinItem>(`/shoutouts/${this.twitchLib.authorized$.value.channelId}/${action}`, { pinner_id: transaction.userId, key: guest.key }).subscribe(value => {
                console.log({ TransactionComplete: value })
            });
        });

        // const sku = this.getSkuTierFromLocalStorage();
        bits.useBits(`${action}-10`);

        console.log(`${guest.streamer_id} ${action} callback usebits`);
    }
}
