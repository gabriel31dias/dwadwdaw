import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { GroupsPermissionsComponent } from './components/permissions/groups-permissions/groups-permissions.component';
import { ActionsPermissionsComponent } from './components/permissions/actions-permissions/actions-permissions.component';
import { ModalViewPermissionsGroupComponent } from './modais/modal-view-permissions-group/modal-view-permissions-group.component';
import { ModalSearchUserPermissionComponent } from './modais/modal-search-user-permission/modal-search-user-permission.component';
import { TemplateModulePermissionsComponent } from './components/permissions/template-module-permissions/template-module-permissions.component';
import { ModalConfirmationChangeUserGroupComponent } from './modais/modal-confirmation-change-user-group/modal-confirmation-change-user-group.component';
import { ModalRemoveUserGroupPermissionComponent } from './modais/modal-remove-user-group-permission/modal-remove-user-group-permission.component';
import { ListCustomFieldsComponent } from './components/custom-fields/list-custom-fields/list-custom-fields.component';
import { ActionsCustomFieldsComponent } from './components/custom-fields/actions-custom-fields/actions-custom-fields.component';
import { ListExhibitionsComponent } from './components/custom-fields/list-exhibitions/list-exhibitions.component';
import { ActionsExhibitionsComponent } from './components/custom-fields/actions-exhibitions/actions-exhibitions.component';
import { ModalDeleteUserComponent } from './modais/modal-delete-user/modal-delete-user.component';
import { ModalActiveUserComponent } from './modais/modal-active-user/modal-active-user.component';
import { ModalDisableUserComponent } from './modais/modal-disable-user/modal-disable-user.component';
import { ModalRequestNewPasswordComponent } from './modais/modal-request-new-password/modal-request-new-password.component';
import { UsersPermissionsComponent } from './components/permissions/users-permissions/users-permissions.component';
import { ActionsPermissionsUsersComponent } from './components/permissions/actions-permissions-users/actions-permissions-users.component';

const routes: Routes = [
  {
    path: 'permissions/groups',
    component: GroupsPermissionsComponent
  },
  {
    path: 'permissions/actions',
    component: ActionsPermissionsComponent
  },
  {
    path: 'custom-fields/list',
    component: ListCustomFieldsComponent
  },
  {
    path: 'custom-fields/actions',
    component: ActionsCustomFieldsComponent
  },
  {
    path: 'exhibitions/list',
    component: ListExhibitionsComponent
  },
  {
    path: 'exhibitions/actions',
    component: ActionsExhibitionsComponent
  },
  {
    path: 'permissions/users',
    component: UsersPermissionsComponent
  },
  {
    path:'permissions/users-actions',
    component: ActionsPermissionsUsersComponent
  }
]

@NgModule({
  declarations: [
    GroupsPermissionsComponent,
    ActionsPermissionsComponent,
    ModalViewPermissionsGroupComponent,
    ModalSearchUserPermissionComponent,
    TemplateModulePermissionsComponent,
    ModalConfirmationChangeUserGroupComponent,
    ModalRemoveUserGroupPermissionComponent,
    ListCustomFieldsComponent,
    ActionsCustomFieldsComponent,
    ListExhibitionsComponent,
    ActionsExhibitionsComponent,
    ModalDeleteUserComponent,
    ModalActiveUserComponent,
    ModalDisableUserComponent,
    ModalRequestNewPasswordComponent,
    ActionsPermissionsUsersComponent,
    UsersPermissionsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forChild(),
    FormsModule,
    RouterModule.forChild(routes),
  ]
})
export class SettingsModule { }
