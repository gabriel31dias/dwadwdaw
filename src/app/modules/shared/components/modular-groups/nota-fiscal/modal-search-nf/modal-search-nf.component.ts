import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { ColumnFilter, RequestFilterColumn, SearchColumnFilter } from 'src/app/modules/shared/models/filter-column.model';
import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { PeriodDateFilter } from 'src/app/modules/shared/models/period-date.model';
import { AdvancedFilter } from 'src/app/modules/shared/models/save-filters.model';
import { setDefaultViewGrid } from 'src/app/modules/shared/utils/grid-utils';
import { defaultViewGridSearchNF } from 'src/app/modules/shared/consts/default-view-grid.const';
import { configGMSelectionNF } from 'src/app/modules/shared/consts/columns-gm-selection-nf.const';
import { NotaFiscalService } from 'src/app/modules/shared/services/nota-fiscal.service';
import { SnackbarType } from 'src/app/modules/shared/consts/snackbar-type.const';
import { ParamsGrid } from 'src/app/modules/shared/models/params-grid.model';
import { setPeriod } from 'src/app/modules/shared/utils/period.utils';
import { PeriodsFilter } from 'src/app/modules/shared/consts/periods-filter.const';
import { isNullOrWhitespace } from 'src/app/modules/shared/utils/string-utils';
import { formatterNFToGridArray } from 'src/app/modules/shared/utils/nota-fiscal.utils';
import { compareArrays } from 'src/app/modules/shared/utils/array-utils';
import { NotaFiscalGrid } from 'src/app/modules/shared/models/nota-fiscal.model';
import { ModalConfirmationComponent } from '../../../modais/modal-confirmation/modal-confirmation.component';
import { hiddenModal, visibleModal } from 'src/app/modules/shared/utils/modal-utils';

@Component({
  selector: 'app-modal-search-nf',
  templateUrl: './modal-search-nf.component.html',
  styleUrls: ['./modal-search-nf.component.scss']
})
export class ModalSearchNfComponent implements OnInit {

  companyId: string;
  snackbar: Snackbar = new Snackbar();
  loading: boolean = false;
  nfs: NotaFiscalGrid[] = [];
  nfSelecteds: NotaFiscalGrid[] = [];
  columns: ColumnSlickGrid[] = [];
  columnsHide: string[] = [];
  periodFilter: PeriodDateFilter = <PeriodDateFilter>{};
  filtersDate: string[] = ['Inclusão', 'Emissão'];
  filterDateSelected: number | null = null;
  search: string = '';
  columnsFilter: ColumnFilter[] = [];
  filterColumnSelected: RequestFilterColumn[] = [];
  configFilterColumnSelected: SearchColumnFilter[] = [];

  /** Construtor da classe `ModalSearchNfComponent`.
   * @param translateService Service responsável pela tradução do sistema.
   * @param modal Referência ao modal ativo.
   * @param storageService Service responsável por buscar e inserir dados no Storage.
   * @param notaFiscalService Service responsável pelas chamadas de APIs de Notas Fiscais.
  */
  constructor(private translateService: TranslateService,
    private modal: NgbActiveModal,
    private modalService: NgbModal,
    private storageService: StorageService,
    private notaFiscalService: NotaFiscalService
  ) {
    this.translateService.use('pt-br');
    this.companyId = this.storageService.getCompanyId()!;
  }

  /** Método executado ao carregar o componente. */
  ngOnInit(): void {
    if (isNullOrWhitespace(this.search)) this.setInitialFilter();
    this.getFilters();
  }

  /** Monta os filtros avançados do GRID. */
  getFilters() {
    this.loading = true;
    this.notaFiscalService.getFiltersGrid(this.companyId).subscribe({
      next: (response) => {
        this.loading = false;
        this.columnsFilter = response.dados;
        this.initGrid();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.snackbar.type = SnackbarType.Danger;
        this.initGrid();
      }
    })
  }

  /** Monta o GRID com base nas configurações salvas no armazenamento do usuário ou utiliza as
    * configurações padrão caso não haja nenhuma configuração salva. */
  initGrid() {
    const gridConfig = localStorage.getItem('gridModalSearchNF');
    const hideConfig = localStorage.getItem('hideModalSearchNF');
    if (gridConfig === null && hideConfig === null) {
      this.columns = configGMSelectionNF;
      this.columnsHide = setDefaultViewGrid(defaultViewGridSearchNF, this.columns);
    } else {
      this.columns = this.storageService.getConfigGrid('gridModalSearchNF');
      this.columnsHide = this.storageService.getHideGridColumns('hideModalSearchNF');
    }

    this.getNfs();
  }

  /** Busca as notas fiscais de acordo com os filtros. */
  getNfs() {
    this.loading = true;

    const params: ParamsGrid = {
      pagina: 1,
      quantidade: 100,
      busca: this.search,
      filtros: this.filterColumnSelected,
      status: null,
      tipo_data: this.filterDateSelected,
      data_inicial: this.periodFilter.initDate ? `${this.periodFilter.initDate}T00:00:00` : null,
      data_final: this.periodFilter.finalDate ? `${this.periodFilter.finalDate}T23:59:59` : null,
    }

    if (params.tipo_data === null || params.data_inicial === null || params.data_final === null) {
      params.tipo_data = null;
      params.data_inicial = null;
      params.data_final = null;
    }

    this.notaFiscalService.getGridSearchNF(this.companyId, params).subscribe({
      next: (response) => {
        const nfsAPI = response.dados;
        this.nfs = formatterNFToGridArray(nfsAPI);
        this.loading = false;
      },
      error: (response) => {
        this.nfs = [];
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.snackbar.type = SnackbarType.Danger;
        this.loading = false;
      },
    })
  }

  /** Insere o filtro inicial de uma semana. */
  setInitialFilter() {
    this.periodFilter = setPeriod(PeriodsFilter.Today);
    this.filterDateSelected = 0;
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

    this.modal.update(hiddenModal);
    modalRef.dismissed.subscribe(() => {
      this.modal.update(visibleModal);
    });

    modalRef.result.then((res: boolean) => {
      if (res) {
        this.nfs = [];
        localStorage.removeItem('gridModalSearchNF');
        localStorage.removeItem('hideModalSearchNF');
        this.initGrid();
      }

      this.modal.update(visibleModal);
    })
    .catch((res) => {
      this.modal.update(visibleModal);
    })
  }

  /** Atualiza a lista de itens selecionados.
   * @param selecteds Itens selecionados.
  */
  rowsSelected(selecteds: any) {
    this.nfSelecteds = selecteds;
  }

  /** Aplica os filtros avançados.
   * @param filter Objeto do tipo `AdvancedFilter` que contém as informações dos filtros aplicados na tela.
  */
  setAdvancedFilter(filter: AdvancedFilter) {
    this.filterColumnSelected = filter.request;
    this.configFilterColumnSelected = filter.configFilters;
    this.getNfs();
  }

  /** Atualiza o filtro de data e recupera a página inicial dos dados se um filtro de data estiver selecionado.
   * @param period Perído de data a ser aplicado o filtro.
  */
  setFilterDate(period: PeriodDateFilter) {
    this.periodFilter = period;
    if (this.filterDateSelected !== null) {
      this.getNfs();
    }
  }

  /** Aplica o filtro de busca.
   * @param searchFiled Campo de busca.
   * @param lostFocus Váriavel para indicar se o usuário perdeu o foco no campo de busca.
  */
  doSearch(searchFiled: string, lostFocus?: boolean) {
    if (lostFocus && this.search === searchFiled) return;
    this.search = searchFiled;
    this.getNfs();
  }

  /** Limpa todos os filtros. */
  clearFilters() {
    this.filterColumnSelected = [];
    this.configFilterColumnSelected = [];
    this.columnsFilter = [];
    this.search = '';
    this.getNfs();
  }

  /** Fecha o modal de Busca de nota fiscal */
  close() {
    this.modal.close([]);
  }

  /** Verifica se há itens selecionados e realiza a ação de fechamento do modal ou exibe uma mensagem de erro. */
  confirmSelect() {
    if (this.nfSelecteds.length >= 1) {
      this.modal.close(this.nfSelecteds);
    } else {
      this.snackbar.open = true;
      this.snackbar.message = 'erroFinalizarSelecaoNf';
    }
  }

  /** Verifica e salva as configurações de exibição do GRID (SlickGrid) no storage.
   * @param event Informações de configurações do GRID retornado pelo SlickGrid.
  */
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

    this.columnsHide = compareArrays(allIds, showIds);

    this.storageService.setConfigGrid(configColumns, 'gridModalSearchNF')
    this.storageService.setHideGridColumns(this.columnsHide, 'hideModalSearchNF')
  }

}
