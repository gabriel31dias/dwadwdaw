import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDataMoreComponent } from './filter-data-more.component';

describe('FilterDataMoreComponent', () => {
  let component: FilterDataMoreComponent;
  let fixture: ComponentFixture<FilterDataMoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilterDataMoreComponent]
    });
    fixture = TestBed.createComponent(FilterDataMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
