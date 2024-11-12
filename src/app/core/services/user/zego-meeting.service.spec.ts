import { TestBed } from '@angular/core/testing';

import { ZegoMeetingService } from './zego-meeting.service';

describe('ZegoMeetingService', () => {
  let service: ZegoMeetingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZegoMeetingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
