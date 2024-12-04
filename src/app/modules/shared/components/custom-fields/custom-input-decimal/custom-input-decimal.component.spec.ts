import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomInputDecimalComponent } from './custom-input-decimal.component';

describe('CustomInputDecimalComponent', () => {
  let component: CustomInputDecimalComponent;
  let fixture: ComponentFixture<CustomInputDecimalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomInputDecimalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomInputDecimalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
