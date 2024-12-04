import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-request-new-password',
  templateUrl: './modal-request-new-password.component.html',
  styleUrls: ['./modal-request-new-password.component.scss']
})
export class ModalRequestNewPasswordComponent {
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
