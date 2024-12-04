import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodTwoDatesComponent } from './period-two-dates.component';

describe('PeriodTwoDatesComponent', () => {
  let component: PeriodTwoDatesComponent;
  let fixture: ComponentFixture<PeriodTwoDatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeriodTwoDatesComponent]
    });
    fixture = TestBed.createComponent(PeriodTwoDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
