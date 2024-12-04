import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReverseBillComponent } from './modal-reverse-bill.component';

describe('ModalReverseBillComponent', () => {
  let component: ModalReverseBillComponent;
  let fixture: ComponentFixture<ModalReverseBillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalReverseBillComponent]
    });
    fixture = TestBed.createComponent(ModalReverseBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
