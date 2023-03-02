import { TestBed } from '@angular/core/testing';

import { UsersInterceptor } from './users.interceptor';

describe('LoggingInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      UsersInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: UsersInterceptor = TestBed.inject(UsersInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
