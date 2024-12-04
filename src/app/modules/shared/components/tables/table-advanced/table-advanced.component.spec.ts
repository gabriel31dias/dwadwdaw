import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableAdvancedComponent } from './table-advanced.component';

describe('TableAdvancedComponent', () => {
  let component: TableAdvancedComponent;
  let fixture: ComponentFixture<TableAdvancedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableAdvancedComponent]
    });
    fixture = TestBed.createComponent(TableAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
