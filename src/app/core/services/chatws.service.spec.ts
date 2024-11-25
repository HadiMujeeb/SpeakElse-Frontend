import { TestBed } from '@angular/core/testing';

import { ChatwsService } from './chatws.service';

describe('ChatwsService', () => {
  let service: ChatwsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatwsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
