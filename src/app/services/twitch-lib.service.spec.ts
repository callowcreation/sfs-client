import { TestBed } from '@angular/core/testing';

import { TwitchLibService } from './twitch-lib.service';

describe('TwitchLibService', () => {
  let service: TwitchLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwitchLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
