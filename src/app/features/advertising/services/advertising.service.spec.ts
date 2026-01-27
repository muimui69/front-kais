import { TestBed } from '@angular/core/testing';

import { AdvertisingService } from './advertising.service';

describe('AdvertisingService', () => {
  let service: AdvertisingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvertisingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
