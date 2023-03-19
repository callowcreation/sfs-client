import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
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

    guests$: Subject<Guest[]> = new Subject<Guest[]>();
    patrons$: Subject<Patron[]> = new Subject<Patron[]>();

    constructor(/*twitchLib: TwitchLibService, */private twitchUsers: TwitchUsersService, private backendApi: BackendApiService) {
        // twitchLib.authorized$.subscribe((auth: TwitchAuth) => {
        //     this.getShoutouts(auth.channelId);
        // });
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