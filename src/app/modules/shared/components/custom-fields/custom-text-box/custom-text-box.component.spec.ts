import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTextBoxComponent } from './custom-text-box.component';

describe('CustomTextBoxComponent', () => {
  let component: CustomTextBoxComponent;
  let fixture: ComponentFixture<CustomTextBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomTextBoxComponent]
    });
    fixture = TestBed.createComponent(CustomTextBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
