import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ModalDefineMeasureComponent } from '../../modais/modal-define-measure/modal-define-measure.component';
import { Measure } from '../../../models/measure.model';

@Component({
  selector: 'app-input-m3',
  templateUrl: './input-m3.component.html',
  styleUrls: ['./input-m3.component.scss']
})
export class InputM3Component {

  @Input() label: string = '';
  @Input() entry: number | null = null;
  @Output() entryChanged: EventEmitter<number | null> = new EventEmitter<number | null>();
  @Input() readonly: boolean = false;
  @Input() measures: Measure[] = [];
  @Output() measuresChanged: EventEmitter<Measure[]> = new EventEmitter<Measure[]>();

  constructor(private translate: TranslateService,
    private modalService: NgbModal
  ) {

  }

  openModalMeasure() {
    if (this.measures && this.measures.length >= 1) {
      let count = 1;
      for (const measure of this.measures) {
        if (!measure.id) measure.id = count;
        count++;
      }
    }

    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-define-measure',
    };
    const modalRef = this.modalService.open(ModalDefineMeasureComponent, modalOptions);
    if (this.measures && this.measures.length >= 1) modalRef.componentInstance.measures = this.measures;

    modalRef.result.then((result: any) => {
      if (result) {
        if (!this.readonly) {
          this.entry = result.m3;
          this.entryChanged.emit(this.entry);
          this.measures = result.medidas;
          this.measuresChanged.emit(this.measures);
        }
      }
    })
    .catch((result) => {

    })
  }

}
