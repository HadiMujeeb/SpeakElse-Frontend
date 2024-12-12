import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authMentorGuard } from './auth-mentor.guard';

describe('authMentorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authMentorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
