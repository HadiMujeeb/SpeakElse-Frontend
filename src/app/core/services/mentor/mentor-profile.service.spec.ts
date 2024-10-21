import { TestBed } from '@angular/core/testing';

import { MentorProfileService } from './mentor-profile.service';

describe('MentorProfileService', () => {
  let service: MentorProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MentorProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
