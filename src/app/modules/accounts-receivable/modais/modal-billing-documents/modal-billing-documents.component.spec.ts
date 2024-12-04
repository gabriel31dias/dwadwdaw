import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBillingDocumentsComponent } from './modal-billing-documents.component';

describe('ModalBillingDocumentsComponent', () => {
  let component: ModalBillingDocumentsComponent;
  let fixture: ComponentFixture<ModalBillingDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalBillingDocumentsComponent]
    });
    fixture = TestBed.createComponent(ModalBillingDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
