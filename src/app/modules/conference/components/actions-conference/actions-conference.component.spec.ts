import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsConferenceComponent } from './actions-conference.component';

describe('ActionsConferenceComponent', () => {
  let component: ActionsConferenceComponent;
  let fixture: ComponentFixture<ActionsConferenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionsConferenceComponent]
    });
    fixture = TestBed.createComponent(ActionsConferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
