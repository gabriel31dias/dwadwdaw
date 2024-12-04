import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGenerateTitleComponent } from './modal-generate-title.component';

describe('ModalGenerateTitleComponent', () => {
  let component: ModalGenerateTitleComponent;
  let fixture: ComponentFixture<ModalGenerateTitleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalGenerateTitleComponent]
    });
    fixture = TestBed.createComponent(ModalGenerateTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
