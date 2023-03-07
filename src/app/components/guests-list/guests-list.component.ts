import { Component, NgZone } from '@angular/core';
import { first, timer } from 'rxjs';
import { ActionGuest } from 'src/app/interfaces/action-guest';
import { Guest } from 'src/app/interfaces/guest';
import PinItem from 'src/app/interfaces/pin-item';
import { TransactionObject } from 'src/app/interfaces/transaction';
import { TwitchAuth } from 'src/app/interfaces/twitch-auth';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { SettingsService } from 'src/app/services/settings.service';
import { TwitchLibService } from 'src/app/services/twitch-lib.service';
import { TwitchUsersService } from 'src/app/services/twitch-users.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-guests-list',
    templateUrl: './guests-list.component.html',
    styleUrls: ['./guests-list.component.scss']
})
export class GuestsListComponent {

    guests: any[] = [];
    pinned: any[] = [];

    disable = {
        actions: false,
        ['move-up']: false,
        ['pin-item']: false,
    };

    constructor(private zone: NgZone, private twitchLib: TwitchLibService, private twitchUsers: TwitchUsersService, private backendApi: BackendApiService, public settings: SettingsService) {

        twitchLib.authorized$.subscribe((auth: TwitchAuth) => {
            backendApi.get<any>(`/shoutouts/${75987197}`).pipe(first()).subscribe(data => {
                console.log(data)
                const flatData = data.map(this.guestIds).flat();//.splice(0, 10);
                // smallData.length = 3;
                twitchUsers.append(flatData) //['login=callowcreation', 'login=naivebot']
                    .then(() => {
                        this.guests = this.removeDuplicates(data);
                        // console.log(this.guests)
                        // twitchLib.send(data);
                    });
            });
            backendApi.get<any>(`/shoutouts/${75987197}/pin-item`).pipe(first()).subscribe(data => {
                console.log({ pinned: data })

                // const guests: any[] = [
                //     {
                //         legacy: true,
                //         broadcaster_id: '75987197',
                //         streamer_id: 'callowcreation',
                //         poster_id: 'naivebot',
                //         pinner_id: 'wollac',
                //         timestamp: Date.now()
                //     }
                // ];

                const flatData = data.map(this.pinnerIds).flat();//.splice(0, 10);
                twitchUsers.append(flatData) //['login=callowcreation', 'login=naivebot']
                    .then(() => {
                        this.pinned = this.removeDuplicates(data);
                        // console.log(this.guests)
                        // twitchLib.send(data);
                    });
            });
        });

        twitchLib.pubsub$.subscribe(value => {
            console.log({ pubsub: value })

            if (value.internal) {
                this.disable = value.internal.disable;
                return;
            }

            if (value.action === 'move-up') {
                this.disable['move-up'] = true;

                const tmp = this.guests[value.index - 1];
                this.guests[value.index - 1] = this.guests[value.index];
                this.guests[value.index] = tmp;

                timer(3000).pipe(first()).subscribe(() => {
                    this.disable['move-up'] = false;
                    this.disable['actions'] = false;
                });
            } else if (value.action === 'pin-item') {
                this.disable['pin-item'] = true;

                this.pinned = this.guests.splice(value.index, 1);

                timer(3000).pipe(first()).subscribe(() => {
                    this.disable['pin-item'] = false;
                    this.disable['actions'] = false;
                });
            }
        });
    }

    actionClick(guest: Guest, action: 'move-up' | 'pin-item') {
        console.log(`actionClick=${action}`, guest)
        if (this.disable[action] || this.disable['actions']) return;
        this.disable[action] = true;
        this.disable['actions'] = true;
        //event.target.style.opacity = '0.0';

        this.twitchLib.send({ internal: { disable: this.disable } });
        this.zone.run(() => {
        });
        const bits = this.twitchLib.bits;

        bits.onTransactionCancelled(() => {
            console.log(`Transaction ${action} was cancelled`);
            timer(1000).pipe(first()).subscribe(() => {
                this.disable[action] = false;
                this.disable['actions'] = false;

                this.twitchLib.send({ internal: { disable: this.disable } });
            });
        });

        bits.onTransactionComplete((transaction: TransactionObject) => {
            this.backendApi.put<PinItem>(`/shoutouts/${75987197}/${action}`, { pinner_id: transaction.userId, key: guest.key }).pipe(first()).subscribe(value => {
                console.log({ TransactionComplete: value })
            });
        });

        // const sku = this.getSkuTierFromLocalStorage();
        bits.useBits(`${action}-10`);

        console.log(`${guest.streamer_id} ${action} callback usebits`);
    }

    private guestIds(guest: Guest) {
        const key = guest.legacy === true ? 'login' : 'id';
        return ([`${key}=${guest.streamer_id}`, `${key}=${guest.poster_id}`]);
    }

    private pinnerIds(guest: ActionGuest) {
        const key = guest.legacy === true ? 'login' : 'id';
        return ([`$id=${guest.pinner_id}`, `${key}=${guest.streamer_id}`, `${key}=${guest.poster_id}`]);
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
