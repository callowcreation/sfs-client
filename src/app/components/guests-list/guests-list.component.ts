import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatListOption } from '@angular/material/list';
import { Guest } from 'src/app/interfaces/guest';
import { TwitchAuth } from 'src/app/interfaces/twitch-auth';
import { BackendApiService } from 'src/app/services/backend-api.service';
import { TwitchLibService } from 'src/app/services/twitch-lib.service';
import { TwitchUsersService } from 'src/app/services/twitch-users.service';

@Component({
    selector: 'app-guests-list',
    templateUrl: './guests-list.component.html',
    styleUrls: ['./guests-list.component.scss']
})
export class GuestsListComponent {
    guests: any[] = [];
    selected: MatListOption[] = []

    form = new FormGroup({
        guests: new FormControl(),
    });

    canDelete: boolean = false;

    constructor(twitchLib: TwitchLibService, private twitchUsers: TwitchUsersService, backendApi: BackendApiService) {

        twitchLib.authorized$.subscribe((auth: TwitchAuth) => {
            backendApi.get<any>(`/shoutouts/${75987197}`).subscribe(data => {
                console.log(data)

                // const guests: any[] = [
                //     {
                //         streamer_id: 'callowcreation',
                //         poster_id: 'naivebot',
                //         timestamp: Date.now()
                //     }
                // ];

                const smallData = data.map((x: any) => ([`login=${x.streamer_id}`, `login=${x.poster_id}`])).flat().splice(0, 10);
                // smallData.length = 3;
                twitchUsers.append(smallData) //['login=callowcreation', 'login=naivebot']
                    .then(() => {
                        this.guests = this.removeDuplicates(data);
                        this.form.setValue({ guests: data });
                        console.log(this.guests)
                    });
            });
        });
    }

    removeDuplicates(arr: any[]) {
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
