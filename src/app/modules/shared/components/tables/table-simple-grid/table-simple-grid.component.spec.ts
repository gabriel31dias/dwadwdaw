import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSimpleGridComponent } from './table-simple-grid.component';

describe('TableSimpleGridComponent', () => {
  let component: TableSimpleGridComponent;
  let fixture: ComponentFixture<TableSimpleGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableSimpleGridComponent]
    });
    fixture = TestBed.createComponent(TableSimpleGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
