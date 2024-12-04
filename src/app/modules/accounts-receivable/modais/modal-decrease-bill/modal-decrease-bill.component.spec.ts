import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDecreaseBillComponent } from './modal-decrease-bill.component';

describe('ModalDecreaseBillComponent', () => {
  let component: ModalDecreaseBillComponent;
  let fixture: ComponentFixture<ModalDecreaseBillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalDecreaseBillComponent]
    });
    fixture = TestBed.createComponent(ModalDecreaseBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
