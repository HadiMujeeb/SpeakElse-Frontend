import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { formAccessGuard } from './form-access.guard';

describe('formAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => formAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
