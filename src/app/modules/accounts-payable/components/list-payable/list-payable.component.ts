import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ColumnFilter, RequestFilterColumn, SearchColumnFilter } from 'src/app/modules/shared/models/filter-column.model';
import { ReceivableService } from 'src/app/modules/accounts-receivable/services/receivable.service';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { FiltroDataContasPagar, FiltroDataContasPagarBackend } from 'src/app/modules/shared/models/filter-date.enum';
import { IndicadoresContasPagar } from 'src/app/modules/shared/models/indicators.enum';
import { SaveFilters } from 'src/app/modules/shared/models/save-filters.model';
import { Totalizer } from 'src/app/modules/shared/models/totalizer.model';
import { formatDateBrToUtc, formatDateStringUTC, formatDateUtcToBr, formatOnlyDateBack } from 'src/app/modules/shared/utils/date-utils';
import { GridService } from 'src/app/modules/shared/services/grid.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { setDynamicColumnsGrid } from 'src/app/modules/shared/utils/grid-utils';
import { Modules } from 'src/app/modules/shared/consts/list-modules.const';
import { removeCurrencyMask, setCurrencyMask } from 'src/app/modules/shared/utils/currency-mask';
import { setMaskCpfCnpj } from 'src/app/modules/shared/utils/cnpj-mask';
import { ParamsListGrid } from 'src/app/modules/shared/models/params-list-grid.model';
import { TableDinamicGridComponent } from 'src/app/modules/shared/components/tables/table-dinamic-grid/table-dinamic-grid.component';
import { ModalSendReceivableEmailComponent } from 'src/app/modules/accounts-receivable/modais/modal-send-receivable-email/modal-send-receivable-email.component';
import { ModalConfirmationComponent } from 'src/app/modules/shared/components/modais/modal-confirmation/modal-confirmation.component';
import { b64toBlob } from 'src/app/modules/shared/utils/b64-to-blob';
import { ModalDecreaseBillComponent } from 'src/app/modules/accounts-receivable/modais/modal-decrease-bill/modal-decrease-bill.component';
import { ModalReverseBillComponent } from 'src/app/modules/accounts-receivable/modais/modal-reverse-bill/modal-reverse-bill.component';
import { ModalInfoComponent } from 'src/app/modules/shared/components/modais/modal-info/modal-info.component';
import { ModalLaunchMovementComponent } from 'src/app/modules/accounts-receivable/modais/modal-launch-movement/modal-launch-movement.component';
import { ModalHistoricChangesComponent } from 'src/app/modules/shared/components/modais/modal-historic-changes/modal-historic-changes.component';
import { ModalSendToBankComponent } from 'src/app/modules/accounts-receivable/modais/modal-send-to-bank/modal-send-to-bank.component';
import { ModalUploadFilesComponent } from 'src/app/modules/shared/components/modais/modal-upload-files/modal-upload-files.component';
import { ModalInvalidFileComponent } from 'src/app/modules/shared/components/modais/modal-invalid-file/modal-invalid-file.component';
import { PeriodDateFilter } from 'src/app/modules/shared/models/period-date.model';
import { setPeriod, setWeekDate } from 'src/app/modules/shared/utils/period.utils';
import { PeriodsFilter } from 'src/app/modules/shared/consts/periods-filter.const';

@Component({
  selector: 'app-list-payable',
  templateUrl: './list-payable.component.html',
  styleUrls: ['./list-payable.component.scss']
})
export class ListPayableComponent implements OnInit {

  opened: Totalizer = <Totalizer>{};
  maturityToday: Totalizer = <Totalizer>{};
  overdue: Totalizer = <Totalizer>{};
  lowered: Totalizer = <Totalizer>{};
  companyId: string;
  companyName: string;
  columnsFilter: ColumnFilter[] = [];
  indicatorSelected: number | null = null;
  indicatorsEnum = IndicadoresContasPagar;
  periodFilter: PeriodDateFilter = <PeriodDateFilter>{};
  filterDate = [ FiltroDataContasPagar[0], FiltroDataContasPagar[1], FiltroDataContasPagar[2], FiltroDataContasPagar[3] ];
  filterDateSelected: number | null = null;
  filterDateEnum = FiltroDataContasPagar;
  filterDateBackendEnum = FiltroDataContasPagarBackend;
  filterStatusBackendEnum = FiltroDataContasPagarBackend;
  page: number = 1;
  take: number = 100;
  receivables: any[] = [];
  columnsHide: string[] = [];
  columns: ColumnSlickGrid[] = [];
  totalLenght: number = 0;
  loading: boolean = false;
  savedFilters: SaveFilters = <SaveFilters>{};
  snackbar: Snackbar = new Snackbar();
  filterColumnSelected: RequestFilterColumn[] = [];
  configFilterColumnSelected: SearchColumnFilter[] = [];
  search: string = '';
  optionsTake: number[] = [ 50, 100, 200, 500 ];
  params: ParamsListGrid = <ParamsListGrid>{};
  cdPayablesSelected: any[] = [];
  @ViewChild(TableDinamicGridComponent) table!: TableDinamicGridComponent;
  hideTooltip: boolean = false;
  showImport: boolean = true;
  btnRotate: number = 0;

  constructor(private translate: TranslateService,
    private storageService: StorageService,
    private router: Router,
    private modalService: NgbModal,
    private changeDetector: ChangeDetectorRef,
    private receivableService: ReceivableService,
    private gridService: GridService
  ) {
    translate.use('pt-br')
    this.companyId = storageService.getCompanyId()!;
    this.companyName = storageService.getCompanyName()!;
    this.savedFilters = storageService.getFiltersGrid('filtersAccountPayable')
      ? storageService.getFiltersGrid('filtersAccountPayable')!
      : <SaveFilters>{};
    storageService.getFiltersGrid('filtersAccountPayable') ? this.setFiltersSaved() : this.setInitialFilter();
  }

  ngOnInit(): void {
    this.initGrid();
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


  initGrid() {
    this.loading = true;
    this.columnsHide = this.storageService.getHideGridColumns('hideAccountsPayables');
    this.columns = this.storageService.getConfigGrid('gridAccountsPayables');

    this.gridService.getHeaders(this.companyId, Modules.ContasAReceber).subscribe({
      next: (response) => {
        const columnsBackend: any[] = response.dados;

        this.columns = setDynamicColumnsGrid(this.columns, columnsBackend);
        this.storageService.setConfigGrid(this.columns, 'gridAccountsPayables');

        this.getReceivables();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  getReceivables() {
    this.loading = true;
    if (this.cdPayablesSelected.length >= 1) {
      this.table.unselectAll();
    }

    this.params.page = this.page;
    this.params.take = this.take;
    this.params.search = this.search;
    this.params.tipoData = this.filterDateSelected !== null ? this.filterDateBackendEnum[this.filterDateSelected] : null;
    this.params.status = this.indicatorSelected !== null ? this.filterStatusBackendEnum[this.indicatorSelected] : null;
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
      advancedFilter: { request: this.filterColumnSelected, configFilters: this.configFilterColumnSelected},
      status: this.indicatorSelected,
      period: this.periodFilter,
      take: this.take
    }
    this.storageService.setFiltersGrid(this.savedFilters, 'filtersAccountsPayables');

    this.receivableService.getReceivables(this.params, this.companyId).subscribe({
      next: (response) => {
        this.receivables = response.dados.items;
        this.opened.total = response.dados.counters?.emAberto;
        this.maturityToday.total = response.dados.counters?.vencendoHoje;
        this.overdue.total = response.dados.counters?.vencidas;
        this.lowered.total = response.dados.counters?.baixadas;

        this.opened.value = setCurrencyMask(response.dados.counters?.emAbertoValorTotal);
        this.maturityToday.value = setCurrencyMask(response.dados.counters?.vencendoHojeValorTotal);
        this.overdue.value = setCurrencyMask(response.dados.counters?.vencidasValorTotal);
        this.lowered.value = setCurrencyMask(response.dados.counters?.baixadasValorTotal);

        let count = 0;
        // Formatação dos campos.
        for (const receivable of this.receivables) {
          receivable.id = count;
          receivable.cnpjCliente = setMaskCpfCnpj(receivable.cnpjCliente);
          receivable.dataEmissao = formatOnlyDateBack(receivable.dataEmissao);
          receivable.dataVencimento = formatOnlyDateBack(receivable.dataVencimento);
          receivable.dataBaixa = formatOnlyDateBack(receivable.dataBaixa);
          receivable.valorTotal = setCurrencyMask(receivable.valorTotal);
          receivable.valorPago = setCurrencyMask(receivable.valorPago);
          receivable.valorLiquido = setCurrencyMask(receivable.valorLiquido);
          receivable.valorDesconto = setCurrencyMask(receivable.valorDesconto);
          receivable.valorAcrescimo = setCurrencyMask(receivable.valorAcrescimo);
          receivable.dataInclusao = formatOnlyDateBack(receivable.dataInclusao);
          receivable.dataCancelamento = formatOnlyDateBack(receivable.dataCancelamento);
          receivable.valorMulta = setCurrencyMask(receivable.valorMulta);
          receivable.valorJuros = setCurrencyMask(receivable.valorJuros);
          count++;
        }

        this.totalLenght = response.dados.filteredTotal;
        const maxItems: number = response.dados.unfilteredTotal;
        this.optionsTake = this.optionsTake.filter(item => item < maxItems);
        this.optionsTake.push(maxItems);

        this.loading = false;
      },
      error: (response) => {
        this.receivables = [];
        this.opened.total = 0;
        this.maturityToday.total = 0;
        this.overdue.total = 0;
        this.lowered.total = 0;
        this.opened.value = 'R$ 0,00';
        this.maturityToday.value = 'R$ 0,00';
        this.overdue.value = 'R$ 0,00';
        this.lowered.value = 'R$ 0,00';
        this.totalLenght = 0;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;;
        this.loading = false;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })

    this.changeDetector.detectChanges();
  }

  // Faz a busca de contas a receber de acordo com o período inserido.
  setFilterDate(period: PeriodDateFilter) {
    this.periodFilter = period;
    if (this.filterDateSelected !== null) {
      this.page = 1;
      this.getReceivables();
    }
  }

  // Faz a bsuca de contas a receber de acordo com o filtro totalizador selecionado.
  selectedTotal(index: number, selected: boolean, notGet?: boolean) {
    this.unselectedAll();

    selected === true ? this.indicatorSelected = index : this.indicatorSelected = null;
    this.page = 1;
    if (!notGet) this.getReceivables();

    switch (index) {
      case this.indicatorsEnum.EmAberto:
        this.opened.selected = selected;
        break;
      case this.indicatorsEnum.VencendoHoje:
        this.maturityToday.selected = selected;
        break;
      case this.indicatorsEnum.Vencidas:
        this.overdue.selected = selected;
        break;
      case this.indicatorsEnum.Baixadas:
        this.lowered.selected = selected;
        break;
    }
  }

  // Desseleciona todas as opções de filtro totalizador.
  unselectedAll() {
    this.opened.selected = false;
    this.maturityToday.selected = false;
    this.overdue.selected = false;
    this.lowered.selected = false;
    this.indicatorSelected = null;
  }

  setInitialFilter() {
    this.periodFilter = setWeekDate();
    this.filterDateSelected = 1;
    this.page = 1;
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
      this.getReceivables();
    }, 0);
  }


  // Atribui à "cdReceivablesSelected" o id das contas a receber que foram selecionados.
  rowsSelected(selected: any[]) {
    this.cdPayablesSelected = [];
    selected.forEach(receivable => {
      this.cdPayablesSelected.push(receivable.numeroFatura)
    });
  }

  // Redireciona para a edição dos dados da conta a receber.
  goToEdit(receivable: any) {
    this.router.navigate(['accounts-payable/actions'], {
      queryParams: { number: receivable.numeroFatura.trim() }
    })
  }

  // Faz a busca de uma nova página selecionada no GRID.
  pageChange(newPage: number) {
    this.page = newPage;
    this.getReceivables();
  }

  getColumnsFilter() {
    this.receivableService.getColumnsFilter(this.companyId).subscribe({
      next: (response) => {
        this.columnsFilter = response.dados;
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

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

    this.storageService.setConfigGrid(configColumns, 'gridAccountsPayables')
    this.storageService.setHideGridColumns(this.columnsHide, 'hideAccountsPayables')
  }

  compareArrays(array1: string[], array2: string[]) {
    const diferentIndex: string[] = [];

    array1.forEach((element) => {
      if (!array2.includes(element)) {
        diferentIndex.push(element)
      }
    })

    return diferentIndex ? diferentIndex : [];
  }

  openModalSendEmailAdvanced() {
    const idBills: string[] = []
    for (const id of this.cdPayablesSelected) {
      idBills.push(String(id).trim())
    }

    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-send-receivable-email',
    };
    //Alterar nome do componente
    const modalRef = this.modalService.open(ModalSendReceivableEmailComponent, modalOptions);
    modalRef.componentInstance.idBills = idBills;

    modalRef.result
      .then((res: any) => {
        if (res) {
          this.snackbar.open = true;
          this.snackbar.message = 'faturasEnviadasEmailSucesso';
          this.getReceivables();
        }
      })
      .catch((res) => {

      })
  }

  //Alterar nome action
  openModalConfirm(action: 'print-receivable' | 'delete' | 'send-whatsapp') {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-confirm',
    };
    const modalRef = this.modalService.open(ModalConfirmationComponent, modalOptions);

    switch (action) {
      case 'print-receivable':
        modalRef.componentInstance.title = this.cdPayablesSelected.length <= 1 ? 'imprimirFatura' : 'imprimirFaturas';
        modalRef.componentInstance.text = this.cdPayablesSelected.length <= 1 ? 'textoImprimirFatura' : 'textoImprimirFaturas';
        modalRef.componentInstance.style = 'green';
        modalRef.componentInstance.textBtnConfirm = 'simImprimir';
        break;
      case 'delete':
        modalRef.componentInstance.title = this.cdPayablesSelected.length <= 1 ? 'excluirFatura' : 'excluirFaturas';
        modalRef.componentInstance.text = this.cdPayablesSelected.length <= 1 ? 'textoExcluirFatura' : 'textoExcluirFaturas';
        modalRef.componentInstance.style = 'red';
        modalRef.componentInstance.textBtnConfirm = 'excluir';
        break;
      case 'send-whatsapp':
        modalRef.componentInstance.title = this.cdPayablesSelected.length <= 1 ? 'enviarFaturaWhatsApp' : 'enviarFaturasWhatsApp';
        modalRef.componentInstance.text = this.cdPayablesSelected.length <= 1 ? 'textoEnviarFaturaWhatsApp' : 'textoEnviarFaturasWhatsApp';
        modalRef.componentInstance.style = 'green';
        modalRef.componentInstance.textBtnConfirm = 'simEnviar';
        break;
    }

    modalRef.result.then((res: boolean) => {
      if (res) {
        if (action === 'print-receivable') this.printReport();
        if (action === 'delete') this.deletePayable();
        if (action === 'send-whatsapp') this.sendToWhatsApp();
      }
    })
    .catch((res) => {

    })
  }

  async downloadPDFReport() {
    try {
      const base64 = await this.getBase64Receivables();
      const blob = b64toBlob(base64, 'application/pdf');
      const fileName = `contas-receber-${new Date().getTime().toString()}`;

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

  async getBase64Receivables(): Promise<string> {
    try {
      this.loading = true;
      const response = await this.receivableService.getBase64Report(this.companyId, this.cdPayablesSelected).toPromise();
      this.loading = false;
      return response.dados[0].base64;
    } catch (error) {
      this.loading = false;
      throw error;
    }
  }

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

  deletePayable() {
    this.loading = true;
    this.receivableService.deleteReceivable(this.companyId, this.cdPayablesSelected).subscribe({
      next: (response) => {
        this.loading = false;
        this.getReceivables();
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.loading = false;
      }
    })
  }

  sendToWhatsApp() {
    this.loading = true;
    this.receivableService.getUrlToSendRelatoryWpp(this.companyId, this.cdPayablesSelected).subscribe({
      next: (response) => {
        this.loading = false;
        this.openWhatsApp(response.dados[0]);
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

   openWhatsApp(bill: { id: string, url: string }) {
    let content = '*ActiveTrans*%0a';
    content += `%0a*Fatura(s) cadastrada(s) na empresa:*%0a${this.companyName}%0a`;
    content += `%0aPara mais detalhes, clique no link para visualizar a(s) fatura(s): ${bill.url}%0a`;

    window.open(`https://wa.me?text=${content}`, '_blank');
  }

  // Alterar nomes
  verifyReceivableDecrease(): boolean {
    return this.cdPayablesSelected.every(idReceivable =>
      this.receivables.some(receivable =>
        receivable.numeroFatura === idReceivable &&
        (receivable.status === 'Em aberto')
      )
    );
  }

  openModalDecreaseBill() {
    const idsBill: string[] = []
    let sum: number = 0;
    for (const id of this.cdPayablesSelected) {
      idsBill.push(String(id).trim());

      this.receivables.forEach(receivable => {
        if (receivable.numeroFatura === id) sum = sum + removeCurrencyMask(receivable.valorTotal);
      });
    }

    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-decrease-bill',
    };
    const modalRef = this.modalService.open(ModalDecreaseBillComponent, modalOptions);
    modalRef.componentInstance.idsBill = idsBill;
    modalRef.componentInstance.billSelecteds = idsBill.length;
    modalRef.componentInstance.valueBills = setCurrencyMask(sum);

    modalRef.result
      .then((res: any) => {
        if (res === 'success') {
          this.snackbar.open = true;
          this.snackbar.message = 'baixaFaturaRealizada';
          this.getReceivables();
        }
      })
      .catch((res) => {

      })
  }

  verifyReceivableReverse(): boolean {
    return this.cdPayablesSelected.every(idReceivable =>
      this.receivables.some(receivable =>
        receivable.numeroFatura === idReceivable &&
        (receivable.status === 'Baixada')
      )
    );
  }

  openModalReverseBill() {
    const idsBill: string[] = []
    let sum: number = 0;
    for (const id of this.cdPayablesSelected) {
      idsBill.push(String(id).trim());

      this.receivables.forEach(receivable => {
        if (receivable.numeroFatura === id) sum = sum + removeCurrencyMask(receivable.valorTotal);
      });
    }

    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-reverse-bill',
    };
    const modalRef = this.modalService.open(ModalReverseBillComponent, modalOptions);
    modalRef.componentInstance.idsBill = idsBill;
    modalRef.componentInstance.billSelecteds = idsBill.length;
    modalRef.componentInstance.valueBills = setCurrencyMask(sum);

    modalRef.result
      .then((res: any) => {
        if (res === 'success') {
          this.snackbar.open = true;
          this.snackbar.message = 'estornoFaturaRealizado';
          this.getReceivables();
        }
      })
      .catch((res) => {

      })
  }

  openModalCancel() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-info',
    };
    const modalRef = this.modalService.open(ModalInfoComponent, modalOptions);
    modalRef.componentInstance.title = this.cdPayablesSelected.length > 1 ? 'cancelarFaturas' : 'cancelarFatura';
    modalRef.componentInstance.text = this.cdPayablesSelected.length > 1 ? 'textoCancelarFaturas' : 'textoCancelarFatura';

    modalRef.result.then((res: { reason: string }) => {
      if (res.reason) {
        this.cancelReceivable(res.reason);
      }
    })
    .catch((res) => {

    })
  }

  cancelReceivable(reason: string) {
    this.loading = true;
    const body = {
      motivo: reason,
      ids: this.cdPayablesSelected
    }

    this.receivableService.cancelReceivable(this.companyId, body).subscribe({
      next: (response) => {
        this.loading = false;
        this.getReceivables();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

  verifyReceivableToLaunch(): boolean {
    if (this.cdPayablesSelected.length > 1) return false;

    return this.cdPayablesSelected.every(idReceivable =>
      this.receivables.some(receivable =>
        receivable.numeroFatura === idReceivable &&
        (receivable.status === 'Em aberto' || receivable.status === 'Vence hoje' || receivable.status === 'Vencida')
      )
    );
  }

  openModalLaunchMovement() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-launch-movement',
    };
    const modalRef = this.modalService.open(ModalLaunchMovementComponent, modalOptions);
    modalRef.componentInstance.idBill = this.cdPayablesSelected[0];

    modalRef.result
      .then((result) => {
        if (result === 'success') {
          this.snackbar.open = true;
          this.snackbar.message = 'movimentoLancadoComSucesso';
          this.getReceivables();
        }
      })
      .catch((res) => {

      })
  }

  openModalHistoricChanges() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-historic-changes',
    };
    const modalRef = this.modalService.open(ModalHistoricChangesComponent, modalOptions);
    modalRef.componentInstance.module = 'accounts-receivable';
    modalRef.componentInstance.codeHistoric = this.cdPayablesSelected[0];

    modalRef.result
      .then((res: boolean) => {
      })
      .catch((res) => {

      })
  }

  openModalSendToBank() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-send-to-bank',
    };
    const modalRef = this.modalService.open(ModalSendToBankComponent, modalOptions);

    modalRef.result
      .then((res: 'cnab' | 'api') => {
        if (res === 'cnab' || res === 'api') {
          // Lógica para enviar fatura para o banco com a opção de CNAB ou API/Webservice.
        }
      })
      .catch((res) => {

      })
  }

  openModalUploadFiles() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-upload-files',
    };
    const modalRef = this.modalService.open(ModalUploadFilesComponent, modalOptions);

    modalRef.result
      .then(async (result: { status: 'success' | 'error', numInvoices: string[], xmlInvalid: string[] }) => {
        if (result.status === 'success') {
          // Faz a busca das NFs criadas a partir do XML para serem vinculadas à conferência.
          await Promise.all(result.numInvoices.map(numInvoice => {
            this.doSearch(numInvoice);
          }));

          // Envia o nomde dos arquivos XML que são inválidos
          // para a função que abre o modal de visualização de arquivos inválidos
          if (result.xmlInvalid.length >= 1) this.openModalInfoInvalidFile(result.xmlInvalid);
        }
      })
      .catch((res) => {

      })
  }

  doSearch(data: string) {
    this.search = data;
    this.page = 1;
    this.getReceivables();
  }

  openModalInfoInvalidFile(filesName: string[]) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-invalid-file',
    };
    const modalRef = this.modalService.open(ModalInvalidFileComponent, modalOptions);
    modalRef.componentInstance.files = filesName;

    modalRef.result
      .then((result) => {

      })
      .catch((res) => {

      })
  }

  refreshGrid() {
    this.hideTooltip = true;
    setTimeout(() => {
      this.hideTooltip = false;
    }, 300);

    this.btnRotate += 360;
    this.receivables = [];

    this.initGrid();
  }

  changeTake(value: number) {
    this.take = value;
    this.receivables = [];
    this.page = 1;
    this.getReceivables();
  }
}
