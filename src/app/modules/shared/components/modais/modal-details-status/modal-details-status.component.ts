import { Component } from '@angular/core';
import { DetailsStatus } from '../../../models/details-status.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-details-status',
  templateUrl: './modal-details-status.component.html',
  styleUrls: ['./modal-details-status.component.scss']
})
export class ModalDetailsStatusComponent {

  txtMotivo: string = 'motivo';
  details: DetailsStatus = <DetailsStatus>{};

  constructor(private modal: NgbActiveModal) { }

  close() {
    this.modal.close();
  }

}
