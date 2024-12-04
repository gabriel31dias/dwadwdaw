import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-observation',
  templateUrl: './modal-observation.component.html',
  styleUrls: ['./modal-observation.component.scss']
})
export class ModalObservationComponent {
  title: string = '';
  text: string = '';
  style!: 'red' | 'green';
  textBtnConfirm: string = 'concluir';
  textBtnCancel: string = 'cancelar'
  @Output() textEmitter = new EventEmitter<string>();

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal
  ) {
    translate.use('pt-br')
  }

  close() {
    this.modal.close(false);
  }

  confirm() {
    this.textEmitter.emit(this.text);
    this.modal.close(true);
  }

}
