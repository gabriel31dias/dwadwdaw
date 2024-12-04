import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { ModalConfirmationComponent } from 'src/app/modules/shared/components/modais/modal-confirmation/modal-confirmation.component';
import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { RequestFilterColumn } from 'src/app/modules/shared/models/filter-column.model';
import { FiltroDataBuscaCte } from 'src/app/modules/shared/models/filter-date.enum';
import { IndicadoresDocumentosPendentesFaturamento } from 'src/app/modules/shared/models/indicators.enum';
import { Modules } from 'src/app/modules/shared/consts/list-modules.const';
import { AdvancedFilter, SaveFilters } from 'src/app/modules/shared/models/save-filters.model';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { Totalizer } from 'src/app/modules/shared/models/totalizer.model';
import { GridService } from 'src/app/modules/shared/services/grid.service';
import { formatDateBrToUtc, formatDateStringUTC, formatDateUtcToBr } from 'src/app/modules/shared/utils/date-utils';
import { setDynamicColumnsGrid } from 'src/app/modules/shared/utils/grid-utils';
import { PendingDocumentService } from '../../services/pending-document.service';
import { TableDinamicGridComponent } from 'src/app/modules/shared/components/tables/table-dinamic-grid/table-dinamic-grid.component';
import { ParamsListGrid } from 'src/app/modules/shared/models/params-list-grid.model';
import { setCurrencyMask } from 'src/app/modules/shared/utils/currency-mask';
import { ModalBillingDocumentsComponent } from '../../modais/modal-billing-documents/modal-billing-documents.component';
import { ContasAReceberPermissoes } from 'src/app/modules/shared/consts/permissions.const';
import { PeriodDateFilter } from 'src/app/modules/shared/models/period-date.model';
import { setPeriod, setWeekDate } from 'src/app/modules/shared/utils/period.utils';

@Component({
  selector: 'app-list-pending-documents',
  templateUrl: './list-pending-documents.component.html',
  styleUrls: ['./list-pending-documents.component.scss']
})
export class ListPendingDocumentsComponent {

  companyId: string;
  companyName: string;
  permissions: string [];
  authReceivable = ContasAReceberPermissoes;
  savedFilters: SaveFilters = <SaveFilters>{};
  total: Totalizer = <Totalizer>{};
  released: Totalizer = <Totalizer>{};
  blocked: Totalizer = <Totalizer>{};
  columnsFilter: any[] = [];
  configFilterColumnSelected: any[] = [];
  filterDate = [ FiltroDataBuscaCte[0], FiltroDataBuscaCte[1] ];
  filterDateSelected: number | null = null;
  filterDateEnum = FiltroDataBuscaCte;
  periodFilter: PeriodDateFilter = <PeriodDateFilter>{};
  page: number = 1;
  take: number = 100;
  search: string = '';
  filterColumnSelected: RequestFilterColumn[] = [];
  indicatorSelected: number | null = null;
  indicatorsEnum = IndicadoresDocumentosPendentesFaturamento;
  params: ParamsListGrid = <ParamsListGrid>{};
  @ViewChild(TableDinamicGridComponent) table!: TableDinamicGridComponent;
  columns: ColumnSlickGrid[] = [];
  columnsHide: string[] = [];
  documents: any[] = [];
  numsDocumentsSelecteds: any[] = [];
  totalLenght: number = 0;
  snackbar: Snackbar = new Snackbar();
  loading: boolean = false;
  btnRotate: number = 0;
  hideTooltip: boolean = false;

  constructor(private translate: TranslateService,
    private router: Router,
    private modalService: NgbModal,
    private changeDetector: ChangeDetectorRef,
    private storageService: StorageService,
    private gridService: GridService,
    private pendingDocumentService: PendingDocumentService,
  ) {
    translate.use('pt-br')
    this.companyId = storageService.getCompanyId()!;
    this.companyName = storageService.getCompanyName()!;
    this.permissions = storageService.getPermissionsUser();
    this.savedFilters = storageService.getFiltersGrid('filtersPendingDocumentsBilling')
      ? storageService.getFiltersGrid('filtersPendingDocumentsBilling')!
      : <SaveFilters>{};
    storageService.getFiltersGrid('filtersPendingDocumentsBilling') ? this.setFiltersSaved() : this.setInitialFilter();

    // this.openModalInvoice();
  }

  ngOnInit(): void {
    if (this.permissions.includes(this.authReceivable.Visualizar)) {
      this.getColumnsFilter();

      setTimeout(() => {
        this.initGrid();
      }, 0);
    } else {
      this.snackbar.open = true;
      this.snackbar.timeHide = 10000;
      this.snackbar.message = 'usuarioSemPermissaoTela';
    }
  }

  // Insere o período de uma semana de acordo com a data atual.
  setInitialFilter() {
    this.periodFilter = setWeekDate();
    this.filterDateSelected = 0;
    this.page = 1;
  }

  setFiltersSaved() {
    this.filterDateSelected = this.savedFilters.typeDate;
    this.page = this.savedFilters.page;

    if (this.savedFilters.period?.period) {
      this.periodFilter = this.savedFilters.period;

      this.periodFilter = setPeriod(this.periodFilter.period!);
    } else {
      if (this.savedFilters.period) this.periodFilter = this.savedFilters.period;
    }

    this.take = this.savedFilters.take ? this.savedFilters.take : 100;
    this.search = this.savedFilters.search;
    this.filterColumnSelected = this.savedFilters.advancedFilter.request;
    this.configFilterColumnSelected = this.savedFilters.advancedFilter.configFilters;
    if (this.savedFilters.status !== null) this.selectedTotal(this.savedFilters.status, true, true);
  }

  // Inicializa o GRID.
  initGrid() {
    this.loading = true;
    this.columnsHide = this.storageService.getHideGridColumns('hidePendingDocumentsBilling');
    this.columns = this.storageService.getConfigGrid('gridPendingDocumentsBilling');

    this.gridService.getHeaders(this.companyId, Modules.CtePendentes).subscribe({
      next: (response) => {
        const columnsBackend: ColumnSlickGrid[] = response.dados;

        this.columns = setDynamicColumnsGrid(this.columns, columnsBackend);
        this.storageService.setConfigGrid(this.columns, 'gridPendingDocumentsBilling');

        this.getDocuments();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Faz a bsuca de documentos pendentes de faturamento de acordo com o filtro totalizador selecionado.
  selectedTotal(index: number, selected: boolean, notGet?: boolean) {
    this.unselectedAll();

    selected === true ? this.indicatorSelected = index : this.indicatorSelected = null;
    this.page = 1;
    if (!notGet) this.getDocuments();

    switch (index) {
      case this.indicatorsEnum.Total:
        this.total.selected = selected;
        break;
      case this.indicatorsEnum.Liberados:
        this.released.selected = selected;
        break;
      case this.indicatorsEnum.Bloqueados:
        this.blocked.selected = selected;
        break;
    }
  }

  // Desseleciona todas as opções de filtro totalizador.
  unselectedAll() {
    this.total.selected = false;
    this.released.selected = false;
    this.blocked.selected = false;
    this.indicatorSelected = null;
  }

  // Trás as opções de colunas para o filtro dinâmico.
  getColumnsFilter() {
    this.pendingDocumentService.getColumnsFilter(this.companyId).subscribe({
      next: (response) => {
        this.columnsFilter = response.dados;
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro
      }
    })
  }

  // Faz a busca de documentos pendentes de faturamento de acordo com os filtros de colunas aplicado.
  setFilterColumn(filter: AdvancedFilter) {
    this.filterColumnSelected = filter.request;
    this.configFilterColumnSelected = filter.configFilters;
    this.page = 1;
    this.getDocuments();
  }

  // Faz a busca de documentos pendentes de faturamento de acordo com o período inserido.
  setFilterDate(period: PeriodDateFilter) {
    this.periodFilter = period;
    if (this.filterDateSelected !== null) {
      this.page = 1;
      this.getDocuments();
    }
  }

  // Faz a busca das documentos pendentes de faturamento de acordo com o que o usuário inseriu no input de busca.
  doSearch(data: string, lostFocus?: boolean) {
    if (lostFocus && this.search === data) return;
    this.search = data;
    this.page = 1;
    this.getDocuments();
  }

  // Limpa todos os filtros.
  clearFilters() {
    setTimeout(() => {
      this.filterColumnSelected = [];
      this.configFilterColumnSelected = [];
      this.columnsFilter = [];
      this.search = '';
      this.unselectedAll();
      this.getColumnsFilter();
      this.page = 1;
      this.getDocuments();
    }, 0);
  }

  // Faz a verificação se os documentos selecionados estão bloqueados, para serem liberados.
  verifyDocumentReleased(): boolean{
    return this.numsDocumentsSelecteds.every(selectedItem =>
      this.documents.some(document =>
        document.id === selectedItem.id && document.bloqueado === true
      )
    );
  }

  // Abre o modal de confirmação de acordo com a ação clicada.
  openModalConfirm(action: 'release' | 'block') {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-confirm',
    };
    const modalRef = this.modalService.open(ModalConfirmationComponent, modalOptions);

    switch (action) {
      case 'release':
        modalRef.componentInstance.title = 'liberar';
        modalRef.componentInstance.text = this.numsDocumentsSelecteds.length <= 1
          ? 'textoLiberarDocumento'
          : 'textoLiberarDocumentos';
        modalRef.componentInstance.style = 'green';
        modalRef.componentInstance.textBtnConfirm = 'simLiberar';
        break;
      case 'block':
        modalRef.componentInstance.title = 'bloquear';
        modalRef.componentInstance.text = this.numsDocumentsSelecteds.length <= 1
          ? 'textoBloquearFaturamento'
          : 'textoBloquearFaturamentos';
        modalRef.componentInstance.style = 'red';
        modalRef.componentInstance.textBtnConfirm = 'bloquear';
        break;
    }

    modalRef.result.then((res: boolean) => {
      if (res) {
        if (action === 'release') this.releaseDocument();
        if (action === 'block') this.blockDocument();
      }
    })
    .catch((res) => {

    })
  }

  // Verifica se os documentos selecionados possuem o mesmo status para realizar a ação em lote. (Esconde/Mostra a ação no GRID)
  verifyStatus(status: 'Liberado' | 'Bloqueado'): boolean {
    return this.numsDocumentsSelecteds.every(numDocument =>
      this.documents.some(document =>
        document.noCTRC === numDocument && document.status === status
      )
    );
  }

  // Realiza a liberação do(s) documento(s) selecionado(s).
  releaseDocument() {
    this.loading = true;
    this.pendingDocumentService.releaseCTes(this.companyId, this.numsDocumentsSelecteds).subscribe({
      next: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.mensagem;
        this.loading = false;
        this.getDocuments();
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro
        this.loading = false;
      }
    })
  }

  // Realiza o bloqueio do(s) documento(s) selecionado(s).
  blockDocument() {
    this.loading = true;
    this.pendingDocumentService.blockCTes(this.companyId, this.numsDocumentsSelecteds).subscribe({
      next: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.mensagem;
        this.loading = false;
        this.getDocuments();
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro
        this.loading = false;
      }
    })
  }

  // Fatura o(s) documento(s) selecionado(s).
  openModalInvoice(){
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-billing',
    };
    const modalRef = this.modalService.open(ModalBillingDocumentsComponent, modalOptions);
    modalRef.componentInstance.numsCTes = this.numsDocumentsSelecteds;

    modalRef.result.then((response: { status: boolean, message: string | null }) => {
      if (response.status) {
        if (response.message) {
          this.snackbar.open = true;
          this.snackbar.message = response.message;
        }
        this.getDocuments();
      }
    })
    .catch((res) => {

    })
  }

  // Busca os Documentos pendentes de faturamento para alimentar o GRID.
  getDocuments() {
    this.loading = true;
    if (this.numsDocumentsSelecteds.length >= 1) {
      this.table.unselectAll();
    }

    if (this.indicatorsEnum.Liberados === this.indicatorSelected) this.params.status = 'Liberado';
    if (this.indicatorsEnum.Bloqueados === this.indicatorSelected) this.params.status = 'Bloqueado';
    if (this.indicatorSelected === null || this.indicatorsEnum.Total === this.indicatorSelected) this.params.status = null;

    this.params.page = this.page;
    this.params.take = this.take;
    this.params.search = this.search;
    this.params.columns = [];
    this.params.filtros = this.filterColumnSelected;

    if (this.filterDateSelected !== null) {
      if (this.filterDateSelected === this.filterDateEnum['Data de Emissão']) this.params.tipoData = 'Emissão';
      if (this.filterDateSelected === this.filterDateEnum['Data de Entrega']) this.params.tipoData = 'Entrega';
    } else {
      this.params.tipoData = null;
    }

    if (this.periodFilter.initDate && this.periodFilter.finalDate) {
      this.params.dataInicial = `${this.periodFilter.initDate}T00:00:00`;
      this.params.dataFinal = `${this.periodFilter.finalDate}T23:59:59`;
    } else {
      this.params.dataInicial = null;
      this.params.dataFinal = null;
    }

    this.savedFilters = {
      page: this.page,
      search: this.search,
      typeDate: this.filterDateSelected,
      advancedFilter: {
        request: this.filterColumnSelected,
        configFilters: this.configFilterColumnSelected
      },
      status: this.indicatorSelected,
      period: this.periodFilter,
      take: this.take
    }
    this.storageService.setFiltersGrid(this.savedFilters, 'filtersPendingDocumentsBilling');

    this.pendingDocumentService.getPendingDocuments(this.params, this.companyId).subscribe({
      next: (response) => {
        this.documents = response.dados.items;
        this.total.total = response.dados.counters?.total;
        this.total.value = setCurrencyMask(response.dados.counters?.totalValor);
        this.released.total = response.dados.counters?.liberados;
        this.released.value = setCurrencyMask(response.dados.counters?.liberadosValor);
        this.blocked.total = response.dados.counters?.bloqueados;
        this.blocked.value = setCurrencyMask(response.dados.counters?.bloqueadosValor);

        let count = 0;
        for (const document of this.documents) {
          document.id = count;
          count++;
        }

        this.totalLenght = response.dados.filteredTotal;
        this.loading = false;
      },
      error: (response) => {
        this.documents = [];
        this.total.total = 0;
        this.total.value = 'R$ 0,00';
        this.released.total = 0;
        this.released.value = 'R$ 0,00';
        this.blocked.total = 0;
        this.blocked.value = 'R$ 0,00';
        this.totalLenght = 0;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.loading = false;
      }
    })

    this.changeDetector.detectChanges();
  }

  // Atualiza o GRID e os totalizadores.
  refreshGrid() {
    this.hideTooltip = true;
    setTimeout(() => {
      this.hideTooltip = false;
    }, 300);

    this.btnRotate += 360;
    this.documents = [];

    this.initGrid();
  }

  // Faz a busca de uma nova página selecionada no GRID.
  pageChange(newPage: number) {
    this.page = newPage;
    this.getDocuments();
  }

  // Salva os conteúdos do GRID quando acontece modificação em alguma coluna.
  columnsChanges(event: any) {
    const allIds: string[] = [];
    const showIds: string[] = [];
    const configColumns: ColumnSlickGrid[] = [];

    for (const column of this.columns) {
      allIds.push(column.id)
    }

    for (const column of event) {
      if (column.columnId != "_checkbox_selector") {
        showIds.push(column.columnId)
        configColumns.push({ name: '', id: column.columnId, width: column.width })
      }
    }

    for (const column of configColumns) {
      const foundColumn = this.columns.find((c: any) => c.id === column.id);
      if (foundColumn) {
        column.name = foundColumn.name;
      }
    }

    this.columns.forEach((column) => {
      if (!configColumns.some((configColumn) => configColumn.id === column.id)) {
        configColumns.splice(this.columns.indexOf(column), 0, column)
      }
    })

    this.columnsHide = this.compareArrays(allIds, showIds);

    this.storageService.setConfigGrid(configColumns, 'gridPendingDocumentsBilling')
    this.storageService.setHideGridColumns(this.columnsHide, 'hidePendingDocumentsBilling')
  }

  // Atribui à "numsDocumentsSelecteds" o id das documentos pendentes de faturamento que foram selecionados.
  rowsSelected(selected: any[]) {
    this.numsDocumentsSelecteds = [];
    selected.forEach(document => {
      this.numsDocumentsSelecteds.push(document.noCTRC)
    });
  }

  // Faz a comparação de dois arrays e retorna o que eles tem de diferente.
  compareArrays(array1: string[], array2: string[]) {
    const diferentIndex: string[] = [];

    array1.forEach((element) => {
      if (!array2.includes(element)) {
        diferentIndex.push(element)
      }
    })

    return diferentIndex ? diferentIndex : [];
  }

  // APAGAR TODOS OS ITENS ABAIXO APÓS A INTEGRAÇÃO

  getTotalizersMockado(){
    this.total.total = 1115;
    this.total.value = 'R$ 3278,00';
    this.total.selected = false;

    this.blocked.total = 568;
    this.blocked.value = 'R$ 2000,00';
    this.blocked.selected = false;

    this.released.total = 547;
    this.released.value = 'R$ 1278,00';
    this.released.selected = false;
  }

  getColumnsMockado(){
    this.columns = [
      {id: 'conhecimento', name: 'Conhecimento', width: 200},
      {id: 'serie', name: 'Série', width: 200},
      {id: 'emissao', name: 'Emissão', width: 200},
      {id: 'tipo', name: 'Tipo de CT-e', width: 200},
      {id: 'cnpjRemetente', name: 'CNPJ do remetente', width: 200},
      {id: 'remetente', name: 'Remetente', width: 200},
      {id: 'cnpjDestinatario', name: 'CNPJ do destinatário', width: 200},
      {id: 'destinatario', name: 'Destinatário', width: 200},
      {id: 'cnpjPagador', name: 'CNPJ do pagador', width: 200},
    ]
  }

  getDadosMockados() {
    this.documents = [
      {
        id: '1',
        conhecimento: '5391',
        serie: '1',
        emissao: '16/11/2023',
        tipo: 'Entrega normal',
        cnpjRemetente: '82.729.914/0001-52',
        remetente: 'Carlos Daniel dos Santos',
        cnpjDestinatario: '79.870.841/0001-00',
        destinatario: 'Pedro Martins Bittencourt',
        cnpjPagador: '68.787.387/0001-01',
        liberado: false
      },
      {
        id: '2',
        conhecimento: '5391',
        serie: '1',
        emissao: '16/11/2023',
        tipo: 'Entrega normal',
        cnpjRemetente: '82.729.914/0001-52',
        remetente: 'Carlos Daniel dos Santos',
        cnpjDestinatario: '79.870.841/0001-00',
        destinatario: 'Pedro Martins Bittencourt',
        cnpjPagador: '68.787.387/0001-01',
        liberado: true
      },
      {
        id: '3',
        conhecimento: '5391',
        serie: '1',
        emissao: '16/11/2023',
        tipo: 'Entrega normal',
        cnpjRemetente: '82.729.914/0001-52',
        remetente: 'Carlos Daniel dos Santos',
        cnpjDestinatario: '79.870.841/0001-00',
        destinatario: 'Pedro Martins Bittencourt',
        cnpjPagador: '68.787.387/0001-01',
        liberado: false
      },
      {
        id: '4',
        conhecimento: '5391',
        serie: '1',
        emissao: '16/11/2023',
        tipo: 'Entrega normal',
        cnpjRemetente: '82.729.914/0001-52',
        remetente: 'Carlos Daniel dos Santos',
        cnpjDestinatario: '79.870.841/0001-00',
        destinatario: 'Pedro Martins Bittencourt',
        cnpjPagador: '68.787.387/0001-01',
        liberado: true
      },
      {
        id: '5',
        conhecimento: '5391',
        serie: '1',
        emissao: '16/11/2023',
        tipo: 'Entrega normal',
        cnpjRemetente: '82.729.914/0001-52',
        remetente: 'Carlos Daniel dos Santos',
        cnpjDestinatario: '79.870.841/0001-00',
        destinatario: 'Pedro Martins Bittencourt',
        cnpjPagador: '68.787.387/0001-01',
        liberado: true
      },
    ];
  }

  getFiltersMockado() {
    this.columnsFilter = [
      {
        id: '2',
        nome: 'Tipo de Documento'
      },
      {
        id: '3',
        nome: 'Cliente'
      },
      {
        id: '4',
        nome: 'Filial de emissão'
      },
      {
        id: '5',
        nome: 'Tipo de CT-e'
      },
      {
        id: '6',
        nome: 'Grupo de cliente'
      },
      {
        id: '7',
        nome: 'Viagem'
      },
      {
        id: '8',
        nome: 'Chave de acesso ou número do CT-e'
      },
      {
        id: '9',
        nome: 'Manifesto'
      },
      {
        id: '10',
        nome: 'Pacote'
      },
      {
        id: '11',
        nome: 'Tipo de Serviço'
      },
      {
        id: '12',
        nome: 'Divisão de faturamento'
      },
      {
        id: '13',
        nome: 'Já entregue'
      },
      {
        id: '14',
        nome: 'Com comprovante de entrega'
      }
    ]
  }

}
