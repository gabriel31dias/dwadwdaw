import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsPermissionsComponent } from './actions-permissions.component';

describe('ActionsPermissionsComponent', () => {
  let component: ActionsPermissionsComponent;
  let fixture: ComponentFixture<ActionsPermissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionsPermissionsComponent]
    });
    fixture = TestBed.createComponent(ActionsPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
