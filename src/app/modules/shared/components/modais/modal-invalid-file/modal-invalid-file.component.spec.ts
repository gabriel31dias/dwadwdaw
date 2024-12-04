import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInvalidFileComponent } from './modal-invalid-file.component';

describe('ModalInvalidFileComponent', () => {
  let component: ModalInvalidFileComponent;
  let fixture: ComponentFixture<ModalInvalidFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalInvalidFileComponent]
    });
    fixture = TestBed.createComponent(ModalInvalidFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
