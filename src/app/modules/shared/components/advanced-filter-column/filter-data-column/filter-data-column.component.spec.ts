import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDataColumnComponent } from './filter-data-column.component';

describe('FilterDataColumnComponent', () => {
  let component: FilterDataColumnComponent;
  let fixture: ComponentFixture<FilterDataColumnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterDataColumnComponent]
    });
    fixture = TestBed.createComponent(FilterDataColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
