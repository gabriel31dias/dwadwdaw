/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExhibitionsService } from './exhibitions.service';

describe('Service: Exhibitions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExhibitionsService]
    });
  });

  it('should ...', inject([ExhibitionsService], (service: ExhibitionsService) => {
    expect(service).toBeTruthy();
  }));
});
