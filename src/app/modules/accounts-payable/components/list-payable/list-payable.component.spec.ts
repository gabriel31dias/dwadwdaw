import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPayableComponent } from './list-payable.component';

describe('ListPayableComponent', () => {
  let component: ListPayableComponent;
  let fixture: ComponentFixture<ListPayableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListPayableComponent]
    });
    fixture = TestBed.createComponent(ListPayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
