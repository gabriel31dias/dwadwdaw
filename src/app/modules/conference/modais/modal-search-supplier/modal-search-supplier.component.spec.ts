import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSearchSupplierComponent } from './modal-search-supplier.component';

describe('ModalSearchSupplierComponent', () => {
  let component: ModalSearchSupplierComponent;
  let fixture: ComponentFixture<ModalSearchSupplierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSearchSupplierComponent]
    });
    fixture = TestBed.createComponent(ModalSearchSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
