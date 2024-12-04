import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsPermissionsComponent } from './groups-permissions.component';

describe('GroupsPermissionsComponent', () => {
  let component: GroupsPermissionsComponent;
  let fixture: ComponentFixture<GroupsPermissionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupsPermissionsComponent]
    });
    fixture = TestBed.createComponent(GroupsPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
