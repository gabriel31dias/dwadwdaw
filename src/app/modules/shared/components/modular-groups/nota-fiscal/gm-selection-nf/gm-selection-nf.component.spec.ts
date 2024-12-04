import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmSelectionNfComponent } from './gm-selection-nf.component';

describe('GmSelectionNfComponent', () => {
  let component: GmSelectionNfComponent;
  let fixture: ComponentFixture<GmSelectionNfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GmSelectionNfComponent]
    });
    fixture = TestBed.createComponent(GmSelectionNfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
