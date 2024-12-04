import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { SizeCustomField } from 'src/app/modules/settings/models/size-custom-field';

@Component({
  selector: 'app-modal-set-size',
  templateUrl: './modal-set-size.component.html',
  styleUrls: ['./modal-set-size.component.scss']
})
export class ModalSetSizeComponent   {

  selectedSize: SizeCustomField = "Pequeno";
  size = SizeCustomField;

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal
  ) {
    translate.use('pt-br')
  }

  setSize(size: SizeCustomField) {
    this.selectedSize = size
  }

  confirm() {
    if (this.selectedSize) {
      this.modal.close(this.selectedSize);
    }
  }

  close() {
    this.modal.close();
  }
}
