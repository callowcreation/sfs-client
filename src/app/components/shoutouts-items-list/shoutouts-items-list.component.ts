import { Component, OnInit, Input, NgZone } from '@angular/core';

import { EBSService } from 'src/app/services/ebs.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

import { TwitchLibService } from '../../services/twitch-lib.service'
import { Authorized, TransactionResponse, PubSubMessage, ShoutoutResponse, ShoutoutsResponse, PinnedExpired, User, TransError } from '../../shared/interfaces'
import { ShoutoutItem } from './ShoutoutItem';

export interface Cooldowns {
    moveUp: number;
    pinToTop: number;
    moveUpSeconds: number;
}

export interface Intervals {
    moveUp: any;
    pinToTop: any;
}

@Component({
    selector: 'app-shoutouts-items-list',
    templateUrl: './shoutouts-items-list.component.html',
    styleUrls: ['./shoutouts-items-list.component.scss']
})
export class ShoutoutsItemsListComponent implements OnInit {

    auth: Authorized;

    shoutoutItems: ShoutoutItem[];

    pinnedItems: ShoutoutItem[];

    loading: boolean = false;

    empty: boolean = false;

    transError: TransError = null;

    cooldowns: Cooldowns = {
        moveUp: 0,
        pinToTop: 0,
        moveUpSeconds: 0
    };

    intervals: Intervals = {
        moveUp: null,
        pinToTop: null
    };

    @Input() isBroadcaster: boolean = false;

    @Input() color: string;

    @Input() backgroundColor: string;

    @Input() borderColor: string;

    @Input() enableBits: boolean;

    @Input() bitsTier: boolean;

    // should be in the broadcaster settings as a range 10000 to 60000
    moveUpCooldownTimeMs: number = 30000;

    constructor(private twitchLibService: TwitchLibService,
        private ebsService: EBSService, private localStorageService: LocalStorageService, private zone: NgZone) { }

    ngOnInit(): void {
        console.log('Loading panel shoutouts');
        this.shoutoutItems = [];
        this.pinnedItems = [];

        this.loading = true;

        this.transError = null;

        const { authorized$, broadcast$ } = this.twitchLibService;

        authorized$.subscribe(auth => {
            this.auth = auth;

            if (this.isBroadcaster) {
                this.ebsService.joinChannel(this.auth.channelId);
            }

            this.ebsService.getShoutouts(this.auth.token)
                .subscribe(shoutoutsResponse => this.addAllShoutoutsToList(shoutoutsResponse));
        });

        broadcast$.subscribe(pub_sub_message => {
            this.zone.run(() => this.setValues(pub_sub_message));
        });
    }

    moveUpCallback() {
        this.loading = true;
        this.enableMoveUpActionItems(false);
    }

    moveUpCancelled() {
        this.zone.run(() => {
            this.loading = false;
            this.enableMoveUpActionItems(true);
            console.log({ loading: this.loading }, 'Move Up was cancelled enabling action items');
        });
    }

    pinToTopCallback() {
        this.loading = true;
        this.enablePinToTopActionItems(false);
    }

    pinToTopCancelled() {
        this.zone.run(() => {
            this.loading = false;
            this.enablePinToTopActionItems(true);
            console.log({ loading: this.loading }, 'Pin To Top was cancelled enabling action items');
        });
    }

    private enableMoveUpActionItems(enable: boolean) {
        this.zone.run(() => {
            for (let i = 0; i < this.shoutoutItems.length; i++) {
                const shoutoutItem = this.shoutoutItems[i];
                if (i === 0) {
                    shoutoutItem.moveUp.show = false;
                    shoutoutItem.moveUp.enabled = false;
                } else {
                    shoutoutItem.moveUp.show = true;
                    shoutoutItem.moveUp.enabled = enable;
                }
            }
        });
    }

    private enablePinToTopActionItems(enable: boolean) {
        for (let i = 0; i < this.shoutoutItems.length; i++) {
            const shoutoutItem = this.shoutoutItems[i];
            shoutoutItem.pinToTop.enabled = enable;
        }
    }

    private pinToTopBackIntoShoutoutsList() {
        const pinnedExpired = {
            username: this.pinnedItems[0].user.login,
            posted_by: this.pinnedItems[0].posted_by
        } as PinnedExpired;

        for (let i = 0; i < this.shoutoutItems.length; i++) {
            const shoutoutItem = this.shoutoutItems[i];
            shoutoutItem.pinToTop.show = true;
            shoutoutItem.pinToTop.enabled = true;
        }
        this.pinnedItems[0].isPinned = false;
        this.pinnedItems[0].pinToTop.enabled = true;

        this.shoutoutItems.unshift(this.pinnedItems[0]);
        this.shoutoutItems.splice(4);

        this.pinnedItems = [];

        this.enableMoveUpActionItems(this.hasMoveUpCooldownExpired());

        this.ebsService.pinToTopExpired(this.auth.token, pinnedExpired).subscribe();
    }

    private setMoveUpSeconds() {
        this.cooldowns.moveUpSeconds = Math.ceil(this.cooldowns.moveUp / 1000);
    }

    private timedEnableMoveUpActionItems() {
        if (this.intervals.moveUp !== null) return;

        this.intervals.moveUp = setInterval(() => {
            this.cooldowns.moveUp = this.cooldowns.moveUp - 1000;
            this.setMoveUpSeconds();
            // console.log({ moveUp: this.cooldowns.moveUp });

            if (this.cooldowns.moveUp <= 0) {
                this.clearMoveUpInterval();
                this.enableMoveUpActionItems(true);
                this.ebsService.moveUpExpired(this.auth.token).subscribe();
            }
        }, 1000);
    }

    private timedPinToTopExpired() {
        if (this.intervals.pinToTop !== null) return;

        this.intervals.pinToTop = setInterval(() => {
            this.cooldowns.pinToTop = this.cooldowns.pinToTop - 1000;
            //console.log({ pinToTop: this.cooldowns.pinToTop });

            if (this.cooldowns.pinToTop <= 0) {
                this.clearPinToTopInterval();
                this.pinToTopBackIntoShoutoutsList();
            }
        }, 1000);
    }

    private clearMoveUpInterval() {
        clearInterval(this.intervals.moveUp);
        this.intervals.moveUp = null;
    }

    private clearPinToTopInterval() {
        clearInterval(this.intervals.pinToTop);
        this.intervals.pinToTop = null;
    }

    private setValues(pub_sub_message: PubSubMessage) {
        /*
            if multiple deletes from website show message to user
            to reload the frame because something changed and 'we' 
            could not update the frame
        */
        console.log('setValues from pubsub', { pub_sub_message });
        if (pub_sub_message.shoutoutResponse) {
            this.addNewShoutoutToList(pub_sub_message);
        } else if (pub_sub_message.transactionResponse) {
            this.setValueBitsTransaction(pub_sub_message);
        } else if (pub_sub_message.settingsResponse) {
            //console.log({ settingsResponse: pub_sub_message.settingsResponse });
        } else if (pub_sub_message.actionResponse) {
            //console.log({ actionResponse: pub_sub_message.actionResponse });
        } else {
            // unexpected property
            console.warn('unexpected property from pub sub sent from firebase', { pub_sub_message });
        }
    }

    private setValueBitsTransaction(pub_sub_message: PubSubMessage) {
        if (pub_sub_message.error) {
            console.error('transactionResponse error', { obj: pub_sub_message });
            return;
        }

        const transactionResponse: TransactionResponse = pub_sub_message.transactionResponse;
        switch (transactionResponse.type) {
            case 'move-up':
                this.updateShoutoutsMoveUp(transactionResponse);
                break;
            case 'pin-to-top':
                this.updateShoutoutsPinToTop(transactionResponse);
                break;
            default:
                this.loading = false;
                console.warn(`Unknown transactionResponse.type ${transactionResponse.type}`);
                break;
        }
        this.removeResponseFromTimestamps(pub_sub_message.timestamp);
    }

    private updateShoutoutsMoveUp(transactionResponse: TransactionResponse) {
        this.localStorageService.storeTransactionMoveUpExpires(this.auth.channelId, transactionResponse.timestamp + this.moveUpCooldownTimeMs);

        console.log('received "Move Up" transactionResponse', { transactionResponse });
        //console.log('-- BEFORE change', { shoutouts: this.shoutoutItems });
        this.shoutoutItems = [];
        if (this.shoutoutItems.length === 0) {
            console.log('------ BUG move-up shoutoutItems array is now empty - requesting new list from server');
            this.transError = {
                type: transactionResponse.type,
                prompt: 'There was an error loading the changes.',
                message: 'The transaction "Move Up" was successful, but there was an error loading the changes, please reload your browser.'
            };
            this.loading = false;

            window.location.reload();
            return;
        }

        const itemToMove = this.shoutoutItems.find(x => x.user.login === transactionResponse.username);
        const fromIndex = this.shoutoutItems.indexOf(itemToMove);
        const shoutout = this.shoutoutItems[fromIndex - 1];
        this.shoutoutItems[fromIndex - 1] = this.shoutoutItems[fromIndex];
        this.shoutoutItems[fromIndex] = shoutout;

        this.cooldowns.moveUp = transactionResponse.timestamp + this.moveUpCooldownTimeMs - Date.now();
        this.setMoveUpSeconds();

        this.enableMoveUpActionItems(false);
        this.timedEnableMoveUpActionItems();

        this.loading = false;
        //console.log('------ AFTER change', { fromIndex, shoutouts: this.shoutoutItems });
    }

    private updateShoutoutsPinToTop(transactionResponse: TransactionResponse) {

        const pinToToExpiresTimeMs = this.getPinDaysInMs();

        this.localStorageService.storeTransactionPinToTopExpires(this.auth.channelId, transactionResponse.timestamp + pinToToExpiresTimeMs)

        console.log('received "Pin to Top" transactionResponse', { transactionResponse });
        this.shoutoutItems = [];
        if (this.shoutoutItems.length === 0) {
            console.log('------ BUG pin-to-top shoutoutItems array is now empty - requesting new list from server');
            this.transError = {
                type: transactionResponse.type,
                prompt: 'There was an error loading the changes.',
                message: 'The transaction "Pin to Top" was successful, but there was an error loading the changes, please reload your browser.'
            };
            this.loading = false;

            window.location.reload();
            return;
        }

        this.cooldowns.pinToTop = transactionResponse.timestamp + pinToToExpiresTimeMs - Date.now();

        const shoutout: ShoutoutItem = this.shoutoutItems.find(x => x.user.login === transactionResponse.username.toLowerCase());
        shoutout.moveUp.show = false;
        shoutout.pinToTop.enabled = false;
        shoutout.isPinned = true;
        this.pinnedItems.unshift(shoutout);

        const indexOf = this.shoutoutItems.indexOf(shoutout);
        this.shoutoutItems.splice(indexOf, 1);

        for (let i = 0; i < this.shoutoutItems.length; i++) {
            const shoutoutItem = this.shoutoutItems[i];
            shoutoutItem.pinToTop.show = false;
        }

        this.applyPinToTopCooldown(transactionResponse.timestamp + pinToToExpiresTimeMs);

        this.enableMoveUpActionItems(this.hasMoveUpCooldownExpired());

        this.loading = false;
    }

    private getPinDaysInMs() {
        const pinnedExpireDays = +this.localStorageService.loadSettings(this.auth.channelId)['pin-days'];
        const pinToToExpiresTimeMs = pinnedExpireDays * (24 * (60 * (60 * 1000))) * 0.0001; //  * 0.0001 is for testing to shorten the time
        return pinToToExpiresTimeMs;
    }

    private removeResponseFromTimestamps(timestamp: number) {
        setTimeout(() => {
            console.log(`--- Removing Double response for ${timestamp}`);
            const indexOf = this.twitchLibService.broadcast_listen_timestamps.indexOf(timestamp);
            this.twitchLibService.broadcast_listen_timestamps.splice(indexOf, 1);
        }, 1000);
    }

    private createShoutoutItemForTop(user: User, posted_by: string) {
        const showMoveUp = false;
        const showPinToTop = this.pinnedItems.length > 0 ? false : true;
        return new ShoutoutItem(user, posted_by, showMoveUp, showPinToTop);
    }

    private addNewShoutoutToList(pub_sub_message: PubSubMessage) {
        const shoutoutResponse: ShoutoutResponse = pub_sub_message.shoutoutResponse;

        const shoutout: ShoutoutItem = this.shoutoutItems.find(x => x.user.login === shoutoutResponse.usernames[0]);

        if (shoutoutResponse.add === true) {
            if (shoutout) {
                shoutout.pinToTop.show = this.pinnedItems.length > 0 ? false : true;

                const index = this.shoutoutItems.indexOf(shoutout);
                this.shoutoutItems.splice(index, 1);
                this.shoutoutItems.unshift(shoutout);

                this.enableMoveUpActionItems(this.hasMoveUpCooldownExpired());
            } else {
                const users$ = this.ebsService.postUsers(this.auth.token, [shoutoutResponse.usernames[0]]);
                users$.subscribe(users => {
                    const shoutoutItem = this.createShoutoutItemForTop(users[0], shoutoutResponse.posted_by);

                    this.shoutoutItems.unshift(shoutoutItem);
                    this.shoutoutItems.splice(shoutoutResponse.max_count);

                    //console.log(`Added ${this.shoutoutItems[0].user.login}`);

                    this.enableMoveUpActionItems(this.hasMoveUpCooldownExpired());
                });
            }

            this.empty = false;
        } else {
            for (let i = 0; i < shoutoutResponse.usernames.length; i++) {
                const username = shoutoutResponse.usernames[i];
                const index = this.shoutoutItems.findIndex(x => x.user.login === username);
                this.shoutoutItems.splice(index, 1);
            }
            this.empty = this.shoutoutItems.length === 0;
            this.enableMoveUpActionItems(this.hasMoveUpCooldownExpired());
        }
    }

    private addAllShoutoutsToList(shoutoutsResponse: ShoutoutsResponse): void {
        if (!shoutoutsResponse) {
            this.loading = false;
            return;
        }

        if (shoutoutsResponse.pinned) {
            this.pinnedItems = [];
            const users$ = this.ebsService.postUsers(this.auth.token, [shoutoutsResponse.pinned.username]);
            users$.subscribe(users => {
                const user = users.find(u => u.login === shoutoutsResponse.pinned.username);
                const shoutoutItem = new ShoutoutItem(user, shoutoutsResponse.pinned.posted_by, false, true);

                shoutoutItem.pinToTop.enabled = false;
                shoutoutItem.isPinned = true;
                this.pinnedItems.unshift(shoutoutItem);
                this.empty = false;
                try {
                    const pinToToExpiresTimeMs = this.getPinDaysInMs();
                    this.applyPinToTopCooldown(shoutoutsResponse.pinned.timestamp + pinToToExpiresTimeMs);
                } catch (err) {
                    console.log({ err });
                }
            });
        }

        const usernames: string[] = shoutoutsResponse.shoutouts;

        if (usernames.length === 0) {
            this.shoutoutItems = [];
            this.loading = false;
            this.empty = true;
        } else {
            this.shoutoutItems = [];
            const users$ = this.ebsService.postUsers(this.auth.token, usernames);
            users$.subscribe(users => {
                //console.log({ usernames, users });

                for (let i = 0; i < usernames.length; i++) {
                    const username = usernames[i];
                    const user = users.find(u => u.login === username);
                    if (user) {

                        const posted_by = shoutoutsResponse.posted_bys[user.login.toLowerCase()];
                        const showMoveUp = i === usernames.length - 1 ? false : true;
                        const showPinToTop = shoutoutsResponse.pinned ? false : true;
                        const shoutoutItem = new ShoutoutItem(user, posted_by, showMoveUp, showPinToTop);

                        this.shoutoutItems.unshift(shoutoutItem);
                    }
                }

                this.enableMoveUpActionItems(this.hasMoveUpCooldownExpired());

                this.loading = false;
                this.empty = false;

                try {
                    if (!this.hasMoveUpCooldownExpired()) {
                        this.timedEnableMoveUpActionItems();
                    }
                } catch (err) {
                    console.log({ err });
                }
            });
        }
    }

    private hasMoveUpCooldownExpired(): boolean {
        const loadedTransactionMoveUp: any = this.localStorageService.loadTransactionMoveUpExpires(this.auth.channelId);
        const move_up_expires: number = loadedTransactionMoveUp ? loadedTransactionMoveUp.move_up_expires : 0;

        if (move_up_expires) {
            const expiredTime = move_up_expires - Date.now();

            this.cooldowns.moveUp = expiredTime;
            this.setMoveUpSeconds();

            //console.log({ move_up_expires, expiredTime });
            return expiredTime <= 0;
        }
        return true;
    }

    private applyPinToTopCooldown(timestamp: number) {

        const expiredTime = timestamp - Date.now();
        this.cooldowns.pinToTop = expiredTime;

        //console.log({ timestamp, expiredTime });
        if (expiredTime > 0) {
            //console.log(`Item pinned`);

            this.timedPinToTopExpired();
        } else {
            this.clearPinToTopInterval();
            this.pinToTopBackIntoShoutoutsList();
        }
    }
}
