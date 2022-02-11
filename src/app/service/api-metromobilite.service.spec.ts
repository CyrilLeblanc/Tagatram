import { TestBed } from '@angular/core/testing';

import { ApiMetromobiliteService } from './api-metromobilite.service';

describe('ApiMetromobiliteService', () => {
  let service: ApiMetromobiliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiMetromobiliteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
