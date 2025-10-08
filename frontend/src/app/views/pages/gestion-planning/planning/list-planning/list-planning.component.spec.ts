import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPlanningComponent } from './list-planning.component';

describe('ListPlanningComponent', () => {
  let component: ListPlanningComponent;
  let fixture: ComponentFixture<ListPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPlanningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
