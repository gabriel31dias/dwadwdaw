import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-confirmation-change-user-group',
  templateUrl: './modal-confirmation-change-user-group.component.html',
  styleUrls: ['./modal-confirmation-change-user-group.component.scss'],
})
export class ModalConfirmationChangeUserGroupComponent {

  group: string = '';
  newGroup: string = '';

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
