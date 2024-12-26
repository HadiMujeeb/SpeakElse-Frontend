import { TestBed } from '@angular/core/testing';

import { MentorWalletService } from './mentor-wallet.service';

describe('MentorWalletService', () => {
  let service: MentorWalletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MentorWalletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
