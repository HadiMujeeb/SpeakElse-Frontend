import { TestBed } from '@angular/core/testing';

import { MemberMgmtService } from './member-mgmt.service';

describe('MemberMgmtService', () => {
  let service: MemberMgmtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemberMgmtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
