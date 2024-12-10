import { TestBed } from '@angular/core/testing';

import { LanguageTestService } from './language-test.service';

describe('LanguageTestService', () => {
  let service: LanguageTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
