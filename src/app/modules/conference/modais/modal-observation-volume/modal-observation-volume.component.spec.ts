import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalObservationVolumeComponent } from './modal-observation-volume.component';

describe('ModalObservationVolumeComponent', () => {
  let component: ModalObservationVolumeComponent;
  let fixture: ComponentFixture<ModalObservationVolumeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalObservationVolumeComponent]
    });
    fixture = TestBed.createComponent(ModalObservationVolumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
