import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCheckboxInputComponent } from './custom-checkbox-input.component';

describe('CustomCheckboxInputComponent', () => {
  let component: CustomCheckboxInputComponent;
  let fixture: ComponentFixture<CustomCheckboxInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomCheckboxInputComponent]
    });
    fixture = TestBed.createComponent(CustomCheckboxInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
