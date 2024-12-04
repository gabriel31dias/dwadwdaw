import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalObservationComponent } from './modal-observation.component';

describe('ModalObservationComponent', () => {
  let component: ModalObservationComponent;
  let fixture: ComponentFixture<ModalObservationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalObservationComponent]
    });
    fixture = TestBed.createComponent(ModalObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
