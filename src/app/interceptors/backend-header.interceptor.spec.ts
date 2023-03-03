import { TestBed } from '@angular/core/testing';

import { BackendHeaderInterceptor } from './backend-header.interceptor';

describe('BackendHeaderInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      BackendHeaderInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: BackendHeaderInterceptor = TestBed.inject(BackendHeaderInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
