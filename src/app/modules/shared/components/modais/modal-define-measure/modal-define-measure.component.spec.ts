import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDefineMeasureComponent } from './modal-define-measure.component';

describe('ModalDefineMeasureComponent', () => {
  let component: ModalDefineMeasureComponent;
  let fixture: ComponentFixture<ModalDefineMeasureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDefineMeasureComponent]
    });
    fixture = TestBed.createComponent(ModalDefineMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
