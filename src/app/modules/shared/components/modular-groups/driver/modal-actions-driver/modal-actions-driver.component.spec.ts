import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalActionsDriverComponent } from './modal-actions-driver.component';

describe('ModalActionsDriverComponent', () => {
  let component: ModalActionsDriverComponent;
  let fixture: ComponentFixture<ModalActionsDriverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalActionsDriverComponent]
    });
    fixture = TestBed.createComponent(ModalActionsDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
