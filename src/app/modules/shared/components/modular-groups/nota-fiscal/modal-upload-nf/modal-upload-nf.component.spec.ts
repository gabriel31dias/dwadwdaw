import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUploadNfComponent } from './modal-upload-nf.component';

describe('ModalUploadNfComponent', () => {
  let component: ModalUploadNfComponent;
  let fixture: ComponentFixture<ModalUploadNfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalUploadNfComponent]
    });
    fixture = TestBed.createComponent(ModalUploadNfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
