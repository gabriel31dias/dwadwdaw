import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Historico } from '../../../models/historic-change.model';

@Component({
  selector: 'app-modal-details-change',
  templateUrl: './modal-details-change.component.html',
  styleUrls: ['./modal-details-change.component.scss']
})
export class ModalDetailsChangeComponent {

  historic: Historico = <Historico>{};

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal
  ) {
    translate.use('pt-br');
  }

  close() {
    this.modal.close(false);
  }

}
