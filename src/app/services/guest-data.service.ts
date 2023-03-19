import { Injectable } from '@angular/core';
import { Guest } from '../interfaces/guest';

@Injectable({
    providedIn: 'root'
})
export class GuestDataService {

    items: Guest[] = [];

    constructor() { }

    add(guests: Guest[]) {
        this.items.push(...guests);
        this.items = this.removeDuplicates(this.items);
    }
    
    private removeDuplicates(arr: Guest[]) {
        return arr.filter((value: Guest, index, self) =>
            index === self.findIndex((t: Guest) => {
                const u1 = t.streamer_id;
                const u2 = value.streamer_id;
                return (
                    u1 === u2
                )
            })
        );
    }
}
