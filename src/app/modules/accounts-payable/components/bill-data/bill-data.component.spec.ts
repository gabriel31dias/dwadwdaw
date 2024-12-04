import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillDataComponent } from './bill-data.component';

describe('BillDataComponent', () => {
  let component: BillDataComponent;
  let fixture: ComponentFixture<BillDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BillDataComponent]
    });
    fixture = TestBed.createComponent(BillDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
