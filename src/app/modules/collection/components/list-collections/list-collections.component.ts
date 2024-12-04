import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { ModalConfirmationComponent } from 'src/app/modules/shared/components/modais/modal-confirmation/modal-confirmation.component';
import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { Totalizer } from 'src/app/modules/shared/models/totalizer.model';
import { ModalDownloadCollectionComponent } from '../../modais/modal-download-collection/modal-download-collection.component';
import { ModalHistoricChangesComponent } from '../../../shared/components/modais/modal-historic-changes/modal-historic-changes.component';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { CollectionService } from '../../services/collection.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { IndicadoresColeta } from '../../../shared/models/indicators.enum';
import { ColumnFilter, RequestFilterColumn, SearchColumnFilter } from 'src/app/modules/shared/models/filter-column.model';
import { TableDinamicGridComponent } from 'src/app/modules/shared/components/tables/table-dinamic-grid/table-dinamic-grid.component';
import { ParamsListGrid } from 'src/app/modules/shared/models/params-list-grid.model';
import { AdvancedFilter, SaveFilters } from 'src/app/modules/shared/models/save-filters.model';
import { Modules } from 'src/app/modules/shared/consts/list-modules.const';
import { setDefaultViewGrid, setDynamicColumnsGrid } from 'src/app/modules/shared/utils/grid-utils';
import { GridService } from 'src/app/modules/shared/services/grid.service';
import { b64toBlob } from 'src/app/modules/shared/utils/b64-to-blob';
import { StatusColeta } from '../../models/status-collection.enum';
import { ModalInfoComponent } from 'src/app/modules/shared/components/modais/modal-info/modal-info.component';
import { PeriodDateFilter } from 'src/app/modules/shared/models/period-date.model';
import { setPeriod, setWeekDate } from 'src/app/modules/shared/utils/period.utils';
import { ListFiltroDataColeta } from 'src/app/modules/shared/consts/list-filter-date.const';
import { getTimeZone } from 'src/app/modules/shared/utils/date-utils';
import { defaultViewGridCollection } from 'src/app/modules/shared/consts/default-view-grid.const';
import { WarningColeta } from 'src/app/modules/shared/consts/warning-loading-modules.const';
import { SnackbarType } from 'src/app/modules/shared/consts/snackbar-type.const';
import { ModalSendEmailSingleComponent } from 'src/app/modules/shared/components/modais/modal-send-email-single/modal-send-email-single.component';
import { ConfigurationEmail } from 'src/app/modules/shared/models/send-email.model';
import { ModalSendEmailMultipleComponent } from 'src/app/modules/shared/components/modais/modal-send-email-multiple/modal-send-email-multiple.component';
import { EmailService } from 'src/app/modules/shared/services/email.service';
import { KeyValue } from 'src/app/modules/shared/models/key-value.model';
import { ModalSelectLayoutReportComponent } from 'src/app/modules/shared/components/modais/modal-select-layout-report/modal-select-layout-report.component';
import { ReportService } from 'src/app/modules/shared/services/report.service';
import { RelatorioLista } from 'src/app/modules/shared/models/relatorio-lista';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-list-collections',
  templateUrl: './list-collections.component.html',
  styleUrls: ['./list-collections.component.scss']
})
export class ListCollectionsComponent implements OnInit {

  companyId: string;
  subsidiaryName: string = '';
  all: Totalizer = <Totalizer>{};
  programmed: Totalizer = <Totalizer>{};
  initiated: Totalizer = <Totalizer>{};
  delayed: Totalizer = <Totalizer>{};
  performed: Totalizer = <Totalizer>{};
  discarded: Totalizer = <Totalizer>{};
  indicatorSelected: number | null = null;
  indicatorsEnum = IndicadoresColeta;
  @ViewChild(TableDinamicGridComponent) table!: TableDinamicGridComponent;
  columns: ColumnSlickGrid[] = [];
  initCollumns: ColumnSlickGrid[] = [];
  columnsHide: string[] = [];
  collections: any[] = [];
  cdCollectionsSelected: any[] = [];
  page: number = 1;
  take: number = 100;
  totalLenght: number = 0;
  search: string = '';
  periodFilter: PeriodDateFilter = <PeriodDateFilter>{};
  filtersDate: string[] = ListFiltroDataColeta;
  filterDateSelected: number | null = null;
  columnsFilter: ColumnFilter[] = [];
  filterColumnSelected: RequestFilterColumn[] = [];
  configFilterColumnSelected: SearchColumnFilter[] = [];
  params: ParamsListGrid = <ParamsListGrid>{};
  snackbar: Snackbar = new Snackbar();
  btnRotate: number = 0;
  loading: boolean = false;
  savedFilters: SaveFilters = <SaveFilters>{};
  hideTooltip: boolean = false;
  activeDefaultView: boolean = false;
  cdReportSelected: number | null = null;

  constructor(private translate: TranslateService,
    private modalService: NgbModal,
    private router: Router,
    private storageService: StorageService,
    private collectionService: CollectionService,
    private gridService: GridService,
    private emailService: EmailService,
    private reportService: ReportService
  ) {
    translate.use('pt-br')
    this.companyId = storageService.getCompanyId()!;
    this.subsidiaryName = storageService.getCompanyName()!;
    this.savedFilters = storageService.getFiltersGrid('filtersCollection')
      ? storageService.getFiltersGrid('filtersCollection')!
      : <SaveFilters>{};
    storageService.getFiltersGrid('filtersCollection') ? this.setFiltersSaved() : this.setInitialFilter();
  }

  ngOnInit(): void {
    this.getAdvancedFilter();

    setTimeout(() => {
      this.initGrid();
    }, 0);
  }

  /** Redireciona o usuário para a tela de criação de coletas. */
  goToNewCollection() {
    this.router.navigate(['collection/actions']);
  }

  /** Redireciona o usuário para a tela de visualização/edição de coleta. */
  goToEdit(collection: any) {
    this.router.navigate(['/collection/actions'], {
      queryParams: { number: collection.cdColeta, cdFilEmp: collection.cdFilEmp }
    })
  }

  /** Busca filtros que compõem o filtro avançado. */
  getAdvancedFilter() {
    this.collectionService.getColumnsCollections(this.companyId).subscribe({
      next: (response) => {
        this.columnsFilter = response.dados;
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.snackbar.type = SnackbarType.Danger;
      }
    })

  }

  /** Monta o GRID de acordo com os dados retornados pelo backend. */
  initGrid() {
    this.loading = true;
    this.columnsHide = this.storageService.getHideGridColumns('hideCollections');
    this.columns = this.storageService.getConfigGrid('gridCollections');

    this.gridService.getHeaders(this.companyId, Modules.Coleta).subscribe({
      next: (response) => {
        const columnsBackend = response.dados;

        if (this.activeDefaultView) {
          this.columnsHide = setDefaultViewGrid(defaultViewGridCollection, columnsBackend);
          this.activeDefaultView = false;
        }

        this.columns = setDynamicColumnsGrid(this.columns, columnsBackend);
        this.storageService.setConfigGrid(this.columns, 'gridCollections');

        this.getCollections();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.snackbar.type = SnackbarType.Danger;
      }
    })
  }

  /** Realiza a busca das coletas. */
  getCollections() {
    if (this.cdCollectionsSelected.length >= 1) {
      this.table.unselectAll();
    }

    this.params.page = this.page;
    this.params.take = this.take;
    this.params.search = this.search;
    this.params.tipoData = this.filterDateSelected;
    this.params.status = this.indicatorSelected;
    this.params.columns = [];
    this.params.filtros = this.filterColumnSelected;

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
      advancedFilter: { request: this.filterColumnSelected, configFilters: this.configFilterColumnSelected },
      status: this.indicatorSelected,
      period: this.periodFilter,
      take: this.take,
    }
    this.storageService.setFiltersGrid(this.savedFilters, 'filtersCollection');

    this.loading = true;
    this.collectionService.getCollections(this.params, this.companyId).subscribe({
      next: (response) => {
        this.all.total = response.dados.counters.previstas;
        this.programmed.total = response.dados.counters.programadas;
        this.initiated.total = response.dados.counters.iniciadas;
        this.delayed.total = response.dados.counters.atrasadas;
        this.performed.total = response.dados.counters.realizadas;
        this.discarded.total = response.dados.counters.descartadas;

        this.collections = response.dados.items;
        let count = 0;
        for (const collection of this.collections) {
          collection.id = count;
          count++;
        }
        this.totalLenght = response.dados.filteredTotal;
        this.loading = false;
      },
      error: (response) => {
        this.collections = [];
        this.totalLenght = 0;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.snackbar.type = SnackbarType.Danger;
        this.loading = false;

        this.all.total = response.error.dados?.counters.previstas;
        this.programmed.total = response.error.dados?.counters.programadas;
        this.initiated.total = response.error.dados?.counters.iniciadas;
        this.delayed.total = response.error.dados?.counters.atrasadas;
        this.performed.total = response.error.dados?.counters.realizadas;
        this.discarded.total = response.error.dados?.counters.descartadas;
      }
    })
  }

  /** Insere o filtro inicial de uma semana. */
  setInitialFilter() {
    this.periodFilter = setWeekDate();
    this.filterDateSelected = 0;
    this.page = 1;
    this.activeDefaultView = true;
    this.selectedTotal(this.indicatorsEnum.ColetasTodas, true);
  }

  /** Insere o filtro salvo no storage. */
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

  /** Aplica os filtros avançados. */
  setAdvancedFilter(filter: AdvancedFilter) {
    this.filterColumnSelected = filter.request;
    this.configFilterColumnSelected = filter.configFilters;
    this.page = 1;
    this.getCollections();
  }

  /** Aplica o filtro de monitoramento (totalizadores). */
  selectedTotal(index: number, selected: boolean, notGet?: boolean) {
    if (index === this.indicatorsEnum.ColetasTodas && this.indicatorSelected === this.indicatorsEnum.ColetasTodas) return;
    this.unselectedAll();

    if (selected) {
      this.indicatorSelected = index;
    } else {
      index = this.indicatorsEnum.ColetasTodas;
      this.indicatorSelected = this.indicatorsEnum.ColetasTodas
      selected = true;
    }

    this.page = 1;
    if (!notGet) this.getCollections();

    switch (index) {
      case this.indicatorsEnum.ColetasTodas:
        this.all.selected = selected;
        break;
      case this.indicatorsEnum.ColetasAgendamentos:
        this.programmed.selected = selected;
        break;
      case this.indicatorsEnum.ColetasIniciadas:
        this.initiated.selected = selected;
        break;
      case this.indicatorsEnum.ColetasAtrasadas:
        this.delayed.selected = selected;
        break;
      case this.indicatorsEnum.ColetasRealizadas:
        this.performed.selected = selected;
        break;
      case this.indicatorsEnum.ColetasDescartadas:
        this.discarded.selected = selected;
        break;
      default:
        break;
    }
  }

  /** Desseleciona todos os filtros de monitoramento (totalizadores.) */
  unselectedAll() {
    this.all.selected = false;
    this.programmed.selected = false;
    this.initiated.selected = false;
    this.delayed.selected = false;
    this.performed.selected = false;
    this.discarded.selected = false;
    this.indicatorSelected = null;
  }

  /** Aplica o filtro de busca. */
  doSearch(data: string, lostFocus?: boolean) {
    if (lostFocus && this.search === data) return;
    this.search = data;
    this.page = 1;
    this.getCollections();
  }

  /** Muda o GRID de página. */
  pageChange(newPage: number) {
    this.page = newPage;
    this.getCollections();
  }

  /** Muda a quantidade de registros a serem mostrados por página. */
  takeChange(newTake: number) {
    this.take = newTake;
    this.getCollections();
  }

  /** Insere o filtro de data selecionado. */
  setFilterDate(period: PeriodDateFilter) {
    this.periodFilter = period;
    if (this.filterDateSelected !== null) {
      this.page = 1;
      this.getCollections();
    }
  }

  /** Limpa todos os filtros. */
  clearFilters() {
    this.filterColumnSelected = [];
    this.configFilterColumnSelected = [];
    this.columnsFilter = [];
    this.search = '';
    this.unselectedAll();
    this.selectedTotal(this.indicatorsEnum.ColetasTodas, true)
    this.getAdvancedFilter();
    this.page = 1;
    this.getCollections();
  }

  /** Verificação para mostrar/esconder o botão de ações. */
  verifyActions(): boolean {
    if (
      !this.verifyCancelAndDecrease() &&
      !this.verifyPendingAccept() &&
      this.cdCollectionsSelected.length > 1
    ) {
      return false;
    } else {
      return true;
    }
  }

  /** Verificação para mostrar/esconder as ações de Cancelar e Baixar. */
  verifyCancelAndDecrease(): boolean {
    const statusAllowed = [
      StatusColeta.Prevista,
      StatusColeta.Programada,
      StatusColeta.Iniciada
    ];

    return this.verifyStatus(statusAllowed);
  }

  /** Verificação para mostrar/esconder as ações de Imprimir, Compartilhar, Gerar PDF. */
  verifyGenerateRelat(): boolean {
    const statusAllowed = [
      StatusColeta.Prevista,
      StatusColeta.Programada,
      StatusColeta.Iniciada,
      StatusColeta.Baixada
    ];

    return this.verifyStatus(statusAllowed);
  }

  /** Verificação para mostrar/esconder a ação de excluir. */
  verifyDelete(): boolean {
    const statusAllowed = [
      StatusColeta.PendenteAceite,
      StatusColeta.Prevista,
      StatusColeta.Programada
    ];

    return this.verifyStatus(statusAllowed);
  }

  /** Verifica se as coletas selecionadas apresentam os status permitidos. */
  verifyStatus(statusAllowed: string[]): boolean {
    return this.cdCollectionsSelected.every(collection =>
      this.collections.some(collections =>
        collections.cdColeta === collection.cdColeta && statusAllowed.includes(collections.status)
      )
    );
  }

  /** Verifica se a coleta selecionada apresenta o status "Pendente de Aceite". */
  verifyPendingAccept(): boolean {
    if (this.cdCollectionsSelected.length !== 1) return false;

    return this.cdCollectionsSelected.every(collection =>
      this.collections.some(collections =>
        collections.cdColeta === collection.cdColeta &&
        collections.status === StatusColeta.PendenteAceite
      )
    );
  }

  /** Reseta o GRID para a configuração padrão. */
  resetGrid() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-confirm',
    };
    const modalRef = this.modalService.open(ModalConfirmationComponent, modalOptions);
    modalRef.componentInstance.title = 'titleRestaurarGrid';
    modalRef.componentInstance.text = 'textRestaurarGrid';
    modalRef.componentInstance.style = 'green';
    modalRef.componentInstance.textBtnConfirm = 'restaurar';

    modalRef.result.then((res: boolean) => {
      if (res) {
        this.activeDefaultView = true;
        this.collections = [];
        localStorage.removeItem('gridCollections');
        localStorage.removeItem('hideCollections');
        this.initGrid();
      }
    })
    .catch((res) => {

    })
  }

  /** Abre o modal de confirmação de acordo com a ação clicada. */
  openModalConfirm(action: 'delete' | 'accept' | 'send-whatsapp' | 'print' | 'export-excel') {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-confirm',
    };
    const modalRef = this.modalService.open(ModalConfirmationComponent, modalOptions);

    switch (action) {
      case 'delete':
        modalRef.componentInstance.title = this.cdCollectionsSelected.length <= 1 ? 'excluirColeta' : 'excluirColetas';
        modalRef.componentInstance.text = this.cdCollectionsSelected.length <= 1 ? 'textoExcluirColeta' : 'textoExcluirColetas';
        modalRef.componentInstance.style = 'red';
        modalRef.componentInstance.textBtnConfirm = 'excluir';
        break;
      case 'accept':
        modalRef.componentInstance.title = 'aceitarColeta';
        modalRef.componentInstance.text = 'textoAceitarColeta';
        modalRef.componentInstance.style = 'green';
        modalRef.componentInstance.textBtnConfirm = 'simAceitar';
        break;
      case 'send-whatsapp':
        modalRef.componentInstance.title = this.cdCollectionsSelected.length <= 1 ? 'enviarColetaWhatsApp' : 'enviarColetasWhatsApp';
        modalRef.componentInstance.text = this.cdCollectionsSelected.length <= 1 ? 'textoEnviarColetaWhatsApp' : 'textoEnviarColetasWhatsApp';
        modalRef.componentInstance.style = 'green';
        modalRef.componentInstance.textBtnConfirm = 'simEnviar';
        break;
      case 'print':
        modalRef.componentInstance.title = this.cdCollectionsSelected.length <= 1 ? 'imprimirColeta' : 'imprimirColeta';
        modalRef.componentInstance.text = this.cdCollectionsSelected.length <= 1 ? 'textoImprimirColeta' : 'textoImprimirColeta';
        modalRef.componentInstance.style = 'green';
        modalRef.componentInstance.textBtnConfirm = 'simImprimir';
        break;
      case 'export-excel':
        modalRef.componentInstance.title = 'tituloExportarExcel';
        modalRef.componentInstance.text = 'textoExportarExcel';
        modalRef.componentInstance.style = 'green';
        modalRef.componentInstance.textBtnConfirm = 'simExportar';
        break;
    }

    modalRef.result.then((res: boolean) => {
      if (res) {
        if (action === 'delete') { this.deleteCollection() };
        if (action === 'accept') { this.acceptCollection() };
        if (action === 'send-whatsapp') { this.sendToWhatsApp() };
        if (action === 'print') { this.printReport() };
        if (action === 'export-excel') { this.exportExcel() };
      }
    })
    .catch((res) => {

    })
  }

  /** Método responsável pela abertura do modal de seleção de layout de relatório.
   * @param action Ação a ser executada.
   * @param reports Lista de relatórios a ser escolhido.
  */
  openModalSelectReport(action: 'send-whatsapp' | 'print' | 'download-pdf', reports: RelatorioLista[]) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-select-layout-report',
    };
    const modalRef = this.modalService.open(ModalSelectLayoutReportComponent, modalOptions);
    modalRef.componentInstance.reports = reports;
    modalRef.componentInstance.action = action;

    modalRef.result.then((response: { status: boolean, report: RelatorioLista | null }) => {
      if (response.status && response.report !== null) {
        this.cdReportSelected = response.report.codigo;

        if (action === 'send-whatsapp') this.sendToWhatsApp();
        if (action === 'print') this.printReport();
        if (action === 'download-pdf') this.downloadPDFReport();
      }
    })
    .catch((res) => {

    })
  }

  /** Método onde se encontra a lógica de escolha de relatório.
   * @param action Ação a ser executada.
  */
  async setLayoutReport(action: 'send-whatsapp' | 'print' | 'download-pdf') {
    const reports: RelatorioLista[] = await this.getReports();

    if (reports.length === 0) this.cdReportSelected = null;
    if (reports.length === 1) this.cdReportSelected = reports[0].codigo;

    if (reports.length > 1) {
      this.openModalSelectReport(action, reports);
    } else {
      if (action === 'send-whatsapp') this.openModalConfirm(action);
      if (action === 'print') this.openModalConfirm(action);
      if (action === 'download-pdf') this.downloadPDFReport();
    }
  }

  /** Método responsável por chamar a API de listagem de relatórios.
   * @returns Retorna uma lista de relatórios do tipo `RelatorioLista` de acordo com o módulo.
  */
  async getReports(): Promise<RelatorioLista[]> {
    try {
      this.loading = true;
      const response = await this.reportService.getReports(Modules.Coleta).toPromise();
      const reports: RelatorioLista[] = response.dados;
      this.loading = false;
      return reports;
    } catch (error) {
      const response = error as HttpErrorResponse;
      this.loading = false;
      return [];
    }
  }

  /** Abre o modal de cancelamento com motivo. (Ação de rejeitar coleta) */
  openModalReject() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-info',
    };
    const modalRef = this.modalService.open(ModalInfoComponent, modalOptions);
    modalRef.componentInstance.title = 'rejeitarColeta';
    modalRef.componentInstance.text = 'textoRejeitarColeta';
    modalRef.componentInstance.textBtnConfirm = 'rejeitar';

    modalRef.result.then((res: { reason: string }) => {
      if (res.reason) {
        this.rejectCollection(res.reason);
      }
    })
    .catch((res) => {

    })
  }

  /** Abre o modal de cancelamento com motivo. (Ação de cancelar coleta) */
  openModalCancel() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-info',
    };
    const modalRef = this.modalService.open(ModalInfoComponent, modalOptions);
    modalRef.componentInstance.title = this.cdCollectionsSelected.length > 1 ? 'cancelarColetas' : 'cancelarColeta';
    modalRef.componentInstance.text = this.cdCollectionsSelected.length > 1 ? 'textoCancelarColetas' : 'textoCancelarColeta';

    modalRef.result.then((res: { reason: string }) => {
      if (res.reason) {
        this.cancelCollection(res.reason);
      }
    })
    .catch((res) => {

    })
  }

  /** Abre o modal de baixa de coleta. */
  openModalDownloadCollection() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-download-collection',
    };
    const modalRef = this.modalService.open(ModalDownloadCollectionComponent, modalOptions);
    modalRef.componentInstance.collectionsSelected = this.cdCollectionsSelected.length;

    modalRef.result.then((result: any) => {
      if (result) {
        this.downloadCollection(result.date, result.time)
      }
    })
    .catch((res) => {

    })
  }

  /** Abre o modal de histórico de alterações. */
  openModalHistoricChanges() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-historic-changes',
    };
    const modalRef = this.modalService.open(ModalHistoricChangesComponent, modalOptions);
    modalRef.componentInstance.module = 'collection';
    modalRef.componentInstance.codeHistoric = this.cdCollectionsSelected[0];


    modalRef.result
      .then((res: boolean) => {
      })
      .catch((res) => {

      })
  }

  /** Abre o modal de envio de coleta(s) por e-mail. */
  openModalSendEmail() {
    const paramSingle: KeyValue[] = [];
    const paramMultiple: KeyValue[][] = [];

    if (this.cdCollectionsSelected.length === 1) {
      for (const collection of this.cdCollectionsSelected) {
        paramSingle.push(
          {
            chave: 'cdcoleta',
            valor: collection.cdColeta
          },
          {
            chave: 'cdfilemp',
            valor: collection.cdFilEmp
          }
        )
      }
    } else {
      for (const collection of this.cdCollectionsSelected) {
        paramMultiple.push([
          {
            chave: 'cdcoleta',
            valor: collection.cdColeta
          },
          {
            chave: 'cdfilemp',
            valor: collection.cdFilEmp
          }
        ])
      }
    }

    this.getConfigSendEmail(paramSingle, paramMultiple);
  }

  /** Realiza a busca de configurações de contato e layout para abrir o modal de envio de e-mail individual. */
  getConfigSendEmail(paramSingle: KeyValue[], paramMultiple: KeyValue[][]) {
    this.loading = true;
    const param = this.cdCollectionsSelected.length > 1 ? [] : paramSingle;
    this.emailService.getConfigSendEmail(this.companyId, Modules.Coleta, param).subscribe({
      next: (response) => {
        this.loading = false;
        const config: ConfigurationEmail = response.dados;

        this.cdCollectionsSelected.length > 1
          ? this.openModalMultipleEmail(paramMultiple, config)
          : this.openModalSingleEmail(paramSingle, config);
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.type = SnackbarType.Danger;
      }
    })

  }

  /** Abre o modal de envio de e-mail individual. */
  openModalSingleEmail(params: KeyValue[], config: ConfigurationEmail) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-send-email',
    };
    const modalRef = this.modalService.open(ModalSendEmailSingleComponent, modalOptions);
    modalRef.componentInstance.textModal = 'textoModalEnviarColetaEmailUnico';
    modalRef.componentInstance.module = Modules.Coleta;
    modalRef.componentInstance.params = params;
    modalRef.componentInstance.configEmail = config;

    modalRef.result.then((response: { status: boolean, message: string | null }) => {
      if (response.status && response.message) {
        this.snackbar.open = true;
        this.snackbar.message = response.message;
        this.snackbar.type = SnackbarType.Success;
      }
    })
    .catch((res) => {
    })
  }

  /** Abre o modal de envio de e-mail em lote. */
  openModalMultipleEmail(params: KeyValue[][], config: ConfigurationEmail) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-send-email',
    };

    const modalRef = this.modalService.open(ModalSendEmailMultipleComponent, modalOptions);
    modalRef.componentInstance.titleModal = 'titleModalEnviarColetaEmailLote';
    modalRef.componentInstance.textModal = 'textModalEnviarColetaEmailLote';
    modalRef.componentInstance.module = Modules.Coleta;
    modalRef.componentInstance.params = params;
    modalRef.componentInstance.recipient = config.remetente;

    modalRef.result.then((response: { status: boolean, message: string | null }) => {
      if (response.status && response.message) {
        this.snackbar.open = true;
        this.snackbar.message = response.message;
        this.snackbar.type = SnackbarType.Success;
      }
    })
    .catch((res) => {
    })

  }

  /** Realiza a deleção das coletas selecionadas. */
  deleteCollection() {
    this.loading = true;
    this.collectionService.deleteCollection(this.companyId, this.cdCollectionsSelected).subscribe({
      next: (response) => {
        this.loading = false;
        this.getCollections();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.snackbar.type = SnackbarType.Danger;
      }
    })
  }

  /** Envia por e-mail o relatório das coletas selecionadas. */
  sendEmailCollection() {
    this.loading = true;
    this.collectionService.sendEmailCollection(this.companyId, this.cdCollectionsSelected).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.mensagem;
        this.snackbar.type = SnackbarType.Success;
        this.getCollections();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.snackbar.type = SnackbarType.Danger;
      }
    })
  }

  /** Rejeita a coleta selecionada. */
  rejectCollection(reason: string) {
    this.loading = false;
    this.collectionService.rejectCollection(this.companyId, this.cdCollectionsSelected[0].cdColeta, this.cdCollectionsSelected[0].cdFilEmp, reason).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.mensagem;
        this.snackbar.type = SnackbarType.Success;
        this.getCollections();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.snackbar.type = SnackbarType.Danger;
      }
    })
  }

  /** Aceita a coleta selecionada. */
  acceptCollection() {
    this.loading = true;
    this.collectionService.aceptCollection(this.companyId, this.cdCollectionsSelected[0].cdColeta, this.cdCollectionsSelected[0].cdFilEmp).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.mensagem;
        this.snackbar.type = SnackbarType.Success;
        this.getCollections();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.snackbar.type = SnackbarType.Danger;
      }
    })
  }

  /** Cancela as coletas selecionadas. */
  cancelCollection(reason: string) {
    this.loading = true;
    const body = {
      motivo: reason,
      coletas: this.cdCollectionsSelected
    }

    this.collectionService.cancelCollection(this.companyId, body).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.mensagem;
        this.snackbar.type = SnackbarType.Success;
        this.getCollections();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.snackbar.type = SnackbarType.Danger;
      }
    })
  }

  /** Envia por WhatsApp a(s) coleta(s) selecionada(s). */
  sendToWhatsApp() {
    this.loading = true;
    this.collectionService.getUrlToSendRelatoryWpp(this.companyId, this.cdCollectionsSelected, this.cdReportSelected).subscribe({
      next: (response) => {
        this.loading = false;
        this.openWhatsApp(response.dados[0]);
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.snackbar.type = SnackbarType.Danger;
      }
    })
  }

  /** Abre a tela em que redireciona o usuário para enviar a mensagem via WhatsApp. */
  openWhatsApp(collection: { id: string, url: string }) {
    let content = '*ActiveTrans*%0a';
    content += `%0a*Coleta(s) cadastrada(s) na empresa:*%0a${this.subsidiaryName}%0a`;
    content += `%0aPara mais detalhes, clique no link para visualizar a(s) coleta(s): ${collection.url}%0a`;

    window.open(`https://wa.me?text=${content}`, '_blank');
  }

  /** Envia o reletório para impressão. */
  async printReport() {
    try {
      const report = await this.getBase64Report();
      const blob: Blob = b64toBlob(report.base64, 'application/pdf');
      const fileUrl: string = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');

      document.body.appendChild(iframe);

      iframe.style.display = 'none';

      iframe.onload = () => {
        setTimeout(() => {
          if (iframe) {
            iframe.focus();
            iframe.contentWindow?.print();
          }
        }, 0);
      };

      if (iframe) {
        iframe.src = fileUrl;
        URL.revokeObjectURL(fileUrl);
      }
    } catch (error) {
      this.snackbar.open = true;
      this.snackbar.message = 'erroImpressaoRelatorio';
    }
  }

  /** Realiza o download do relatório em PDF. */
  async downloadPDFReport() {
    try {
      const report = await this.getBase64Report();
      const blob = b64toBlob(report.base64, 'application/pdf');
      const fileName = report.id;

      const url = window.URL.createObjectURL(blob);
      const aElement = document.createElement('a');
      document.body.appendChild(aElement);
      aElement.href = url;
      aElement.download = fileName;
      aElement.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(aElement);
    } catch (error) {
      this.snackbar.open = true;
      this.snackbar.message = 'erroDownloadPDFRelatorio';
    }
  }

  /** Retorna o base64 do relatório referente as coletas selecionadas. */
  async getBase64Report(): Promise<any> {
    try {
      this.loading = true;
      const response = await this.collectionService.getBase64Report(this.companyId, this.cdCollectionsSelected, this.cdReportSelected).toPromise();
      this.loading = false;
      return response.dados[0];
    } catch (error) {
      this.loading = false;
      throw error;
    }
  }

  /** Realiza a baixa das coletas selecionadas. */
  downloadCollection(dataBaixa: string, horaColeta: string) {
    this.loading = true;

    let body = {
      Coletas: this.cdCollectionsSelected,
      DataBaixa: dataBaixa,
      HoraColeta: `${horaColeta}:00`,
      TimeZone: getTimeZone()
    };

    this.collectionService.downloadCollection(this.companyId, body).subscribe({
      next: (response) => {
        this.loading = false;
        this.getCollections();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.snackbar.type = SnackbarType.Danger;
      }
    })
  }

  /** Exporta para o excel registros do GRID. */
  exportExcel() {
    const body: ParamsListGrid & { coletas: any } = {
      page: this.params.page,
      take: this.params.take,
      search: this.params.search,
      tipoData: this.params.tipoData,
      status: this.params.status,
      columns: this.columnsHide,
      filtros: this.params.filtros,
      dataInicial: this.params.dataInicial,
      dataFinal: this.params.dataFinal,
      coletas: this.cdCollectionsSelected
    }

    this.loading = true;
    this.collectionService.exportExcel(body, this.companyId).subscribe({
      next: (response: Blob) => {
        const downloadURL = window.URL.createObjectURL(response);
        const link = document.createElement("a");
        link.href = downloadURL;
        link.download = `Coletas-${Date.now()}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.loading = false;
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.snackbar.type = SnackbarType.Danger;
        this.loading = false;
      }
    })
  }

  /** Atualiza o GRID. */
  refreshGrid() {
    this.hideTooltip = true;
    setTimeout(() => {
      this.hideTooltip = false;
    }, 300);

    this.btnRotate += 360;
    this.collections = [];

    this.initGrid();
  }

  /** Verifica e salva as configurações de exibição do GRID (SlickGrid) no storage. */
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

    this.storageService.setConfigGrid(configColumns, 'gridCollections')
    this.storageService.setHideGridColumns(this.columnsHide, 'hideCollections')

  }

  /** Salva em cdCollectionsSelected as coletas que foram selecionadas pelo usuário no GRID. */
  rowsSelected(selected: any[]) {
    this.cdCollectionsSelected = [];
    selected.forEach(collection => {
      this.cdCollectionsSelected.push(
        {
          cdColeta: collection.cdColeta,
          cdFilEmp: collection.cdFilEmp,
        }
      )
    });
  }

  /** Realiza a comparação de 2 arrays e retorna registros que tem diferença de um para o outro. */
  compareArrays(array1: string[], array2: string[]) {
    const diferentIndex: string[] = [];

    array1.forEach((element) => {
      if (!array2.includes(element)) {
        diferentIndex.push(element)
      }
    })

    return diferentIndex ? diferentIndex : [];
  }

  /** Transforma uma data string em Date. */
  stringToDate(dateStr: string): Date {
    const parts = dateStr.split('/');

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    return new Date(year, month, day);
  }

  /** Verifica se a quantidade de registros a serem exportadados excede o recomendado, caso exceda, mostra uma mensagem de aviso ao usuário. (openModalConfirm) */
  verifyExportExcel() {
    if (this.cdCollectionsSelected.length >= WarningColeta) {
      this.openModalConfirm('export-excel');
    } else {
      if (this.totalLenght >= WarningColeta && this.cdCollectionsSelected.length === 0) {
        this.openModalConfirm('export-excel');
      } else {
        this.exportExcel();
      }
    }
  }

}


