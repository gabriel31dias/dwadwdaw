import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageMovementsComponent } from './stage-movements.component';

describe('StageMovementsComponent', () => {
  let component: StageMovementsComponent;
  let fixture: ComponentFixture<StageMovementsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StageMovementsComponent]
    });
    fixture = TestBed.createComponent(StageMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
