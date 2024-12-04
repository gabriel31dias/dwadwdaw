import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSendEmailSingleComponent } from './modal-send-email-single.component';

describe('ModalSendEmailSingleComponent', () => {
  let component: ModalSendEmailSingleComponent;
  let fixture: ComponentFixture<ModalSendEmailSingleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSendEmailSingleComponent]
    });
    fixture = TestBed.createComponent(ModalSendEmailSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
