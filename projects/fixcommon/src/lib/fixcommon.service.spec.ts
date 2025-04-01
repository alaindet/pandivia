import { TestBed } from '@angular/core/testing';

import { FixcommonService } from './fixcommon.service';

describe('FixcommonService', () => {
  let service: FixcommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixcommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
