import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReceivableComponent } from './list-receivable.component';

describe('ListReceivableComponent', () => {
  let component: ListReceivableComponent;
  let fixture: ComponentFixture<ListReceivableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListReceivableComponent]
    });
    fixture = TestBed.createComponent(ListReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
