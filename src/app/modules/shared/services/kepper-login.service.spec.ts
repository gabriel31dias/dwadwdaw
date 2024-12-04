import { TestBed } from '@angular/core/testing';

import { KepperLoginService } from './kepper-login.service';

describe('KepperLoginService', () => {
  let service: KepperLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KepperLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
