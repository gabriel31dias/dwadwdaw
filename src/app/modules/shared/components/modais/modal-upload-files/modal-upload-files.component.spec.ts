import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUploadFilesComponent } from './modal-upload-files.component';

describe('ModalUploadFilesComponent', () => {
  let component: ModalUploadFilesComponent;
  let fixture: ComponentFixture<ModalUploadFilesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalUploadFilesComponent]
    });
    fixture = TestBed.createComponent(ModalUploadFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
