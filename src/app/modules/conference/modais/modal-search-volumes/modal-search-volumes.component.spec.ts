import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSearchVolumesComponent } from './modal-search-volumes.component';

describe('ModalSearchVolumesComponent', () => {
  let component: ModalSearchVolumesComponent;
  let fixture: ComponentFixture<ModalSearchVolumesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSearchVolumesComponent]
    });
    fixture = TestBed.createComponent(ModalSearchVolumesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
