import { TestBed } from '@angular/core/testing';

import { MentorDashboardService } from './mentor-dashboard.service';

describe('MentorDashboardService', () => {
  let service: MentorDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MentorDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
