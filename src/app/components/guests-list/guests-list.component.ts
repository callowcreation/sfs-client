import { Component, NgZone } from '@angular/core';
import { first, timer } from 'rxjs';
import { Patron } from 'src/app/interfaces/patron';
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
    patrons: any[] = [];

    disable = {
        actions: false,
        ['move-up']: false,
        ['pin-item']: false,
    };

    constructor(private zone: NgZone, private twitchLib: TwitchLibService, private twitchUsers: TwitchUsersService, private backendApi: BackendApiService, public settings: SettingsService) {

        twitchLib.authorized$.subscribe((auth: TwitchAuth) => {
            backendApi.get<any>(`/shoutouts/${75987197}`).pipe(first()).subscribe(data => {
                console.log(data)
                const flatData = data.map(this.guestIds).flat();
                twitchUsers.append(flatData)
                    .then(() => {
                        this.guests = this.removeDuplicates(data);
                    });
            });
            backendApi.get<any>(`/shoutouts/${75987197}/pin-item`).pipe(first()).subscribe(data => {
                // console.log({ pinned: data })
                const flatData = data.map(this.patronIds).flat();
                twitchUsers.append(flatData)
                    .then(() => {
                        this.patrons = this.removeDuplicates(data);
                    });
            });
        });

        twitchLib.pubsub$.subscribe(value => {
            console.log({ pubsub: value })

            if (value.internal) {
                this.disable = value.internal.disable;
                return;
            }

            if (value.action === 'shoutout') {
                this.disable['actions'] = true;

                const flatData = [value.guest].map(this.guestIds).flat();
                twitchUsers.append(flatData)
                    .then(() => {

                        const index = this.guests.findIndex(x => x.streamer_id === value.guest.streamer_id)
                        if (index !== -1) {
                            this.guests.splice(index, 1);
                        }

                        this.guests.unshift(value.guest);
                        this.guests.splice(value.max_channel_shoutouts);

                        timer(3000).pipe(first()).subscribe(() => {
                            this.disable['actions'] = false;
                        });
                    });
            } else if (value.action === 'move-up') {
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

                const patron: Patron = this.guests.splice(value.index, 1)[0] as Patron;
                patron.pinner_id = value.pinner_id;
                const flatData = [patron].map(this.patronIds).flat();
                twitchUsers.append(flatData)
                    .then(() => {
                        this.patrons = this.removeDuplicates([patron]);
                        timer(3000).pipe(first()).subscribe(() => {
                            this.disable['pin-item'] = false;
                            this.disable['actions'] = false;
                        });
                    });
            }
        });
    }

    actionClick(guest: Guest, action: 'move-up' | 'pin-item') {
        console.log(`actionClick=${action}`, guest)
        if (this.disable[action] || this.disable['actions']) return;
        this.disable[action] = true;
        this.disable['actions'] = true;

        this.twitchLib.send({ internal: { disable: this.disable } });

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

    private patronIds(patron: Patron) {
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
