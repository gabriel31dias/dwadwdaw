import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAdvancedSearchDriverComponent } from './modal-advanced-search-driver.component';

describe('ModalAdvancedSearchDriverComponent', () => {
  let component: ModalAdvancedSearchDriverComponent;
  let fixture: ComponentFixture<ModalAdvancedSearchDriverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAdvancedSearchDriverComponent]
    });
    fixture = TestBed.createComponent(ModalAdvancedSearchDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
