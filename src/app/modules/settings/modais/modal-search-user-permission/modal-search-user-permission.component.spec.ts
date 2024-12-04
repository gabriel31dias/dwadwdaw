import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSearchUserPermissionComponent } from './modal-search-user-permission.component';

describe('ModalSearchUserPermissionComponent', () => {
  let component: ModalSearchUserPermissionComponent;
  let fixture: ComponentFixture<ModalSearchUserPermissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSearchUserPermissionComponent]
    });
    fixture = TestBed.createComponent(ModalSearchUserPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
