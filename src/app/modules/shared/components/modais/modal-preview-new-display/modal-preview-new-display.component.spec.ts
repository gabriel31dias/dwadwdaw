import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPreviewNewDisplayComponent } from './modal-preview-new-display.component';

describe('ModalPreviewNewDisplayComponent', () => {
  let component: ModalPreviewNewDisplayComponent;
  let fixture: ComponentFixture<ModalPreviewNewDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalPreviewNewDisplayComponent]
    });
    fixture = TestBed.createComponent(ModalPreviewNewDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
