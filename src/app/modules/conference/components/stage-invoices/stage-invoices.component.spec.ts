import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageInvoicesComponent } from './stage-invoices.component';

describe('StageInvoicesComponent', () => {
  let component: StageInvoicesComponent;
  let fixture: ComponentFixture<StageInvoicesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StageInvoicesComponent]
    });
    fixture = TestBed.createComponent(StageInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
