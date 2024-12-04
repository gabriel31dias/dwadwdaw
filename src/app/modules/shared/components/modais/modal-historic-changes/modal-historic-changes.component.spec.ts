import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHistoricChangesComponent } from './modal-historic-changes.component';

describe('ModalHistoricChangesComponent', () => {
  let component: ModalHistoricChangesComponent;
  let fixture: ComponentFixture<ModalHistoricChangesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalHistoricChangesComponent]
    });
    fixture = TestBed.createComponent(ModalHistoricChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
