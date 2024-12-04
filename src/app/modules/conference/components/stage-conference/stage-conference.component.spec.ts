import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageConferenceComponent } from './stage-conference.component';

describe('StageConferenceComponent', () => {
  let component: StageConferenceComponent;
  let fixture: ComponentFixture<StageConferenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StageConferenceComponent]
    });
    fixture = TestBed.createComponent(StageConferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
