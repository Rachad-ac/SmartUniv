import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListResevationComponent } from './list-resevation.component';

describe('ListResevationComponent', () => {
  let component: ListResevationComponent;
  let fixture: ComponentFixture<ListResevationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListResevationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListResevationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
