import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Permission } from '../../../models/permissions-module.model';

@Component({
  selector: 'app-template-module-permissions',
  templateUrl: './template-module-permissions.component.html',
  styleUrls: ['./template-module-permissions.component.scss']
})
export class TemplateModulePermissionsComponent {

  @Input() listPermissions: Permission[] = []
  @Output() setListPermissions: EventEmitter<Permission[]> = new EventEmitter<Permission[]>();

  updatePermission() {
    this.setListPermissions.emit(this.listPermissions)
  }

}
