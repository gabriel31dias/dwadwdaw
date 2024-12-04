import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIncludeSupplierComponent } from './modal-include-supplier.component';

describe('ModalIncludeSupplierComponent', () => {
  let component: ModalIncludeSupplierComponent;
  let fixture: ComponentFixture<ModalIncludeSupplierComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalIncludeSupplierComponent]
    });
    fixture = TestBed.createComponent(ModalIncludeSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
