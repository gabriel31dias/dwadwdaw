import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDinamicGridComponent } from './table-dinamic-grid.component';

describe('TableDinamicGridComponent', () => {
  let component: TableDinamicGridComponent;
  let fixture: ComponentFixture<TableDinamicGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableDinamicGridComponent]
    });
    fixture = TestBed.createComponent(TableDinamicGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
