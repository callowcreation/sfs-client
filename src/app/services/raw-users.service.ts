import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Guest } from '../interfaces/guest';
import { Patron } from '../interfaces/patron';
import { TwitchAuth } from '../interfaces/twitch-auth';
import { BackendApiService } from './backend-api.service';
import { TwitchLibService } from './twitch-lib.service';
import { TwitchUsersService } from './twitch-users.service';

@Injectable({
    providedIn: 'root'
})
export class RawUsersService {

    guests$: BehaviorSubject<Guest[]> = new BehaviorSubject<Guest[]>([]);
    patrons$: BehaviorSubject<Patron[]> = new BehaviorSubject<Patron[]>([]);

    constructor(twitchLib: TwitchLibService, private twitchUsers: TwitchUsersService, private backendApi: BackendApiService) {

        twitchLib.pubsub$.subscribe(value => {
            console.log({ pubsub: value })

            if (value.self) {
                return;
            }

            if (value.action === 'shoutout') {
                const data = [value.guest];
                const flatData = data.map(this.guestIds).flat();
                this.twitchUsers.append(flatData).then(() => {
                    const guests = this.guests$.value;
                    const index = guests.findIndex(x => x.streamer_id === value.guest.streamer_id)
                    if (index !== -1) {
                        guests.splice(index, 1);
                    }
                    guests.unshift(value.guest);
                    guests.splice(value.max_channel_shoutouts);
                    this.guests$.next(guests);
                });
            } else if (value.action === 'move-up') {
                const guests = this.guests$.value;
                const tmp = guests[value.index - 1];
                guests[value.index - 1] = guests[value.index];
                guests[value.index] = tmp;
                this.guests$.next(guests);
            } else if (value.action === 'pin-item') {
                const guests = this.guests$.value;
                
                const patron: Patron = guests.splice(value.index, 1)[0] as Patron;
                patron.pinner_id = value.pinner_id;

                const flatData = [patron].map(this.patronIds).flat();
                this.twitchUsers.append(flatData).then(() => {
                    this.patrons$.next([patron]);
                });
            } else if (value.action === 'pin-item-remove') {
                if(this.patrons$.value.length === 0) return;
                
                const guests = this.guests$.value;
                
                guests.unshift(this.patrons$.value[0]);
                guests.splice(value.max_channel_shoutouts);
                
                this.guests$.next(guests);
                this.patrons$.next([]);
            } else if (value.action === 'item-remove') {
                const guests = this.guests$.value;
                guests.splice(value.index, 1);
                this.guests$.next(guests);
            }
        });
    }

    public getShoutouts(broadcaster_id: string) {

        this.backendApi.get<any>(`/shoutouts/${broadcaster_id}`).subscribe(data => {
            const flatData = data.map(this.guestIds).flat();
            this.twitchUsers.append(flatData).then(() => {
                this.guests$.next(this.removeDuplicates(data));
            });
        });

        this.backendApi.get<any>(`/shoutouts/${broadcaster_id}/pin-item`).subscribe(data => {
            const flatData = data.map(this.patronIds).flat();
            this.twitchUsers.append(flatData).then(() => {
                this.patrons$.next(this.removeDuplicates(data));
            });
        });
    }

    public getLegacyShoutouts(broadcaster_id: string) {

        this.backendApi.get<any>(`/shoutouts/${broadcaster_id}/legacy`).subscribe(data => {
            const flatData = data.map(this.guestIds).flat();
            this.twitchUsers.append(flatData).then(() => {
                this.guests$.next(this.removeDuplicates(data));
            });
        });
    }

    private removeDuplicates<T extends Guest>(arr: T[]): T[] {
        return arr.filter((value: T, index, self) =>
            index === self.findIndex((t: T) => {
                return t.streamer_id === value.streamer_id;
            })
        );
    }

    private guestIds(guest: Guest): string[] {
        const key = guest.legacy === true ? 'login' : 'id';
        return ([`${key}=${guest.streamer_id}`, `${key}=${guest.poster_id}`]);
    }

    private patronIds(patron: Patron): string[] {
        const key = patron.legacy === true ? 'login' : 'id';
        return ([`$id=${patron.pinner_id}`, `${key}=${patron.streamer_id}`, `${key}=${patron.poster_id}`]);
    }
}