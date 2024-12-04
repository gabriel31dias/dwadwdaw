import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSendEmailMultipleComponent } from './modal-send-email-multiple.component';

describe('ModalSendEmailMultipleComponent', () => {
  let component: ModalSendEmailMultipleComponent;
  let fixture: ComponentFixture<ModalSendEmailMultipleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSendEmailMultipleComponent]
    });
    fixture = TestBed.createComponent(ModalSendEmailMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
