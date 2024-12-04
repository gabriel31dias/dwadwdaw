import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsCustomFieldsComponent } from './actions-custom-fields.component';

describe('ActionsCustomFieldsComponent', () => {
  let component: ActionsCustomFieldsComponent;
  let fixture: ComponentFixture<ActionsCustomFieldsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionsCustomFieldsComponent]
    });
    fixture = TestBed.createComponent(ActionsCustomFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
