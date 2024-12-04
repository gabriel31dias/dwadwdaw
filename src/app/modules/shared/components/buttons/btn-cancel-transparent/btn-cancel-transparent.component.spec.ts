import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnCancelTransparentComponent } from './btn-cancel-transparent.component';

describe('BtnCancelTransparentComponent', () => {
  let component: BtnCancelTransparentComponent;
  let fixture: ComponentFixture<BtnCancelTransparentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BtnCancelTransparentComponent]
    });
    fixture = TestBed.createComponent(BtnCancelTransparentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
