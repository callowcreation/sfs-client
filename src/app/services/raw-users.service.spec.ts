import { TestBed } from '@angular/core/testing';

import { RawUsersService } from './raw-users.service';

describe('RawUsersService', () => {
  let service: RawUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RawUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
