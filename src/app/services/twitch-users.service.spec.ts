import { TestBed } from '@angular/core/testing';

import { TwitchUsersService } from './twitch-users.service';

describe('TwitchUsersService', () => {
  let service: TwitchUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwitchUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
