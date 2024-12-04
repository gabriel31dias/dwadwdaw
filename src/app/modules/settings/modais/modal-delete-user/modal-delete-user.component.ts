import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-delete-user',
  templateUrl: './modal-delete-user.component.html',
  styleUrls: ['./modal-delete-user.component.scss']
})
export class ModalDeleteUserComponent {

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
