import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMultipleDropdownComponent } from './custom-multiple-dropdown.component';

describe('CustomMultipleDropdownComponent', () => {
  let component: CustomMultipleDropdownComponent;
  let fixture: ComponentFixture<CustomMultipleDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomMultipleDropdownComponent]
    });
    fixture = TestBed.createComponent(CustomMultipleDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
