import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { ModalGenerateTitleComponent } from '../../modais/modal-generate-title/modal-generate-title.component';
import { ModalObservationComponent } from '../../modais/modal-observation/modal-observation.component';
import { ConferenciaPermissoes } from 'src/app/modules/shared/consts/permissions.const';
import { PeriodDateFilter } from 'src/app/modules/shared/models/period-date.model';
import { setPeriod, setWeekDate } from 'src/app/modules/shared/utils/period.utils';
import { PeriodsFilter } from 'src/app/modules/shared/consts/periods-filter.const';

@Component({
  selector: 'app-volumes-disagreement',
  templateUrl: './volumes-disagreement.component.html',
  styleUrls: ['./volumes-disagreement.component.scss']
})
export class VolumesDisagreementComponent implements OnInit {

  companyId!: string;
  companyName!: string;
  permissions: string [];
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
  columnsDisagreement: ColumnSlickGrid[] = [];
  initCollumns: ColumnSlickGrid[] = [];
  columnsHide: string[] = [];
  conferences: any[] = [];
  volumesDisagreement: any[] = [];
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
  @Input() idGrid: string = 'dinamic-slickgrid';
  opcoesSelecao: string [] = ['Definir como perdido', 'Definir como encontrado', 'Gerar título'];
  hasRowsSelected: boolean = false;

  constructor(private translate: TranslateService,
    private storageService: StorageService,
    private router: Router,
    private modalService: NgbModal,
    private conferenceService: ConferenceService,
    private changeDetector: ChangeDetectorRef) {
    translate.use('pt-br')
    this.companyId = storageService.getCompanyId()!;
    this.permissions = storageService.getPermissionsUser();
    this.companyName = storageService.getCompanyName()!;
    this.savedFilters = storageService.getFiltersGrid('filtersVolumesDisagreement')
      ? storageService.getFiltersGrid('filtersVolumesDisagreement')!
      : <SaveFilters>{};
    storageService.getFiltersGrid('filtersVolumesDisagreement') ? this.setFiltersSaved() : this.setInitialFilter();
    this.getTotalizerDisagreement();
    this.getConferences();
  }
  ngOnInit(): void {
    if (this.permissions.includes(this.authConference.Ler)) {
      this.getColumnsFilter();

      setTimeout(() => {
        // this.initGrid();
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


  // Faz a busca de conferências de acordo com o filtro totalizador selecionado.
  selectedTotal(index: number, selected: boolean, notGet?: boolean) {
    this.unselectedAll();

    selected === true ? this.indicatorSelected = index : this.indicatorSelected = null;
    this.page = 1;
    // if (!notGet)  this.getVolumes();

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
    // this.getConferences();
  }

  // Faz a busca de conferências de acordo com o período inserido.
  setFilterDate(period: PeriodDateFilter) {
    this.periodFilter = period;
    if (this.filterDateSelected !== null) {
      this.page = 1;
      // this.getConferences();
    }
  }

  // Faz a busca das conferências de acordo com o que o usuário inseriu no input de busca.
  doSearch(data: string) {
    this.search = data;
    this.page = 1;
    // this.getConferences();
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
      // this.getConferences();
    }, 0);
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
  // getStatusConference(id: number): string {
  //   for (const conference of this.conferences) {
  //     if (conference.conferencia === id) {
  //       return conference.status;
  //     }
  //   }

  //   return '';
  // }

  // Deleta a(s) conferência(s) selecionada(s).
  deleteConference() {
    this.loading = true;
    this.conferenceService.deleteConference(this.companyId, this.cdConferencesSelected).subscribe({
      next: (response) => {
        this.loading = false;
        this.getConferences();
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
        this.getConferences();
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

    this.getConferences();
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
    this.getConferences();
  }

  // Salva os conteúdos do GRID quando acontece modificação em alguma coluna.
  columnsChanges(event: any) {
    const allIds: string[] = [];
    const showIds: string[] = [];
    const configColumns: ColumnSlickGrid[] = [];

    for (const column of this.columnsDisagreement) {
      allIds.push(column.id)
    }

    for (const column of event) {
      if (column.columnId != "_checkbox_selector") {
        showIds.push(column.columnId)
        configColumns.push({ name: '', id: column.columnId, width: column.width })
      }
    }

    for (const column of configColumns) {
      const foundColumn = this.columnsDisagreement.find((c: any) => c.id === column.id);
      if (foundColumn) {
        column.name = foundColumn.name;
      }
    }

    this.columnsDisagreement.forEach((column) => {
      if (!configColumns.some((configColumn) => configColumn.id === column.id)) {
        configColumns.splice(this.columnsDisagreement.indexOf(column), 0, column)
      }
    })

    this.columnsHide = this.compareArrays(allIds, showIds);

    // this.storageService.setConfigGrid(configColumns, 'gridVolumesDesagreement')
    // this.storageService.setHideGridColumns(this.columnsHide, 'hideVolumesDesagreement')
  }

  // Atribui à "cdConferencesSelected" o id das conferências que foram selecionados.
  rowsSelected(selected: any[]) {
    this.cdConferencesSelected = [];
    selected.forEach(conference => {
      this.cdConferencesSelected.push(conference.conferencia)
    });

    this.hasRowsSelected = this.cdConferencesSelected.length > 0;
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
  goToEdit(conferences: any) {
    this.router.navigate(['conference/actions/volumes-disagreement'], {
      queryParams: { number: conferences.conferencia }
    })
  }

  getColumnsDisagreement(){
    this.columnsDisagreement = [
      {name: 'Código do Volume', id: 'codigoVolume', width: 178},
      {name: 'Data', id: 'data', width: 93},
      {name: 'Hora', id: 'hora', width: 93},
      {name: 'Usuário de conferência', id: 'usuarioConferencia', width: 200},
      {name: 'Número do volume', id: 'numeroVolume', width: 184},
      {name: 'Observações', id: 'observacoes', width: 200},
      {name: 'Status', id: 'status', width: 550},
    ];
  }

  getConferences(){
    this.conferences = [
      { id: 1, codigoVolume: '001', data: '25/03/2024', hora: '13:52', usuarioConferencia: 'Igor Ghiberti', numeroVolume: '5',
      observacoes: 'Abcdef', status: 'Perdido'},
      { id: 2, codigoVolume: '002', data: '27/03/2024', hora: '14:30', usuarioConferencia: 'João Silva', numeroVolume: '6',
      observacoes: 'Lorem ipsum', status: 'Não encontrado'},
      { id: 3, codigoVolume: '003', data: '28/03/2024', hora: '14:00', usuarioConferencia: 'Maria Roberta', numeroVolume: '7',
      observacoes: 'Lorem ipsum', status: 'Não encontrado'},
      { id: 4, codigoVolume: '004', data: '29/03/2024', hora: '15:30', usuarioConferencia: 'José Augusto', numeroVolume: '8',
      observacoes: 'Lorem ipsum', status: 'Não encontrado'},
      { id: 5, codigoVolume: '005', data: '30/03/2024', hora: '17:30', usuarioConferencia: 'Henrique Silva', numeroVolume: '9',
      observacoes: 'Lorem ipsum', status: 'Não encontrado'},
      { id: 6, codigoVolume: '006', data: '1/04/2024', hora: '12:30', usuarioConferencia: 'Jessica Santos', numeroVolume: '10',
      observacoes: 'Lorem ipsum', status: 'Não encontrado'},
    ];
  }

  getTotalizerDisagreement(){
    this.pending.total = 10;
    this.pending.selected = true;
    this.pending.value = '10';

    this.initiated.total = 10;
    this.initiated.selected = true;
    this.initiated.value = '10';

    this.checkedDesagreement.total = 10;
    this.checkedDesagreement.selected = true;
    this.checkedDesagreement.value = '10';

    this.checked.total = 10;
    this.checked.selected = true;
    this.checked.value = '10';
  }

  openModalGenerateTitle(){
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-include-nf',
    };
    const modalRef = this.modalService.open(ModalGenerateTitleComponent, modalOptions);
    modalRef.componentInstance.enableInputTag = true;
  }

  openModalObservation(){
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-observation',
    };
    const modalRef = this.modalService.open(ModalObservationComponent, modalOptions);
  }

}
