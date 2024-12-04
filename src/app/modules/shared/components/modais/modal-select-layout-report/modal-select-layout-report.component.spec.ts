import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSelectLayoutReportComponent } from './modal-select-layout-report.component';

describe('ModalSelectLayoutReportComponent', () => {
  let component: ModalSelectLayoutReportComponent;
  let fixture: ComponentFixture<ModalSelectLayoutReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSelectLayoutReportComponent]
    });
    fixture = TestBed.createComponent(ModalSelectLayoutReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
