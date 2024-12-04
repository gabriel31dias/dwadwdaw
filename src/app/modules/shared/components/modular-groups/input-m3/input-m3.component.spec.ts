import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputM3Component } from './input-m3.component';

describe('InputM3Component', () => {
  let component: InputM3Component;
  let fixture: ComponentFixture<InputM3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputM3Component]
    });
    fixture = TestBed.createComponent(InputM3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
