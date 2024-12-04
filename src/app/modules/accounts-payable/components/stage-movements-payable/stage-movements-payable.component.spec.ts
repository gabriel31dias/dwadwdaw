import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageMovementsPayableComponent } from './stage-movements-payable.component';

describe('StageMovementsPayableComponent', () => {
  let component: StageMovementsPayableComponent;
  let fixture: ComponentFixture<StageMovementsPayableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StageMovementsPayableComponent]
    });
    fixture = TestBed.createComponent(StageMovementsPayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
