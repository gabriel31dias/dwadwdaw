import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsPayableComponent } from './actions-payable.component';

describe('ActionsPayableComponent', () => {
  let component: ActionsPayableComponent;
  let fixture: ComponentFixture<ActionsPayableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionsPayableComponent]
    });
    fixture = TestBed.createComponent(ActionsPayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
