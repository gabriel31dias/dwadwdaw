import { Component, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { InputSearchComponent } from 'src/app/modules/shared/components/inputs/input-search/input-search.component';
import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { ColumnFilter, RequestFilterColumn } from 'src/app/modules/shared/models/filter-column.model';
import { FiltroDataBuscaCte } from 'src/app/modules/shared/models/filter-date.enum';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { formatDateBrToUtc, formatOnlyDateBack } from 'src/app/modules/shared/utils/date-utils';
import { setCurrencyMask } from 'src/app/modules/shared/utils/currency-mask';
import { AdvancedFilter } from '../../../shared/models/save-filters.model';
import { PeriodDateFilter } from 'src/app/modules/shared/models/period-date.model';

@Component({
  selector: 'app-modal-stage-bill-documents',
  templateUrl: './modal-stage-bill-documents.component.html',
  styleUrls: ['./modal-stage-bill-documents.component.scss']
})
export class ModalStageBillDocumentsComponent {

  companyId: string;
  columnsFilter: ColumnFilter[] = [];
  filterColumnSelected: RequestFilterColumn[] = [];
  filterDate = [ FiltroDataBuscaCte[0], FiltroDataBuscaCte[1] ];
  filterDateSelected: number | null = null;
  filterDateEnum = FiltroDataBuscaCte;
  periodFilter: PeriodDateFilter = <PeriodDateFilter>{};
  search: string = '';
  @ViewChild(InputSearchComponent) InputSearchComponent!: InputSearchComponent;
  columns: ColumnSlickGrid[] = [];
  ctes: any[] = [];
  ctesSelecteds: any[] = [];
  snackbar: Snackbar = new Snackbar();
  loading: boolean = false;
  ctesLinked: any[] = [];
  clientNameFilter: string = '';
  documents: any[] = [];

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal,
    private storage: StorageService
  ) {
    this.companyId = storage.getCompanyId()!;
    translate.use('pt-br');
    this.getHeaderTable();
    this.getColumnsFilter();
    this.getDocuments();
    // setTimeout(() => {
    //   this.getCtes();
    // }, 0);
  }

  close() {
    this.modal.close();
  }

  onClientNameFilterChanged(newFilter: string) {
    this.clientNameFilter = newFilter;
  }

  // Faz a busca de CT-es de acordo com os filtros de colunas aplicado.
  setFilterColumn(filter: AdvancedFilter) {
    this.filterColumnSelected = filter.request;
    // this.getCtes();
  }

  // Faz a busca de CT-es de acordo com o período inserido.
  setFilterDate(period: PeriodDateFilter) {
    this.periodFilter = period;
    // this.getCtes();
  }

  // Faz a busca de CT-es de acordo com o que o usuário inseriu no input de busca.
  doSearch(data: string) {
    this.search = data;
    // this.getCtes();
  }

  // Limpa todos os filtros.
  clearFilters() {
    this.clientNameFilter = '';
    this.filterColumnSelected = [];
    this.InputSearchComponent.clear();
    this.columnsFilter = [];
    setTimeout(() => {
      this.getColumnsFilter();
      // this.getCtes();
    }, 0);
  }

  // Monta as colunas do GRID.
  getHeaderTable() {
    this.columns = [
      { name: 'Número do documento', id: 'numeroDoDocumento', width: 200 },
      { name: 'Tipo de documento', id: 'tipoDeDocumento', width: 200 },
      { name: 'Data de emissão', id: 'dataEmissao', width: 200 },
      { name: 'Fornecedor', id: 'fornecedor', width: 200 },
      { name: 'Valor', id: 'valor', width: 200 }
    ]
  }

  // Trás as opções de colunas para o filtro dinâmico.
  getColumnsFilter() {
    // this.receivableService.getColumnsFilterCTe(this.companyId).subscribe({
    //   next: (response) => {
    //     this.columnsFilter = response.dados;
    //   },
    //   error: (response) => {
    //     this.snackbar.open = true;
    //     this.snackbar.message = response.error.mensagem;
    //     this.snackbar.errorHandling = response.error.tratamentoErro;
    //   }
    // })
  }

  // Realiza a busca de CT-es.
  // getCtes() {
  //   const dateInit = this.firstDate ? formatDateBrToUtc(this.firstDate) + 'T00:00:00' : '';
  //   const dateFinal = this.lastDate ? formatDateBrToUtc(this.lastDate) + 'T00:00:00' : '';
  //   let typeDate: string | null = null
  //   if (this.filterDateSelected !== null) {
  //     if (this.filterDateSelected === this.filterDateEnum['Data de Emissão']) typeDate = 'Emissão';
  //     if (this.filterDateSelected === this.filterDateEnum['Data de Entrega']) typeDate = 'Entrega';
  //   }

  //   this.loading = true;
  //   this.ctes = [];
  //   this.receivableService.getCtesReceivable(this.companyId, this.search, this.filterColumnSelected, typeDate, dateInit, dateFinal).subscribe({
  //     next: async (response) => {
  //       const ctesBack = response.dados.items;
  //       let count = 0;
  //       for (const cteBack of ctesBack) {
  //         cteBack.id = count;
  //         cteBack.dataEmissao = formatOnlyDateBack(cteBack.dataEmissao);
  //         cteBack.valorFrete = setCurrencyMask(cteBack.valorFrete);

  //         let exist: boolean = false;
  //         this.ctesLinked.forEach(cte => {
  //           if (cte.noCTRC === cteBack.noCTRC &&
  //             cte.cdEmpresa === cteBack.cdEmpresa &&
  //             cte.cdFilEmp === cteBack.cdFilEmp
  //           ) {
  //             exist = true;
  //           }
  //         });

  //         if (!exist) this.ctes.push(cteBack);
  //         count++;
  //       }
  //       this.loading = false;
  //     },
  //     error: (response) => {
  //       this.loading = false;
  //       this.snackbar.open = true;
  //       this.snackbar.message = response.error.mensagem;
  //       this.snackbar.errorHandling = response.error.tratamentoErro;
  //     }
  //   })
  // }

  //Seleciona a linha
  rowsSelected(selecteds: any) {
    this.ctesSelecteds = selecteds;
  }

  confirmSelected() {
    if (this.ctesSelecteds.length >= 1) {
      this.modal.close(this.ctesSelecteds);
    } else {
      this.snackbar.open = true;
      this.snackbar.message = 'erroFinalizarSelecaoCTe';
    }
  }

  //Recebe os dados para a tabela do modal
  getDocuments(){
    this.documents = [
      {
        id: 1,
        numeroDoDocumento: '000000000010',
        tipoDeDocumento: 'Ordem de combustível',
        dataEmissao: '25/03/2023',
        fornecedor: 'Alberto Lopes',
        valor: 'R$0,00'
      }
    ]
  }
}
