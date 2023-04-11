import { TestBed, inject } from '@angular/core/testing';

import { ClientserviceService } from './clientservice.service';

describe('ClientserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientserviceService]
    });
  });

  it('should ...', inject([ClientserviceService], (service: ClientserviceService) => {
    expect(service).toBeTruthy();
  }));
});
