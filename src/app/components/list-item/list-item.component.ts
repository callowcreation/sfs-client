import { Component, Input, Output, EventEmitter } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

import { ShoutoutItem } from '../shoutouts-items-list/ShoutoutItem';
import { TwitchLibService } from '../../services/twitch-lib.service';
import { EBSService } from '../../services/ebs.service';
import { environment } from '../../../environments/environment';
import { Authorized, TransactionObject, TransactionPayload } from 'src/app/shared/interfaces';
import { Cooldowns } from '../shoutouts-items-list/shoutouts-items-list.component';
import bitsTierOptions from 'src/app/shared/bits-tier-options';
import { LocalStorageService } from 'src/app/services/local-storage.service';

function getTransactionDev(sku: string): TransactionObject {
	return {
		product: {
			cost: {
				amount: '1',
				type: 'bits'
			},
			displayName: '',
			inDevelopment: true,
			sku: sku
		},
		transactionId: '',
		userId: '',
		displayName: '',
		initiator: '',
		transactionReceipt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b3BpYyI6ImJpdHNfdHJhbnNhY3Rpb25fcmVjZWlwdCIsImV4cCI6MTY0ODI3NDMyNSwiZGF0YSI6eyJ0cmFuc2FjdGlvbklkIjoiZjAzNTEwYWYtYTM3Zi00MGY4LWI5NmMtOWI4YzkzNTNmZmJkIiwidGltZSI6IjIwMjItMDMtMjYgMDQ6NTg6NDUuMDQ3NjgxMzc1ICswMDAwIFVUQyBtPSsxOTcyMy43ODgxNzcyNzQiLCJ1c2VySWQiOiI3NTk4NzE5NyIsInByb2R1Y3QiOnsiZG9tYWluSWQiOiJ0d2l0Y2guZXh0LjBnaHAxd2Z6aTdoZHAxNDRicHdhZ2g5cTg2eGprZyIsInNrdSI6Im1vdmUtdXAtMTAiLCJkaXNwbGF5TmFtZSI6Ik1vdmUgVXAgKGZvciB0ZXN0aW5nKSIsImNvc3QiOnsiYW1vdW50IjoxLCJ0eXBlIjoiYml0cyJ9fX19.gMEK4rViwbylvR6LNvbj8ObOjDVG8M_JGCuOfqG2fXA",
	};
}

@Component({
	selector: 'app-list-item',
	animations: [
		trigger('removeTrigger', [
			transition(':enter', [
				style({
					opacity: 0,
					'transform-origin': 'bottom left',
					transform: 'scale(0, 0)'
				}),
				animate('0.4s', style({
					opacity: 1,
					'transform-origin': 'bottom left',
					transform: 'scale(1, 1)'
				})),
			]),
			transition(':leave', [
				animate('0.6s', style({
					opacity: 0,
					'transform-origin': 'bottom left',
					transform: 'scale(0, 0)'
				}))
			])
		])
	],
	templateUrl: './list-item.component.html',
	styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent {

	@Output() moveUpTransactionCallback = new EventEmitter();
	@Output() moveUpTransactionCancelled = new EventEmitter();

	@Output() pinToTopTransactionCallback = new EventEmitter();
	@Output() pinToTopTransactionCancelled = new EventEmitter();

	@Input() auth: Authorized;

	@Input() isBroadcaster: boolean;

	@Input() color: string;

	@Input() backgroundColor: string;

	@Input() borderColor: string;

	@Input() enableBits: boolean;

	@Input() bitsTier: string;

	@Input() shoutoutItem: ShoutoutItem;

	@Input() cooldowns: Cooldowns;

	isVisibleItem = true;

	showConfirmRemove = false;

    pinDays: number = 3;

	constructor(private twitchLibService: TwitchLibService, private ebsService: EBSService, private localStorageService: LocalStorageService) { }

    private getSkuTierFromLocalStorage() {
        const skuName = this.localStorageService.loadSettings(this.auth.channelId)['bits-tier'] || bitsTierOptions[0].name;
        const sku = bitsTierOptions.find(x => x.name === skuName);
        return sku;
    }

	openConfirmRemoveCallback(): void {
        this.showConfirmRemove = true;
	}

	closeConfirmRemoveCallback(): void {
        this.showConfirmRemove = false;
	}

	removeCallback(username: string): void {
		this.ebsService.postDelete(this.auth.token, username).subscribe();
		this.isVisibleItem = false;
        this.showConfirmRemove = false;
	}

	mouseOverCallback(action) {

        this.pinDays = +this.localStorageService.loadSettings(this.auth.channelId)['pin-days'];

		console.log(`${action} mouseover callback start`);

		const { bits } = this.twitchLibService;

		bits.showBitsBalance();
	}

	moveUpCallback(username: string): void {
		if (this.shoutoutItem.moveUp.enabled === false || this.enableBits === false) {
			console.log(`${username} move up disabled`);
			return;
		}

		this.moveUpTransactionCallback.emit();

		console.log(`${username} move up callback start`);

		this.shoutoutItem.moveUp.enabled = false;

		const { bits } = this.twitchLibService;

		bits.setUserLoopBack = true; // used to stop bit transaction from using my bits when testing

		if (environment.production) {
			bits.onTransactionCancelled(() => {
				console.log('Transaction move up was cancelled');
				this.moveUpTransactionCancelled.emit();
			});

			bits.onTransactionComplete((transaction: TransactionObject) => {
				console.log(transaction);
				const transactionData: TransactionPayload = {
					transaction,
					username
				};
				/*const message = {
					transactionResponse: {
						type: 'move-up',
						username,
						posted_by: this.shoutoutItem.posted_by,
						timestamp: Date.now()
					},
					environment: 'prod',
					version: '0.3.1'
				};
				console.log(`Sending Move Up Transaction Complete`, { message });
				this.twitchLibService.send(message);*/

				this.ebsService.postMoveUp(this.auth.token, transactionData).subscribe();
			});

			const sku = this.getSkuTierFromLocalStorage();
			bits.useBits(sku.skus.moveUp);

			console.log(`${username} move up callback usebits production`);
		} else {
            
			const sku = this.getSkuTierFromLocalStorage();

			console.log(`${username} move up callback usebits tier ${sku.skus.moveUp} dev`);

			const transactionData: TransactionPayload = {
				transaction: getTransactionDev(sku.skus.moveUp),
				username
			};
			/*const message = {
				transactionResponse: {
					type: 'move-up',
					username,
					posted_by: this.shoutoutItem.posted_by,
					timestamp: Date.now()
				},
				environment: 'dev',
				version: '0.3.1'
			};
			console.log(`Sending Move Up Transaction Complete`, { message });
			this.twitchLibService.send(message);*/
			setTimeout(() => {
				this.ebsService.postMoveUp(this.auth.token, transactionData).subscribe();
				//this.moveUpTransactionCancelled.emit();
			}, 500);
		}
	}

	pinToTopCallback(username: string): void {
		if (this.shoutoutItem.pinToTop.enabled === false || this.enableBits === false) {
			console.log(`${username} pin to top disabled`);
			return;
		}

		this.pinToTopTransactionCallback.emit();

		console.log(`${username} pin to top callback start`);

		const { bits } = this.twitchLibService;

		bits.setUserLoopBack = true; // used to stop bit transaction from using my bits when testing

		if (environment.production) {
			bits.onTransactionCancelled(() => {
				console.log('Transaction pin to top was cancelled');
				this.pinToTopTransactionCancelled.emit();
			});

			bits.onTransactionComplete((transaction: TransactionObject) => {
				console.log(transaction);
				const transactionData: TransactionPayload = {
					transaction,
					username
				};
				/*const message = {
					transactionResponse: {
						type: 'pin-item-10',
						username,
						posted_by: this.shoutoutItem.posted_by,
						timestamp: Date.now()
					},
					environment: 'prod',
					version: '0.3.1'
				};
				console.log(`Sending Pin to Top Transaction Complete`, { message });
				this.twitchLibService.send(message);*/

				this.ebsService.postPinToTop(this.auth.token, transactionData).subscribe();
			});

			const sku = this.getSkuTierFromLocalStorage();
			bits.useBits(sku.skus.pinToTop);

			console.log(`${username} pin to top callback usebits production`);
		} else {

			const sku = this.getSkuTierFromLocalStorage();
			console.log(`${username} pin to top callback usebits ${sku.skus.pinToTop} dev`);

			const transactionData: TransactionPayload = {
				transaction: getTransactionDev(sku.skus.pinToTop),
				username
			};

			/*const message = {
				transactionResponse: {
					type: 'pin-item-10',
					username,
					posted_by: this.shoutoutItem.posted_by,
					timestamp: Date.now()
				},
				environment: 'dev',
				version: '0.3.1'
			};
			console.log(`Sending Pin to Top Transaction Complete`, { message });
			this.twitchLibService.send(message);*/

			setTimeout(() => {
				this.ebsService.postPinToTop(this.auth.token, transactionData).subscribe();
				//this.pinToTopTransactionCancelled.emit();
			}, 500);
		}
	}
}
