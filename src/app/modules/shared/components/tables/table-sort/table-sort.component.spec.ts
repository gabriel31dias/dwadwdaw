import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSortComponent } from './table-sort.component';

describe('TableSortComponent', () => {
  let component: TableSortComponent;
  let fixture: ComponentFixture<TableSortComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableSortComponent]
    });
    fixture = TestBed.createComponent(TableSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
