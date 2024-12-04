import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageCheckingInvoicesComponent } from './stage-checking-invoices.component';

describe('StageCheckingInvoicesComponent', () => {
  let component: StageCheckingInvoicesComponent;
  let fixture: ComponentFixture<StageCheckingInvoicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StageCheckingInvoicesComponent]
    });
    fixture = TestBed.createComponent(StageCheckingInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
