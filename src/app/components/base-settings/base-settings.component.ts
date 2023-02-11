import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TwitchLibService } from '../../services/twitch-lib.service';
import bitsTierOptions from 'src/app/shared/bits-tier-options';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-base-settings',
    animations: [
        trigger('tierChangedTrigger', [
            transition('* <=> *', [
                style({
                    opacity: 1,
                }),
                animate('0.25s ease', style({
                    opacity: 0
                })),
                animate('0.25s', style({
                    opacity: 1
                }))
            ])
        ])
    ],
    templateUrl: './base-settings.component.html',
    styleUrls: ['./base-settings.component.scss']
})
export class BaseSettingsComponent {

    @Input() public backgroundColor: string;
    @Input() public color: string;
    @Input() public borderColor: string;

    @Input() public autoShoutouts: boolean;

    @Input() public enableBits: boolean;
    @Input() public bitsTier: string;
    @Input() public pinDays: number;

    @Input() public isConfig: boolean;

    @Output() changeEvent = new EventEmitter<any>();

    moveUpBitsAmount = 0;
    pinToTopBitsAmount = 0;

    public options: string[] = bitsTierOptions.map(x => x.name);

    constructor(private twitchLibService: TwitchLibService) {
        const { broadcast$ } = twitchLibService;

        this.setBitsAmounts();

        broadcast$.subscribe(obj => {
            //console.log({ broadcastBaseSettingsComponent: obj.settingsResponse.settings['bits-tier'] });
            this.setBitsAmounts();
        });
    }

    settingChange(key: string, value: string | boolean | number): void {
        this.changeEvent.emit({ settings: { [`${key}`]: value } });
    }

    setBitsAmounts(): void {

        const { bits } = this.twitchLibService;

        bits.getProducts().then(products => {
            //console.log({ bitsBaseSettingsComponent: products, bitsTier: this.bitsTier });

            //const sku = products.find(x => x.sku === skuName);

            const moveUpAmount: any[] = [];
            const pinToTopAmount: any[] = [];

            moveUpAmount['Tier 1'] = products.find(x => x.sku === 'move-up-t1').cost.amount;
            moveUpAmount['Tier 2'] = products.find(x => x.sku === 'move-up-t2').cost.amount;
            moveUpAmount['Tier 3'] = products.find(x => x.sku === 'move-up-t3').cost.amount;

            pinToTopAmount['Tier 1'] = products.find(x => x.sku === 'pin-item-t1').cost.amount;
            pinToTopAmount['Tier 2'] = products.find(x => x.sku === 'pin-item-t2').cost.amount;
            pinToTopAmount['Tier 3'] = products.find(x => x.sku === 'pin-item-t3').cost.amount;

            this.moveUpBitsAmount = moveUpAmount[this.bitsTier];
            this.pinToTopBitsAmount = pinToTopAmount[this.bitsTier];
        });
    }

    moreSettings() {
        console.log('opening...')
        window.open('https://shoutoutsforstreamers.com/configuration');
    }
}
