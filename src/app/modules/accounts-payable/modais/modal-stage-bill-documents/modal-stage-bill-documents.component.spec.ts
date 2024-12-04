import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStageBillDocumentsComponent } from './modal-stage-bill-documents.component';

describe('ModalStageBillDocumentsComponent', () => {
  let component: ModalStageBillDocumentsComponent;
  let fixture: ComponentFixture<ModalStageBillDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalStageBillDocumentsComponent]
    });
    fixture = TestBed.createComponent(ModalStageBillDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
