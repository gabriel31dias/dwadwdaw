import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSendReceivableEmailComponent } from './modal-send-receivable-email.component';

describe('ModalSendReceivableEmailComponent', () => {
  let component: ModalSendReceivableEmailComponent;
  let fixture: ComponentFixture<ModalSendReceivableEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSendReceivableEmailComponent]
    });
    fixture = TestBed.createComponent(ModalSendReceivableEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
