import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSearchNfComponent } from './modal-search-nf.component';

describe('ModalSearchNfComponent', () => {
  let component: ModalSearchNfComponent;
  let fixture: ComponentFixture<ModalSearchNfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSearchNfComponent]
    });
    fixture = TestBed.createComponent(ModalSearchNfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
