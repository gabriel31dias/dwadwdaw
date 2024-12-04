import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDownloadCollectionComponent } from './modal-download-collection.component';

describe('ModalDownloadCollectionComponent', () => {
  let component: ModalDownloadCollectionComponent;
  let fixture: ComponentFixture<ModalDownloadCollectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDownloadCollectionComponent]
    });
    fixture = TestBed.createComponent(ModalDownloadCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
