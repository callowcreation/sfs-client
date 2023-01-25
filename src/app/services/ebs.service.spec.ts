import { TestBed } from '@angular/core/testing';

import { EBSService } from './ebs.service';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('EBSService', () => {

	beforeEach(() => TestBed.configureTestingModule({
		imports: [HttpClientTestingModule],
		providers: [EBSService, HttpClientModule]
	}));

	it('should be created', () => {
		const service: EBSService = TestBed.get(EBSService);
		expect(service).toBeTruthy();
	});

	it('should have getSettingsData function', () => {
		const service: EBSService = TestBed.get(EBSService);
		expect(service.getSettings).toBeTruthy();
	});

	it('should have getShoutoutsData function', () => {
		const service: EBSService = TestBed.get(EBSService);
		expect(service.getShoutouts).toBeTruthy();
	});
	/*it('#getSettingsData should return value from observable', done => {
		const service: EBSService = TestBed.get(EBSService);
		const token: string = "";
		const settingsObs = service.getSettingsData(token);
		settingsObs.subscribe(settings => {
			expect(settings.color).toBe('#FFFFFF');
			done();
		});
	});*/
});
