import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomNumericInputComponent } from './custom-numeric-input.component';

describe('CustomNumericInputComponent', () => {
  let component: CustomNumericInputComponent;
  let fixture: ComponentFixture<CustomNumericInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomNumericInputComponent]
    });
    fixture = TestBed.createComponent(CustomNumericInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
