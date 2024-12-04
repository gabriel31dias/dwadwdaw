import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ColumnFilter, SearchColumnFilter } from '../../../models/filter-column.model';
import { Snackbar } from '../../../models/snackbar.model';

@Component({
  selector: 'app-filter-column-type',
  templateUrl: './filter-column-type.component.html',
  styleUrls: ['./filter-column-type.component.scss']
})
export class FilterColumnTypeComponent implements OnChanges {

  @Input() column: ColumnFilter | null = <ColumnFilter>{};
  @Input() text: string = '';
  @Output() close = new EventEmitter<any>();
  @Output() apply = new EventEmitter<SearchColumnFilter>();
  radio: number = 0;
  optionSelectedDropdown: number | null = null;
  options: any[] = [];
  snackbar: Snackbar = new Snackbar();

  constructor(private translate: TranslateService) {
    translate.use('pt-br');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['column']) {
      this.options = [];
      this.getOptions();
    }
  }

  getOptions() {
    if (this.column!.valores) {
      for (const value of this.column!.valores) {
        const option = {
          name: value.nome,
          tooltip: value.toolTip
        }
        this.options.push(option)
      }
    }
  }

  applyFilter() {
    const filter: SearchColumnFilter = {
      columnParams: this.column!,
      typeSearch: '==',
      search: ''
    }

    if (this.column!.tipo == 'String') {
      filter.typeSearch = this.radio === 0 ? 'Contains' : '==';
      filter.search = this.text;
    }

    if (this.column!.tipo == 'Number') {
      filter.typeSearch = '==';
      filter.search = this.text;
    }

    if (this.column!.tipo == 'Boolean') {
      filter.search = this.column!.valores[this.radio];
    }

    if (this.column!.tipo == 'PickList') {
      filter.search = this.column!.valores[this.optionSelectedDropdown!];
    }

    if (filter.search) {
      this.apply.emit(filter);
    } else {
      this.snackbar.open = true;
      this.snackbar.message = filter.columnParams.tipo == 'String' ? 'digiteParaBuscar' : 'selecioneParaBuscar'
    }

  }

}
