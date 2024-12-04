import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfiguredAutomaticRoutinesComponent } from './modal-configured-automatic-routines.component';

describe('ModalConfiguredAutomaticRoutinesComponent', () => {
  let component: ModalConfiguredAutomaticRoutinesComponent;
  let fixture: ComponentFixture<ModalConfiguredAutomaticRoutinesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalConfiguredAutomaticRoutinesComponent]
    });
    fixture = TestBed.createComponent(ModalConfiguredAutomaticRoutinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
