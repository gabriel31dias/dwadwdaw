import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.scss']
})
export class ModalConfirmationComponent {
  title: string = '';
  text: string = '';
  style!: 'red' | 'green';
  textBtnConfirm: string = 'confirmar';
  textBtnCancel: string = 'cancelar'

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal
  ) {
    translate.use('pt-br')
  }

  close() {
    this.modal.close(false);
  }

  confirm() {
    this.modal.close(true);
  }

}
