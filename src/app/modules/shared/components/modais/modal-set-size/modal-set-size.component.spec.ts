import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSetSizeComponent } from './modal-set-size.component';

describe('ModalSetSizeComponent', () => {
  let component: ModalSetSizeComponent;
  let fixture: ComponentFixture<ModalSetSizeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSetSizeComponent]
    });
    fixture = TestBed.createComponent(ModalSetSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
