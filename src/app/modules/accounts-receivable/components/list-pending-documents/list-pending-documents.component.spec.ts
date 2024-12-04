import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPendingDocumentsComponent } from './list-pending-documents.component';

describe('ListPendingDocumentsComponent', () => {
  let component: ListPendingDocumentsComponent;
  let fixture: ComponentFixture<ListPendingDocumentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListPendingDocumentsComponent]
    });
    fixture = TestBed.createComponent(ListPendingDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
