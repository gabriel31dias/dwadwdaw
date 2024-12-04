import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRemoveUserGroupPermissionComponent } from './modal-remove-user-group-permission.component';

describe('ModalRemoveUserGroupPermissionComponent', () => {
  let component: ModalRemoveUserGroupPermissionComponent;
  let fixture: ComponentFixture<ModalRemoveUserGroupPermissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalRemoveUserGroupPermissionComponent]
    });
    fixture = TestBed.createComponent(ModalRemoveUserGroupPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
