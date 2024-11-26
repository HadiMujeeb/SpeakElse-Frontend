import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authAdminLoginGuard } from './auth-admin-login.guard';

describe('authAdminLoginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authAdminLoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
