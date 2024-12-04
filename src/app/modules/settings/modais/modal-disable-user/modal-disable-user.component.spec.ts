import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDisableUserComponent } from './modal-disable-user.component';

describe('ModalDisableUserComponent', () => {
  let component: ModalDisableUserComponent;
  let fixture: ComponentFixture<ModalDisableUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDisableUserComponent]
    });
    fixture = TestBed.createComponent(ModalDisableUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
