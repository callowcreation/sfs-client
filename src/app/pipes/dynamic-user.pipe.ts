import { Pipe, PipeTransform } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { TwitchApiService } from '../services/twitch-api.service';
import { TwitchUsersService } from '../services/twitch-users.service';

@Pipe({
    name: 'dynamic_user'
})
export class DynamicUserPipe implements PipeTransform {

    constructor(private twitchApi: TwitchApiService, private twitchUsers: TwitchUsersService) { }

    transform(value: string, ...args: any[]): Observable<string> {
        const [property] = args;
        const user: any = this.twitchUsers.user(value);
        if(user) {
            console.log('from cache')
            return of(user[property] || value);
        }
        return this.twitchApi.user(`id=${value}`).pipe(tap(user => {
            console.log('from request')
            this.twitchUsers.update([user]);
        }), map((user: any) => user[property] || value));
    }

}
