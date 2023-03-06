import { Component, NgZone } from '@angular/core';
import { first, timer } from 'rxjs';
import { Guest } from 'src/app/interfaces/guest';
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

    disable = {
        actions: false,
        ['move-up']: false,
        ['pin-to-top']: false,
    };

    constructor(private zone: NgZone, private twitchLib: TwitchLibService, private twitchUsers: TwitchUsersService, private backendApi: BackendApiService, public settings: SettingsService) {

        twitchLib.authorized$.subscribe((auth: TwitchAuth) => {
            backendApi.get<any>(`/shoutouts/${75987197}`).subscribe(data => {
                console.log(data)
                // const guests: any[] = [
                //     {
                //         legacy: true,
                //         broadcaster_id: '75987197',
                //         streamer_id: 'callowcreation',
                //         poster_id: 'naivebot',
                //         timestamp: Date.now()
                //     }
                // ];

                const smallData = data.map(this.guestIds).flat();//.splice(0, 10);
                // smallData.length = 3;
                twitchUsers.append(smallData) //['login=callowcreation', 'login=naivebot']
                    .then(() => {
                        this.guests = this.removeDuplicates(data);
                        // console.log(this.guests)
                        // twitchLib.send(data);
                    });
            });
        });

        twitchLib.pubsub$.subscribe(value => {
            console.log({ pubsub: value })

            if (value.internal) {
                this.disable = value.disable;
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
            }
        });
    }

    actionClick(guest: Guest, action: 'move-up' | 'pin-to-top') {
        if (this.disable['move-up']) return;
        this.disable['move-up'] = true;
        this.disable['actions'] = true;
        //event.target.style.opacity = '0.0';
        
        this.twitchLib.send({ internal: true, disable: this.disable });
        this.zone.run(() => {
        });
        const bits = this.twitchLib.bits;

        bits.onTransactionCancelled(() => {
            console.log('Transaction move up was cancelled');
            timer(1000).pipe(first()).subscribe(() => {
                this.disable['move-up'] = false;
                this.disable['actions'] = false;
            
                this.twitchLib.send({ internal: true, disable: this.disable });
            });
        });

        bits.onTransactionComplete((transaction: any) => {
            this.backendApi.put(`/shoutouts/${75987197}/move-up`, { key: guest.key }).subscribe();
        });

        // const sku = this.getSkuTierFromLocalStorage();
        bits.useBits('move-up-10');

        console.log(`${guest.streamer_id} ${action} callback usebits`);
    }

    private guestIds(guest: Guest) {
        const key = guest.legacy === true ? 'login' : 'id';
        return ([`${key}=${guest.streamer_id}`, `${key}=${guest.poster_id}`]);
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
