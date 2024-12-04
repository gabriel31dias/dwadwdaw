import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomUniqueDropdownComponent } from './custom-unique-dropdown.component';

describe('CustomUniqueDropdownComponent', () => {
  let component: CustomUniqueDropdownComponent;
  let fixture: ComponentFixture<CustomUniqueDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomUniqueDropdownComponent]
    });
    fixture = TestBed.createComponent(CustomUniqueDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
