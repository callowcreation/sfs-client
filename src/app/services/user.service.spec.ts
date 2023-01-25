import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('UserService', () => {

	beforeEach(() => TestBed.configureTestingModule({
		imports: [HttpClientTestingModule],
		providers: [UserService, HttpClientModule]
	}));

	it('should be created', () => {
		const service: UserService = TestBed.get(UserService);
		expect(service).toBeTruthy();
	});

	it('should have getUsers function', () => {
		const service: UserService = TestBed.get(UserService);
		expect(service.getUsers).toBeTruthy();
	});

});