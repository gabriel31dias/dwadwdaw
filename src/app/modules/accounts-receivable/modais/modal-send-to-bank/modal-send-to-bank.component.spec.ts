import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSendToBankComponent } from './modal-send-to-bank.component';

describe('ModalSendToBankComponent', () => {
  let component: ModalSendToBankComponent;
  let fixture: ComponentFixture<ModalSendToBankComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSendToBankComponent]
    });
    fixture = TestBed.createComponent(ModalSendToBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
