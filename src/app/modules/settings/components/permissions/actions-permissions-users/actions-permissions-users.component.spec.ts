import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsPermissionsUsersComponent } from './actions-permissions-users.component';

describe('ActionsPermissionsUsersComponent', () => {
  let component: ActionsPermissionsUsersComponent;
  let fixture: ComponentFixture<ActionsPermissionsUsersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionsPermissionsUsersComponent]
    });
    fixture = TestBed.createComponent(ActionsPermissionsUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
