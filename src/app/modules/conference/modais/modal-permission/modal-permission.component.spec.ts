import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPermissionComponent } from './modal-permission.component';

describe('ModalPermissionComponent', () => {
  let component: ModalPermissionComponent;
  let fixture: ComponentFixture<ModalPermissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPermissionComponent]
    });
    fixture = TestBed.createComponent(ModalPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
