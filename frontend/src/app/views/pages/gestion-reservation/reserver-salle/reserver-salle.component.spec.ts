import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserverSalleComponent } from './reserver-salle.component';

describe('ReserverSalleComponent', () => {
  let component: ReserverSalleComponent;
  let fixture: ComponentFixture<ReserverSalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReserverSalleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReserverSalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
