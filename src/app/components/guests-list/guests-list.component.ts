import { Component } from '@angular/core';
import { first, timer } from 'rxjs';
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
import { UserPipe } from 'src/app/pipes/user.pipe';

@Component({
    selector: 'app-guests-list',
    templateUrl: './guests-list.component.html',
    styleUrls: ['./guests-list.component.scss']
})
export class GuestsListComponent {

    guests: any[] = [];
    patrons: any[] = [];

    disableActions: boolean = false;

    error: Error | null = null;

    mode: Mode = 'viewer';

    constructor(
        public twitchLib: TwitchLibService,
        private twitchUsers: TwitchUsersService,
        private backendApi: BackendApiService,
        public settings: SettingsService,
        public dialog: MatDialog) {
    }

    ngOnInit() {
        this.twitchLib.context$.subscribe(context => {
            this.mode = context.mode;
        });

        this.twitchLib.authorized$.subscribe((auth: TwitchAuth) => {

            this.backendApi.get<any>(`/shoutouts/${auth.channelId}`).pipe(first()).subscribe(data => {
                const flatData = data.map(this.guestIds).flat();
                this.twitchUsers.append(flatData).then(() => this.guests = this.removeDuplicates(data));
            });
            this.backendApi.get<any>(`/shoutouts/${auth.channelId}/pin-item`).pipe(first()).subscribe(data => {
                const flatData = data.map(this.patronIds).flat();
                this.twitchUsers.append(flatData).then(() => this.patrons = this.removeDuplicates(data));
            });
        });

        this.twitchLib.pubsub$.subscribe(value => {
            console.log({ pubsub: value })

            if (value.internal) {
                this.disableActions = value.internal.disableActions;
                return;
            }

            if (value.action === 'shoutout') {
                this.disableActions = true;

                const flatData = [value.guest].map(this.guestIds).flat();
                this.twitchUsers.append(flatData)
                    .then(() => {

                        const index = this.guests.findIndex(x => x.streamer_id === value.guest.streamer_id)
                        if (index !== -1) {
                            this.guests.splice(index, 1);
                        }

                        this.guests.unshift(value.guest);
                        this.guests.splice(value.max_channel_shoutouts);

                        timer(3000).subscribe(() => {
                            this.disableActions = false;
                        });
                    });
            } else if (value.action === 'move-up') {
                this.disableActions = true;

                const tmp = this.guests[value.index - 1];
                this.guests[value.index - 1] = this.guests[value.index];
                this.guests[value.index] = tmp;

                timer(3000).subscribe(() => {
                    this.disableActions = false;
                });
            } else if (value.action === 'pin-item') {
                this.disableActions = true;

                const patron: Patron = this.guests.splice(value.index, 1)[0] as Patron;
                patron.pinner_id = value.pinner_id;
                const flatData = [patron].map(this.patronIds).flat();
                this.twitchUsers.append(flatData).then(() => {
                    this.patrons = this.removeDuplicates([patron]);
                    timer(3000).subscribe(() => {
                        this.disableActions = false;
                    });
                });
            } else if (value.action === 'pin-item-remove') {
                this.disableActions = true;

                this.guests.unshift(this.patrons[0]);
                this.guests.splice(value.max_channel_shoutouts);
                this.patrons = [];
                timer(3000).subscribe(() => {
                    this.disableActions = false;
                });
            } else if (value.action === 'item-remove') {
                this.disableActions = true;

                this.guests.splice(value.index, 1);
                timer(3000).subscribe(() => {
                    this.disableActions = false;
                });
            }
        });
    }

    ngOnDestroy() {
        this.twitchLib.authorized$.unsubscribe();
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
                this.backendApi.delete(`/shoutouts/${this.twitchLib.auth.channelId}?key=${guest.key}`).pipe(first()).subscribe();
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
            this.backendApi.put<PinItem>(`/shoutouts/${this.twitchLib.auth.channelId}/${action}`, { pinner_id: transaction.userId, key: guest.key }).pipe(first()).subscribe(value => {
                console.log({ TransactionComplete: value })
            });
        });

        // const sku = this.getSkuTierFromLocalStorage();
        bits.useBits(`${action}-10`);

        console.log(`${guest.streamer_id} ${action} callback usebits`);
    }

    private guestIds(guest: Guest): string[] {
        //console.log({ guest })
        const key = guest.legacy === true ? 'login' : 'id';
        return ([`${key}=${guest.streamer_id}`, `${key}=${guest.poster_id}`]);
    }

    private patronIds(patron: Patron): string[] {
        const key = patron.legacy === true ? 'login' : 'id';
        return ([`$id=${patron.pinner_id}`, `${key}=${patron.streamer_id}`, `${key}=${patron.poster_id}`]);
    }

    private removeDuplicates(arr: any[]) {
        return arr.filter((value: Guest, index, self) =>
            index === self.findIndex((t: Guest) => {
                const u1 = this.twitchUsers.user(t.streamer_id);
                const u2 = this.twitchUsers.user(value.streamer_id);
                return (
                    u1?.id === u2?.id
                )
            })
        );
    }
}
