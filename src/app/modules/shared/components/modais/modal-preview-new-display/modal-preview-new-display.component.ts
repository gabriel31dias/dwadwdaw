import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ExhibitionCustomField } from '../../../models/exhibition-custom-field.model';
import { StepperModel } from '../../../models/stepper.model';

@Component({
  selector: 'app-modal-preview-new-display',
  templateUrl: './modal-preview-new-display.component.html',
  styleUrls: ['./modal-preview-new-display.component.scss']
})
export class ModalPreviewNewDisplayComponent implements OnInit {

  displayFields : ExhibitionCustomField[] = [];
  stepName: string = '';
  steppers: StepperModel[] = [];

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal
  ) {
    translate.use('pt-br')
  }

  ngOnInit(): void {
    this.steppers = [
      {
        src: 'register-white.svg',
        text: this.stepName,
        width: '100%'
      }
    ];
  }

  close() {
    this.modal.close();
  }
}
