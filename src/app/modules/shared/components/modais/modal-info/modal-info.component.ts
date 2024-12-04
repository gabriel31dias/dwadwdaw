import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Snackbar } from '../../../models/snackbar.model';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss']
})
export class ModalInfoComponent {

  title: string = 'Título modal de cancelamento com motivo';
  text: string = 'Texto modal de cancelamento com motivo';
  textBtnConfirm: string = 'cancelar';
  reason: string = '';
  snackbar: Snackbar = new Snackbar();

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal
  ) {
    translate.use('pt-br');
  }

  close() {
    this.modal.close();
  }

  confirm() {
    if (this.reason.trim()) {
      this.modal.close({ reason: this.reason.trim() });
    } else {
      this.snackbar.open = true;
      this.snackbar.message = 'insiraUmMotivo'
    }
  }

}
