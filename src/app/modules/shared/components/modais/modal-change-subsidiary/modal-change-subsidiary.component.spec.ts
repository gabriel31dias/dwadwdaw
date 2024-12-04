import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChangeSubsidiaryComponent } from './modal-change-subsidiary.component';

describe('ModalChangeSubsidiaryComponent', () => {
  let component: ModalChangeSubsidiaryComponent;
  let fixture: ComponentFixture<ModalChangeSubsidiaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalChangeSubsidiaryComponent]
    });
    fixture = TestBed.createComponent(ModalChangeSubsidiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
