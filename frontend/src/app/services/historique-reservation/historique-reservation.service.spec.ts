import { TestBed } from '@angular/core/testing';

import { HistoriqueReservationService } from './historique-reservation.service';

describe('HistoriqueReservationService', () => {
  let service: HistoriqueReservationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriqueReservationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
