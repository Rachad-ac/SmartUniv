import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlanningComponent } from './edit-planning.component';

describe('EditPlanningComponent', () => {
  let component: EditPlanningComponent;
  let fixture: ComponentFixture<EditPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPlanningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
