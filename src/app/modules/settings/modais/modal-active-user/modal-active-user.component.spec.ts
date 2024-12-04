import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalActiveUserComponent } from './modal-active-user.component';

describe('ModalActiveUserComponent', () => {
  let component: ModalActiveUserComponent;
  let fixture: ComponentFixture<ModalActiveUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalActiveUserComponent]
    });
    fixture = TestBed.createComponent(ModalActiveUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
