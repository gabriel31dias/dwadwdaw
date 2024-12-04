import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';

@Component({
  selector: 'app-modal-search-result',
  templateUrl: './modal-search-result.component.html',
  styleUrls: ['./modal-search-result.component.scss']
})
export class ModalSearchResultComponent {

  columns: ColumnSlickGrid[] = [];
  columnsHide: string[] = [];
  data: any[] = [];
  dataSelected: any;
  text: string = '';

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal
  ) {
    translate.use('pt-br');
  }

  close() {
    this.modal.close();
  }

  getDataSelected(selected: any) {
    this.dataSelected = '';
    this.dataSelected = this.data[selected];
  }

  confirmSelected() {
    this.modal.close(this.dataSelected);
  }

}
