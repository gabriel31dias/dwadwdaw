import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-disable-user',
  templateUrl: './modal-disable-user.component.html',
  styleUrls: ['./modal-disable-user.component.scss']
})
export class ModalDisableUserComponent {
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
