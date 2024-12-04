import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChangePasswordComponent } from './modal-change-password.component';

describe('ModalChangePasswordComponent', () => {
  let component: ModalChangePasswordComponent;
  let fixture: ComponentFixture<ModalChangePasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalChangePasswordComponent]
    });
    fixture = TestBed.createComponent(ModalChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
