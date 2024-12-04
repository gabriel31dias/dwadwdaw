import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageFreightDocumentsComponent } from './stage-freight-documents.component';

describe('StageFreightDocumentsComponent', () => {
  let component: StageFreightDocumentsComponent;
  let fixture: ComponentFixture<StageFreightDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StageFreightDocumentsComponent]
    });
    fixture = TestBed.createComponent(StageFreightDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
