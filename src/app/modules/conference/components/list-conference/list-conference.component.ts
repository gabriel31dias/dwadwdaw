import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { FiltroDataConferencia } from 'src/app/modules/shared/models/filter-date.enum';
import { IndicadoresConferencia } from 'src/app/modules/shared/models/indicators.enum';
import { ColumnFilter, RequestFilterColumn, SearchColumnFilter } from 'src/app/modules/shared/models/filter-column.model';
import { Totalizer } from 'src/app/modules/shared/models/totalizer.model';
import { TableDinamicGridComponent } from 'src/app/modules/shared/components/tables/table-dinamic-grid/table-dinamic-grid.component';
import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { ModalHistoricChangesComponent } from 'src/app/modules/shared/components/modais/modal-historic-changes/modal-historic-changes.component';
import { ModalConfirmationComponent } from 'src/app/modules/shared/components/modais/modal-confirmation/modal-confirmation.component';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { ConferenceService } from '../../services/conference.service';
import { formatDateBrToUtc, formatDateStringUTC, formatDateUtcToBr } from 'src/app/modules/shared/utils/date-utils';
import { b64toBlob } from 'src/app/modules/shared/utils/b64-to-blob';
import { InputSearchComponent } from 'src/app/modules/shared/components/inputs/input-search/input-search.component';
import { ParamsListConference } from '../../models/params-list-conference.model';
import { ModalSearchVolumesComponent } from '../../modais/modal-search-volumes/modal-search-volumes.component';
import { AdvancedFilter, SaveFilters } from 'src/app/modules/shared/models/save-filters.model';
import { ModalInfoComponent } from 'src/app/modules/shared/components/modais/modal-info/modal-info.component';
import { Modules } from 'src/app/modules/shared/consts/list-modules.const';
import { GridService } from 'src/app/modules/shared/services/grid.service';
import { setDynamicColumnsGrid } from 'src/app/modules/shared/utils/grid-utils';
import { ConferenciaPermissoes } from 'src/app/modules/shared/consts/permissions.const';
import { PeriodDateFilter } from 'src/app/modules/shared/models/period-date.model';
import { setPeriod, setWeekDate } from 'src/app/modules/shared/utils/period.utils';
import { PeriodsFilter } from 'src/app/modules/shared/consts/periods-filter.const';

@Component({
  selector: 'app-list-conference',
  templateUrl: './list-conference.component.html',
  styleUrls: ['./list-conference.component.scss']
})
export class ListConferenceComponent implements OnInit {

  companyId: string;
  companyName: string;
  permissions: string [] = [];
  authConference = ConferenciaPermissoes;
  pending: Totalizer = <Totalizer>{};
  initiated: Totalizer = <Totalizer>{};
  checkedDesagreement: Totalizer = <Totalizer>{};
  checked: Totalizer = <Totalizer>{};
  indicatorSelected: number | null = null;
  indicatorsEnum = IndicadoresConferencia;
  columnsFilter: ColumnFilter[] = [];
  filterColumnSelected: RequestFilterColumn[] = [];
  configFilterColumnSelected: SearchColumnFilter[] = [];
  filterDate = [ FiltroDataConferencia[0], FiltroDataConferencia[1] ];
  filterDateSelected: number | null = null;
  filterDateEnum = FiltroDataConferencia;
  periodFilter: PeriodDateFilter = <PeriodDateFilter>{};
  search: string = '';
  btnRotate: number = 0;
  @ViewChild(TableDinamicGridComponent) table!: TableDinamicGridComponent;
  columns: ColumnSlickGrid[] = [];
  initCollumns: ColumnSlickGrid[] = [];
  columnsHide: string[] = [];
  conferences: any[] = [];
  cdConferencesSelected: any[] = [];
  page: number = 1;
  take: number = 100;
  totalLenght: number = 0;
  snackbar: Snackbar = new Snackbar();
  params: ParamsListConference = <ParamsListConference>{};
  loading: boolean = false;
  @ViewChild(InputSearchComponent) InputSearchComponent!: InputSearchComponent;
  savedFilters: SaveFilters = <SaveFilters>{};
  hideTooltip: boolean = false;

  constructor(private translate: TranslateService,
    private storageService: StorageService,
    private router: Router,
    private modalService: NgbModal,
    private conferenceService: ConferenceService,
    private changeDetector: ChangeDetectorRef,
    private gridService: GridService
  ) {
    translate.use('pt-br')
    this.companyId = storageService.getCompanyId()!;
    this.permissions = storageService.getPermissionsUser();
    this.companyName = storageService.getCompanyName()!;
    this.savedFilters = storageService.getFiltersGrid('filtersConference')
      ? storageService.getFiltersGrid('filtersConference')!
      : <SaveFilters>{};
    storageService.getFiltersGrid('filtersConference') ? this.setFiltersSaved() : this.setInitialFilter();
  }

  ngOnInit(): void {
    if (this.permissions.includes(this.authConference.Ler)) {
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
    this.columnsHide = this.storageService.getHideGridColumns('hideConferences');
    this.columns = this.storageService.getConfigGrid('gridConferences');

    this.gridService.getHeaders(this.companyId, Modules.Conferencia).subscribe({
      next: (response) => {
        const columnsBackend: any[] = response.dados;

        this.columns = setDynamicColumnsGrid(this.columns, columnsBackend);
        this.storageService.setConfigGrid(this.columns, 'gridConferences');

        this.getConference();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  // Faz a bsuca de conferências de acordo com o filtro totalizador selecionado.
  selectedTotal(index: number, selected: boolean, notGet?: boolean) {
    this.unselectedAll();

    selected === true ? this.indicatorSelected = index : this.indicatorSelected = null;
    this.page = 1;
    if (!notGet) this.getConference();

    switch (index) {
      case this.indicatorsEnum.Pendentes:
        this.pending.selected = selected;
        break;
      case this.indicatorsEnum.Iniciadas:
        this.initiated.selected = selected;
        break;
      case this.indicatorsEnum.ConferidasEmDesacordo:
        this.checkedDesagreement.selected = selected;
        break;
      case this.indicatorsEnum.Conferidas:
        this.checked.selected = selected;
        break;
    }
  }

  // Desseleciona todas as opções de filtro totalizador.
  unselectedAll() {
    this.pending.selected = false;
    this.initiated.selected = false;
    this.checkedDesagreement.selected = false;
    this.checked.selected = false;
    this.indicatorSelected = null;
  }

  // Trás as opções de colunas para o filtro dinâmico.
  getColumnsFilter() {
    this.conferenceService.getColumnsFilter(this.companyId).subscribe({
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

  // Faz a busca de conferências de acordo com os filtros de colunas aplicado.
  setFilterColumn(filter: AdvancedFilter) {
    this.filterColumnSelected = filter.request;
    this.configFilterColumnSelected = filter.configFilters;
    this.page = 1;
    this.getConference();
  }

  // Faz a busca de conferências de acordo com o período inserido.
  setFilterDate(period: PeriodDateFilter) {
    this.periodFilter = period;

    if (this.filterDateSelected !== null) {
      this.page = 1;
      this.getConference();
    }
  }

  // Faz a busca das conferências de acordo com o que o usuário inseriu no input de busca.
  doSearch(data: string, lostFocus?: boolean) {
    if (lostFocus && this.search === data) return;
    this.search = data;
    this.page = 1;
    this.getConference();
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
      this.getConference();
    }, 0);
  }

  // Abre o modal de confirmação de acordo com a ação clicada.
  openModalConfirm(action: 'print-tag' | 'delete' | 'send-email' | 'send-whatsapp') {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-confirm',
    };
    const modalRef = this.modalService.open(ModalConfirmationComponent, modalOptions);

    switch (action) {
      case 'print-tag':
        let countTag: number = 0;
        this.conferences.forEach(conference => {
          if (conference.conferencia === this.cdConferencesSelected[0]) {
            countTag = conference.quantidadeVolumes;
          }
        })

        modalRef.componentInstance.title = 'imprimirEtiquetas';
        modalRef.componentInstance.text = `Você realmente deseja imprimir ${countTag} etiquetas dessa conferência?`;
        modalRef.componentInstance.style = 'green';
        modalRef.componentInstance.textBtnConfirm = 'simImprimir';
        break;
      case 'delete':
        modalRef.componentInstance.title = this.cdConferencesSelected.length <= 1 ? 'excluirConferencia' : 'excluirConferencias';
        modalRef.componentInstance.text = this.cdConferencesSelected.length <= 1 ? 'textoExcluirConferencia' : 'textoExcluirConferencias';
        modalRef.componentInstance.style = 'red';
        modalRef.componentInstance.textBtnConfirm = 'excluir';
        break;
      case 'send-email':
        modalRef.componentInstance.title = this.cdConferencesSelected.length <= 1 ? 'enviarConferenciaEmail' : 'enviarConferenciasEmail';
        modalRef.componentInstance.text = this.cdConferencesSelected.length <= 1 ? 'textoEnviarConferenciaEmail' : 'textoEnviarConferenciasEmail';
        modalRef.componentInstance.style = 'green';
        modalRef.componentInstance.textBtnConfirm = 'simEnviar';
        break;
      case 'send-whatsapp':
        modalRef.componentInstance.title = this.cdConferencesSelected.length <= 1 ? 'enviarConferenciaWhatsApp' : 'enviarConferenciasWhatsApp';
        modalRef.componentInstance.text = this.cdConferencesSelected.length <= 1 ? 'textoEnviarConferenciaWhatsApp' : 'textoEnviarConferenciasWhatsApp';
        modalRef.componentInstance.style = 'green';
        modalRef.componentInstance.textBtnConfirm = 'simEnviar';
        break;
    }

    modalRef.result.then((res: boolean) => {
      if (res) {
        if (action === 'print-tag') this.printTagConference();
        if (action === 'delete') this.deleteConference();
        if (action === 'send-email') this.sendEmail();
        if (action === 'send-whatsapp') this.sendToWhatsApp();
      }
    })
    .catch((res) => {

    })
  }

  // Faz a busca no backend das etiquetas a serem impressas da conferência.
  printTagConference() {
    this.loading = true;
    this.conferenceService.printTagsConference(this.companyId, Number(this.cdConferencesSelected[0])).subscribe({
      next: (response) => {
        this.loading = false;

        const tags = response.dados[0];

        this.openWindowPrint(tags)
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro
        this.loading = false;
      }
    })
  }

  // Abre a janela para impressão das etiquetas.
  openWindowPrint(base64: string) {
    const pdfWindow = window.open('', '', 'width=600,height=800');

    const blob: Blob = b64toBlob(base64, 'application/pdf');
    const fileURL: string = URL.createObjectURL(blob);

    pdfWindow?.document.write(
      `<html>
        <head>
          <title>ActiveTrans - Impressão de etiqueta</title>
        </head>
        <body>
          <embed width='100%' height='100%' src='${fileURL}'/>
        </body>
      </html>`
    );

  }

  // Envia a conferência por e-mail.
  sendEmail() {
    this.loading = true;
    this.conferenceService.sendEmail(this.companyId, this.cdConferencesSelected).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = this.cdConferencesSelected.length >= 2 ? 'conferenciasEnviadas' : 'conferenciaEnviada';
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro
      }
    })
  }

  // Envia a(s) conferência(s) por WhatsApp.
  sendToWhatsApp() {
    this.loading = true;
    this.conferenceService.getUrlToSendRelatoryWpp(this.companyId, this.cdConferencesSelected).subscribe({
      next: (response) => {
        this.loading = false;
        this.openWhatsApp(response.dados[0]);
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = 'Não foi possível enviar as conferências selecionadas para o WhatsApp.';
        this.snackbar.errorHandling = response.error.tratamentoErro
      }
    })
  }

  openWhatsApp(conference: { id: string, url: string }) {
    let content = '*ActiveTrans*%0a';
    content += `%0a*Conferência(s) cadastrada(s) na empresa:*%0a${this.companyName}%0a`;
    content += `%0aPara mais detalhes, clique no link para visualizar a(s) conferência(s): ${conference.url}%0a`;

    window.open(`https://wa.me?text=${content}`, '_blank');
  }

  // Verifica se as conferências selecionadas podem ser deletadas.
  verifyConfDelete(): boolean {
    if (this.permissions.includes(this.authConference.Apagar)) {
      return this.cdConferencesSelected.every(idConference =>
        this.conferences.some(conference =>
          conference.conferencia === idConference && conference.status === 'Pendente'
        )
      );
    } else {
      return false;
    }
  }

  // Verifica se as conferências selecionadas podem ser canceladas.
  verifyConfCancel(): boolean {
    if (!this.permissions.includes(this.authConference.Cancelar)) return false;

    return this.cdConferencesSelected.every(idConference =>
      this.conferences.some(conference =>
        conference.conferencia === idConference &&
        (conference.status === 'Iniciada' || conference.status === 'Pendente')
      )
    );
  }

  // Retorna o status da conferência de acordo com seu id (número).
  getStatusConference(id: number): string {
    for (const conference of this.conferences) {
      if (conference.conferencia === id) {
        return conference.status;
      }
    }

    return '';
  }

  // Deleta a(s) conferência(s) selecionada(s).
  deleteConference() {
    this.loading = true;
    this.conferenceService.deleteConference(this.companyId, this.cdConferencesSelected).subscribe({
      next: (response) => {
        this.loading = false;
        this.getConference();
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro
        this.loading = false;
      }
    })
  }

  // Abre o modal de cancelamento de conferência.
  openModalCancelConference() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-info',
    };
    const modalRef = this.modalService.open(ModalInfoComponent, modalOptions);
    modalRef.componentInstance.title = this.cdConferencesSelected.length > 1 ? 'cancelarConferencias' : 'cancelarConferencia';
    modalRef.componentInstance.text = this.cdConferencesSelected.length > 1 ? 'textoCancelarConferencias' : 'textoCancelarConferencia';

    modalRef.result.then((res: { reason: string }) => {
      if (res.reason) {
        this.cancelConference(res.reason);
      }
    })
    .catch((res) => {

    })
  }

  // Cancela a conferência retornada do modal de cancelamento.
  cancelConference(reason: string) {
    this.loading = true;
    this.conferenceService.cancelConference(this.companyId, this.cdConferencesSelected, reason).subscribe({
      next: (response) => {
        this.loading = false;
        this.getConference();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro
      }
    })
  }

  // Abre o modal de histórico de alterações.
  openModalHistoricChanges() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-historic-changes',
    };
    const modalRef = this.modalService.open(ModalHistoricChangesComponent, modalOptions);
    modalRef.componentInstance.module = 'conference';
    modalRef.componentInstance.codeHistoric = this.cdConferencesSelected[0];

    modalRef.result
      .then((res: boolean) => {
      })
      .catch((res) => {

      })
  }

  // Envia o reletório para impressão.
  async printReport() {
    try {
      const base64 = await this.getBase64Receivables();
      const blob: Blob = b64toBlob(base64, 'application/pdf');
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

  // Realiza o download do relatório em PDF.
  async downloadPDFReport() {
    try {
      const base64 = await this.getBase64Receivables();
      const blob = b64toBlob(base64, 'application/pdf');
      const fileName = `conferencia-${new Date().getTime().toString()}`;

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

  // Retorna o base64 do relatório referente as conferências selecionadas.
  async getBase64Receivables(): Promise<string> {
    try {
      this.loading = true;
      const response = await this.conferenceService.getBase64Report(this.companyId, this.cdConferencesSelected).toPromise();
      this.loading = false;
      return response.dados[0].base64;
    } catch (error) {
      this.loading = false;
      throw error;
    }
  }

  // Atualiza o GRID e os totalizadores.
  refreshGrid() {
    this.hideTooltip = true;
    setTimeout(() => {
      this.hideTooltip = false;
    }, 300);

    this.btnRotate += 360;
    this.conferences = [];

    this.initGrid();
  }

  // Busca as conferências para alimentar o GRID.
  getConference() {
    this.loading = true;
    if (this.cdConferencesSelected.length >= 1) {
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
      take: this.take
    }
    this.storageService.setFiltersGrid(this.savedFilters, 'filtersConference');

    this.conferenceService.getConferences(this.params, this.companyId).subscribe({
      next: (response) => {
        this.conferences = response.dados.items;
        this.pending.total = response.dados.counters.statusPendente;
        this.initiated.total = response.dados.counters.statusIniciada;
        this.checkedDesagreement.total = response.dados.counters.statusConferidaDesacordo;
        this.checked.total = response.dados.counters.statusConferida;

        let count = 0;
        for (const conference of this.conferences) {
          conference.id = count;
          conference.descricao = response.dados.items[count].descricao;
          conference.status = response.dados.items[count].status ? response.dados.items[count].status : response.dados.items[count].Status;
          conference.fimConferencia = response.dados.items[count].dataFinalConferencia;

          if (response.dados.items[count].contadores !== null) {
            conference.quantidadeNfs = response.dados.items[count].contadores.QUANTIDADE_NOTASFISCAIS !== null ? response.dados.items[count].contadores.QUANTIDADE_NOTASFISCAIS : '-';
            conference.nfsConferidas = response.dados.items[count].contadores.TOTAL_NOTASFISCAIS_CONFERIDAS !== null ? response.dados.items[count].contadores.TOTAL_NOTASFISCAIS_CONFERIDAS : '-';
            conference.nfsRecusadas = response.dados.items[count].contadores.TOTAL_NOTASFISCAIS_DESACORDO !== null ? response.dados.items[count].contadores.TOTAL_NOTASFISCAIS_DESACORDO : '-';
            conference.quantidadeVolumes = response.dados.items[count].contadores.QUANTIDADE_TOTAL_ETIQUETA !== null ? response.dados.items[count].contadores.QUANTIDADE_TOTAL_ETIQUETA : '-';
          } else {
            conference.quantidadeNfs = '-';
            conference.nfsConferidas = '-';
            conference.nfsRecusadas = '-';
            conference.quantidadeVolumes = '-';
          }

          count++;
        }

        this.totalLenght = response.dados.filteredTotal;
        this.loading = false;
      },
      error: (response) => {
        this.conferences = [];
        this.pending.total = 0;
        this.initiated.total = 0;
        this.checkedDesagreement.total = 0;
        this.checked.total = 0;
        this.totalLenght = 0;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.loading = false;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })

    this.changeDetector.detectChanges();
  }

  // Redireciona para a tela de criação de conferência.
  goToNewConference(event: any) {
    if (this.permissions.includes(this.authConference.Criar)) {
      this.router.navigate(['conference/actions']);
    } else {
      this.snackbar.open = true;
      this.snackbar.timeHide = 10000;
      this.snackbar.message = 'usuarioSemPermissaoCadastroConferencia';
    }
  }

  // Faz a busca de uma nova página selecionada no GRID.
  pageChange(newPage: number) {
    this.page = newPage;
    this.getConference();
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

    this.storageService.setConfigGrid(configColumns, 'gridConferences')
    this.storageService.setHideGridColumns(this.columnsHide, 'hideConferences')
  }

  // Atribui à "cdConferencesSelected" o id das conferências que foram selecionados.
  rowsSelected(selected: any[]) {
    this.cdConferencesSelected = [];
    selected.forEach(conference => {
      this.cdConferencesSelected.push(conference.conferencia)
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

  // Redireciona para a edição dos dados da conferência.
  goToEdit(conference: any) {
    this.router.navigate(['/conference/actions'], {
      queryParams: { number: conference.conferencia }
    })
  }

  // Atualiza o status da conferência de "Pendente" para "Iniciada"
  checkConference() {
    this.conferenceService.initConference(this.companyId, this.cdConferencesSelected[0]).subscribe({
      next: (response) => {
        this.goToConferenceVolumes();
      },
      error: (response) => {
        this.goToConferenceVolumes();
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.snackbar.message = response.error.mensagem;

      }
    })
  }

  // Vai direto para a aba de conferência de volumes do volume selecionado.
  goToConferenceVolumes() {
    this.router.navigate(['/conference/actions'], {
      queryParams: { number: this.cdConferencesSelected[0], check: true }
    })
  }

  // Abre o modal de consulta de volumes.
  openQueryVolumes() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-search-volumes',
    };
    const modalRef = this.modalService.open(ModalSearchVolumesComponent, modalOptions);

    modalRef.result.then((response) => {
      if (response) {

      }
    })
    .catch((response) => {


    })
  }

}
