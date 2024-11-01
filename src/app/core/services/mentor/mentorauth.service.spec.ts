import { TestBed } from '@angular/core/testing';

import { MentorauthService } from './mentorauth.service';

describe('MentorauthService', () => {
  let service: MentorauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MentorauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
