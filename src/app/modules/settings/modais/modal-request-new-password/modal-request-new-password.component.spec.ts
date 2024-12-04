import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRequestNewPasswordComponent } from './modal-request-new-password.component';

describe('ModalRequestNewPasswordComponent', () => {
  let component: ModalRequestNewPasswordComponent;
  let fixture: ComponentFixture<ModalRequestNewPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalRequestNewPasswordComponent]
    });
    fixture = TestBed.createComponent(ModalRequestNewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
