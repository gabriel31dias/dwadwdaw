import { TestBed } from '@angular/core/testing';

import { PendingDocumentService } from './pending-document.service';

describe('PendingDocumentService', () => {
  let service: PendingDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
