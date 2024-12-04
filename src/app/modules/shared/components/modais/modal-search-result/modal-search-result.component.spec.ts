import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSearchResultComponent } from './modal-search-result.component';

describe('ModalSearchResultComponent', () => {
  let component: ModalSearchResultComponent;
  let fixture: ComponentFixture<ModalSearchResultComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSearchResultComponent]
    });
    fixture = TestBed.createComponent(ModalSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
