import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableGridSecondaryComponent } from './table-grid-secondary.component';

describe('TableGridSecondaryComponent', () => {
  let component: TableGridSecondaryComponent;
  let fixture: ComponentFixture<TableGridSecondaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableGridSecondaryComponent]
    });
    fixture = TestBed.createComponent(TableGridSecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
