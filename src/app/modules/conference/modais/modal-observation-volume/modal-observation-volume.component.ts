import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';

@Component({
  selector: 'app-modal-observation-volume',
  templateUrl: './modal-observation-volume.component.html',
  styleUrls: ['./modal-observation-volume.component.scss']
})
export class ModalObservationVolumeComponent {
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
    if (this.reason) {
      this.modal.close({ reason: this.reason });
    } else {
      this.snackbar.open = true;
      this.snackbar.message = 'insiraUmaObservacao'
    }
  }
}
