import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailsStatusComponent } from './modal-details-status.component';

describe('ModalDetailsStatusComponent', () => {
  let component: ModalDetailsStatusComponent;
  let fixture: ComponentFixture<ModalDetailsStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDetailsStatusComponent]
    });
    fixture = TestBed.createComponent(ModalDetailsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
