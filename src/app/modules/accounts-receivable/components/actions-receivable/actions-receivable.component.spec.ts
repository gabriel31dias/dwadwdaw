import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsReceivableComponent } from './actions-receivable.component';

describe('ActionsReceivableComponent', () => {
  let component: ActionsReceivableComponent;
  let fixture: ComponentFixture<ActionsReceivableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionsReceivableComponent]
    });
    fixture = TestBed.createComponent(ActionsReceivableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
