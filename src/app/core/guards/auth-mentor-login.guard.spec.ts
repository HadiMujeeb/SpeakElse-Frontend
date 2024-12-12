import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authMentorLoginGuard } from './auth-mentor-login.guard';

describe('authMentorLoginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authMentorLoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
