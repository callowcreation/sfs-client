import { Pipe, PipeTransform } from '@angular/core';
import { TwitchUsersService } from '../services/twitch-users.service';

@Pipe({
    name: 'twitch_user'
})
export class UserPipe implements PipeTransform {

    constructor(private twitchUsers: TwitchUsersService) { }

    transform(value: string, ...args: any[]): string {
        const [property] = args;
        const user: any = this.twitchUsers.user(value);
        return user ? user[property] : value;
    }

}
