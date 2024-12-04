import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOneLineTextInputComponent } from './custom-one-line-text-input.component';

describe('CustomOneLineTextInputComponent', () => {
  let component: CustomOneLineTextInputComponent;
  let fixture: ComponentFixture<CustomOneLineTextInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomOneLineTextInputComponent]
    });
    fixture = TestBed.createComponent(CustomOneLineTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
