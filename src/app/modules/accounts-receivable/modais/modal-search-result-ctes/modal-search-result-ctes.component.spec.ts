import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSearchResultCtesComponent } from './modal-search-result-ctes.component';

describe('ModalSearchResultCtesComponent', () => {
  let component: ModalSearchResultCtesComponent;
  let fixture: ComponentFixture<ModalSearchResultCtesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSearchResultCtesComponent]
    });
    fixture = TestBed.createComponent(ModalSearchResultCtesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
