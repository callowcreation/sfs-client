import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Settings } from '../shared/interfaces';

const STORAGE_SETTINGS_KEY: string = 'local_settings';
const STORAGE_TRANSACTION_KEY: string = 'local_transaction';

@Injectable({
	providedIn: 'root'
})
export class LocalStorageService {

	constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

	private makeSettingsKey(channelId: string): string {
		return `${STORAGE_SETTINGS_KEY}_${channelId}`;
	}

	private makeTransactionKey(channelId: string): string {
		return `${STORAGE_TRANSACTION_KEY}_${channelId}`;
	}

	public storeSettings(channelId: string, settings: Settings): void {
		this.storage.set(this.makeSettingsKey(channelId), settings);
	}

	public loadSettings(channelId: string): Settings {
		return this.storage.get(this.makeSettingsKey(channelId));
	}

	public storeTransactionMoveUpExpires(channelId: string, expires: number): void {
		this.storage.set(this.makeTransactionKey(channelId), {'move_up_expires': expires});
	}

	public loadTransactionMoveUpExpires(channelId: string): number {
		return this.storage.get(this.makeTransactionKey(channelId));
	}

	public storeTransactionPinToTopExpires(channelId: string, expires: number): void {
		this.storage.set(this.makeTransactionKey(channelId), {'pin_to_top_expires': expires});
	}

	public loadTransactionPinToTopExpires(channelId: string): number {
		return this.storage.get(this.makeTransactionKey(channelId));
	}
}