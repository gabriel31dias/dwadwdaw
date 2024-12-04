import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailsChangeComponent } from './modal-details-change.component';

describe('ModalDetailsChangeComponent', () => {
  let component: ModalDetailsChangeComponent;
  let fixture: ComponentFixture<ModalDetailsChangeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDetailsChangeComponent]
    });
    fixture = TestBed.createComponent(ModalDetailsChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
