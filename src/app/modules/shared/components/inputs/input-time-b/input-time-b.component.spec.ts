import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTimeBComponent } from './input-time-b.component';

describe('InputTimeBComponent', () => {
  let component: InputTimeBComponent;
  let fixture: ComponentFixture<InputTimeBComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputTimeBComponent]
    });
    fixture = TestBed.createComponent(InputTimeBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
