import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageBillDocumentsComponent } from './stage-bill-documents.component';

describe('StageBillDocumentsComponent', () => {
  let component: StageBillDocumentsComponent;
  let fixture: ComponentFixture<StageBillDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StageBillDocumentsComponent]
    });
    fixture = TestBed.createComponent(StageBillDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
