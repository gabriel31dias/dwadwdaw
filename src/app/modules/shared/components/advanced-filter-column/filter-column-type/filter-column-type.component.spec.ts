import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterColumnTypeComponent } from './filter-column-type.component';

describe('FilterColumnTypeComponent', () => {
  let component: FilterColumnTypeComponent;
  let fixture: ComponentFixture<FilterColumnTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterColumnTypeComponent]
    });
    fixture = TestBed.createComponent(FilterColumnTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
