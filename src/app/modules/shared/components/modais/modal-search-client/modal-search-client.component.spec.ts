import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSearchClientComponent } from './modal-search-client.component';

describe('ModalSearchClientComponent', () => {
  let component: ModalSearchClientComponent;
  let fixture: ComponentFixture<ModalSearchClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalSearchClientComponent]
    });
    fixture = TestBed.createComponent(ModalSearchClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
