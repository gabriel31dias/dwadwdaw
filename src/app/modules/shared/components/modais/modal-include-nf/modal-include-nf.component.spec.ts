import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIncludeNfComponent } from './modal-include-nf.component';

describe('ModalIncludeNfComponent', () => {
  let component: ModalIncludeNfComponent;
  let fixture: ComponentFixture<ModalIncludeNfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalIncludeNfComponent]
    });
    fixture = TestBed.createComponent(ModalIncludeNfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
