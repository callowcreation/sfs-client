import { TestBed } from '@angular/core/testing';

import { GuestDataService } from './guest-data.service';

describe('GuestDataService', () => {
  let service: GuestDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuestDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
