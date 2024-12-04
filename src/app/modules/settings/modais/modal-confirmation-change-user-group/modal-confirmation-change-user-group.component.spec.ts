import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmationChangeUserGroupComponent } from './modal-confirmation-change-user-group.component';

describe('ModalConfirmationChangeUserGroupComponent', () => {
  let component: ModalConfirmationChangeUserGroupComponent;
  let fixture: ComponentFixture<ModalConfirmationChangeUserGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalConfirmationChangeUserGroupComponent]
    });
    fixture = TestBed.createComponent(ModalConfirmationChangeUserGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
