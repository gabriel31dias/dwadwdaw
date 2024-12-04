import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChangePhotoUserComponent } from './modal-change-photo-user.component';

describe('ModalChangePhotoUserComponent', () => {
  let component: ModalChangePhotoUserComponent;
  let fixture: ComponentFixture<ModalChangePhotoUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalChangePhotoUserComponent]
    });
    fixture = TestBed.createComponent(ModalChangePhotoUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
