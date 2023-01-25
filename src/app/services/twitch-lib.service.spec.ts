import { TestBed } from '@angular/core/testing';

import { TwitchLibService } from './twitch-lib.service';
import { WindowRef } from '../window-ref';

describe('TwitchLibService', () => {
	beforeEach(() => TestBed.configureTestingModule({
		providers: [WindowRef]
	}));

	it('should be created', () => {
		const service: TwitchLibService = TestBed.get(TwitchLibService);
		expect(service).toBeTruthy();
	});
});
