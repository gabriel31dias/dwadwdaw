import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-remove-user-group-permission',
  templateUrl: './modal-remove-user-group-permission.component.html',
  styleUrls: ['./modal-remove-user-group-permission.component.scss'],
})
export class ModalRemoveUserGroupPermissionComponent {
  group: string = '';

  constructor(
    private translate: TranslateService,
    private modal: NgbActiveModal
  ) {
    translate.use('pt-br');
  }

  close() {
    this.modal.close(false);
  }

  confirm() {
    this.modal.close(true);
  }
}
