import { TestBed } from '@angular/core/testing';

import { AdPlanService } from './ad-plan.service';

describe('AdPlanService', () => {
  let service: AdPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
