import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownDefaultComponent } from './dropdown-default.component';

describe('DropdownDefaultComponent', () => {
  let component: DropdownDefaultComponent;
  let fixture: ComponentFixture<DropdownDefaultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownDefaultComponent]
    });
    fixture = TestBed.createComponent(DropdownDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
