import { TestBed } from '@angular/core/testing';

import { TokenHeaderInterceptor } from './token-header.interceptor';

describe('TokenHeaderInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TokenHeaderInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: TokenHeaderInterceptor = TestBed.inject(TokenHeaderInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
