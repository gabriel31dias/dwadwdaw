import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPeriodComponent } from './input-period.component';

describe('InputPeriodComponent', () => {
  let component: InputPeriodComponent;
  let fixture: ComponentFixture<InputPeriodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputPeriodComponent]
    });
    fixture = TestBed.createComponent(InputPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
