import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { formAdminGuard } from './form-admin.guard';

describe('formAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => formAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
