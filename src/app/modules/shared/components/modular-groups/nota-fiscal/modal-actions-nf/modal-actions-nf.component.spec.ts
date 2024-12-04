import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalActionsNfComponent } from './modal-actions-nf.component';

describe('ModalActionsNfComponent', () => {
  let component: ModalActionsNfComponent;
  let fixture: ComponentFixture<ModalActionsNfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalActionsNfComponent]
    });
    fixture = TestBed.createComponent(ModalActionsNfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
