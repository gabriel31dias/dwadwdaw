import { TestBed } from '@angular/core/testing';

import { WebsocketPrinterService } from './websocket-printer.service';

describe('WebsocketPrinterService', () => {
  let service: WebsocketPrinterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketPrinterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
