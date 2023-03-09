import { TestBed } from '@angular/core/testing';

import { UncaughtErrorHandlerService } from './uncaught-error-handler.service';

describe('UncaughtErrorHandlerService', () => {
  let service: UncaughtErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UncaughtErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
