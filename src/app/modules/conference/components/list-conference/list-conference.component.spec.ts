import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConferenceComponent } from './list-conference.component';

describe('ListConferenceComponent', () => {
  let component: ListConferenceComponent;
  let fixture: ComponentFixture<ListConferenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListConferenceComponent]
    });
    fixture = TestBed.createComponent(ListConferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
