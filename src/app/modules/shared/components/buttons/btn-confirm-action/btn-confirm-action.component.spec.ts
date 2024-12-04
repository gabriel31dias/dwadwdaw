import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnConfirmActionComponent } from './btn-confirm-action.component';

describe('BtnConfirmActionComponent', () => {
  let component: BtnConfirmActionComponent;
  let fixture: ComponentFixture<BtnConfirmActionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BtnConfirmActionComponent]
    });
    fixture = TestBed.createComponent(BtnConfirmActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
