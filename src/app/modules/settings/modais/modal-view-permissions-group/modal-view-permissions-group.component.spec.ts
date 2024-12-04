import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalViewPermissionsGroupComponent } from './modal-view-permissions-group.component';

describe('ModalViewPermissionsGroupComponent', () => {
  let component: ModalViewPermissionsGroupComponent;
  let fixture: ComponentFixture<ModalViewPermissionsGroupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalViewPermissionsGroupComponent]
    });
    fixture = TestBed.createComponent(ModalViewPermissionsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
