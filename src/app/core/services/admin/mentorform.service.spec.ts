import { TestBed } from '@angular/core/testing';

import { MentorformService } from './mentorform.service';

describe('MentorformService', () => {
  let service: MentorformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MentorformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
