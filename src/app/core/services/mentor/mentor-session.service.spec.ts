import { TestBed } from '@angular/core/testing';

import { MentorSessionService } from './mentor-session.service';

describe('MentorSessionService', () => {
  let service: MentorSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MentorSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
