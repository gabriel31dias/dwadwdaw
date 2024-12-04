import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIncludeClientComponent } from './modal-include-client.component';

describe('ModalIncludeClientComponent', () => {
  let component: ModalIncludeClientComponent;
  let fixture: ComponentFixture<ModalIncludeClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalIncludeClientComponent]
    });
    fixture = TestBed.createComponent(ModalIncludeClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
