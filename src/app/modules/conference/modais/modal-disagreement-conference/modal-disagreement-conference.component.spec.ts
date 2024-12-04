import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDisagreementConferenceComponent } from './modal-disagreement-conference.component';

describe('ModalDisagreementConferenceComponent', () => {
  let component: ModalDisagreementConferenceComponent;
  let fixture: ComponentFixture<ModalDisagreementConferenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDisagreementConferenceComponent]
    });
    fixture = TestBed.createComponent(ModalDisagreementConferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
