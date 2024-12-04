import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Snackbar } from '../../../models/snackbar.model';
import { ColumnFilter, RequestFilterColumn, SearchColumnFilter } from '../../../models/filter-column.model';
import { AdvancedFilter } from 'src/app/modules/shared/models/save-filters.model';

@Component({
  selector: 'app-filter-columns',
  templateUrl: './filter-columns.component.html',
  styleUrls: ['./filter-columns.component.scss']
})
export class FilterColumnsComponent implements OnChanges, OnInit {

  @Input() columns: ColumnFilter[] = [];
  @Output() sendRequest = new EventEmitter<AdvancedFilter>();
  oldColumns: ColumnFilter[] = [];
  boxSelectedColumn = false;
  openFilterTypes: boolean = false;
  editFilter: boolean = false;
  columnSelected: ColumnFilter | null = null;
  @Input() filtersSearch: SearchColumnFilter[] = [];
  snackbar: Snackbar = new Snackbar();
  req: RequestFilterColumn[] = [];
  openBoxMore: boolean = false;
  @Input() clientNameFilter: string = '';
  @Output() clearFilters = new EventEmitter<boolean>();
  search: string = '';

  constructor(private translate: TranslateService) {
    translate.use('pt-br');
  }

  ngOnInit(): void {
    this.setInitialSearch(this.clientNameFilter);
  }

  setInitialSearch(search: string) {
    if(search !== ''){
      this.filtersSearch = [
        {
          columnParams: {
            coluna: 'NomeCliente',
            tipo: 'String',
            nome: 'Nome Cliente',
            valores: []
          },
          typeSearch: 'Contains',
          search: search
        }
      ];
      this.setRequest();
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']?.currentValue) {
      if (this.oldColumns.length === 0) {
        this.oldColumns = changes['columns'].currentValue;
      }
    }

    if (changes['columns']?.currentValue.length === 0) {
      this.filtersSearch = [];
      this.openBoxMore = false;
    }

    if (changes['filtersSearch']?.currentValue) {
      this.filtersSearch = changes['filtersSearch']?.currentValue;
    }

  }

  openFilter(column: ColumnFilter) {
    this.openFilterTypes = true;
    this.columnSelected = column;
  }

  closeFilterTypes() {
    this.openFilterTypes = false;
    this.columnSelected = null;
  }

  applyFilter(filter: SearchColumnFilter) {
   if(filter.columnParams.coluna === "CnpjCliente") {
     filter.search = filter.search.replace(/\./g,"").replace("-","").replace(/\//g,"")

   }
    this.openBoxMore = false;
    this.filtersSearch.push(filter);
    this.hide();
    this.setRequest();
  }

  clearFilter(filter: SearchColumnFilter) {
    this.filtersSearch.splice(this.filtersSearch.indexOf(filter), 1)
    this.setRequest();
  }

  openEditFilter() {
    this.editFilter = !this.editFilter
  }

  updateFilter(newFilter: { filter: SearchColumnFilter, indexFilter: number | null }) {
    this.filtersSearch[newFilter.indexFilter!] = newFilter.filter;
    this.setRequest();
  }

  setRequest() {
    this.req = [];

    if (this.filtersSearch.length >= 1) {
      for (const filter of this.filtersSearch) {
        const newReq: RequestFilterColumn = {
          coluna: filter.columnParams.coluna,
          operacao: filter.typeSearch,
          valor: filter.columnParams.tipo === 'String' || filter.columnParams.tipo === 'Number' ? filter.search : filter.search.id,
        }

        this.req.push(newReq)
      }
    }

    this.sendRequest.emit({ request: this.req, configFilters: this.filtersSearch})
  }

  action() {
    if (this.boxSelectedColumn) {
      this.hide();
    } else {
      this.show();
    }
  }

  hide() {
    this.closeFilterTypes();
    setTimeout(() => {
      // this.columns = this.oldColumns;
      this.boxSelectedColumn = false;
    }, 0);
  }

  show() {
    setTimeout(() => {
      this.boxSelectedColumn = true;
    }, 0);
  }

  doSearch(search: string) {
    this.search = search;
    if (search) {
      this.columns = this.columns.filter(column => column.nome.toLowerCase().includes(search.toLowerCase()));
    } else {
      this.columns = this.oldColumns;
    }

    console.log({
      columns: this.columns,
      oldColumns: this.oldColumns
    })
  }

}
