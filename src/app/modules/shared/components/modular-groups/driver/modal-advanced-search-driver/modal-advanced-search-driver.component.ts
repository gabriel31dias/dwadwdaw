import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { ColumnFilter, RequestFilterColumn, SearchColumnFilter } from 'src/app/modules/shared/models/filter-column.model';
import { AdvancedFilter } from 'src/app/modules/shared/models/save-filters.model';
import { ColumnSlickGrid } from 'src/app/modules/shared/models/column-slickgrid.model';
import { ModalConfirmationComponent } from '../../../modais/modal-confirmation/modal-confirmation.component';
import { configAdvancedSearchDriver } from 'src/app/modules/shared/consts/columns-advanced-search-driver.const';
import { defaultViewGridAdvancedSearchDriver } from 'src/app/modules/shared/consts/default-view-grid.const';
import { setDefaultViewGrid } from 'src/app/modules/shared/utils/grid-utils';
import { DriverService } from 'src/app/modules/shared/services/driver.service';
import { ParamsAdvancedSearchGrid } from 'src/app/modules/shared/models/params-advanced-search-grid.model';
import { SnackbarType } from 'src/app/modules/shared/consts/snackbar-type.const';
import { Driver, DriverGrid } from 'src/app/modules/shared/models/driver.model';
import { ModalActionsDriverComponent } from '../modal-actions-driver/modal-actions-driver.component';
import { hiddenModal, visibleModal } from 'src/app/modules/shared/utils/modal-utils';
import { StatusDriver } from 'src/app/modules/shared/consts/status-driver.const';

@Component({
  selector: 'app-modal-advanced-search-driver',
  templateUrl: './modal-advanced-search-driver.component.html',
  styleUrls: ['./modal-advanced-search-driver.component.scss']
})
export class ModalAdvancedSearchDriverComponent implements OnInit {

  companyId: string;
  snackbar: Snackbar = new Snackbar();
  loading: boolean = false;
  search: string = '';
  columnsFilter: ColumnFilter[] = [];
  filterColumnSelected: RequestFilterColumn[] = [];
  configFilterColumnSelected: SearchColumnFilter[] = [];
  columns: ColumnSlickGrid[] = [];
  columnsHide: string[] = [];
  drivers: DriverGrid[] = [];
  driverSelected: DriverGrid | null = null;
  messageToShow: string = '';

  /** Construtor da classe `ModalAdvancedSearchDriverComponent`.
   * @param translateService Service responsável pela tradução do sistema.
   * @param modalService Service responsável pela abertura de modais.
   * @param modal Referência ao modal ativo.
   * @param storageService Service responsável por buscar e inserir dados no Storage.
   * @param driverService Service responsável pelas chamadas de APIs de Motorista.
  */
  constructor(private translateService: TranslateService,
    private modalService: NgbModal,
    private modal: NgbActiveModal,
    private storageService: StorageService,
    private driverService: DriverService
  ) {
    this.translateService.use('pt-br');
    this.companyId = this.storageService.getCompanyId()!;
  }

  /** Método executado ao carregar o componente. */
  ngOnInit(): void {
    this.getFilters();
  }

  /** Monta os filtros avançados do GRID. */
  getFilters() {
    this.loading = true;
    this.driverService.getFiltersGrid(this.companyId).subscribe({
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
    const gridConfig = localStorage.getItem('gridModalAdvancedSearchDriver');
    const hideConfig = localStorage.getItem('hideModalAdvancedSearchDriver');
    if (gridConfig === null && hideConfig === null) {
      this.columns = configAdvancedSearchDriver;
      this.columnsHide = setDefaultViewGrid(defaultViewGridAdvancedSearchDriver, this.columns);
    } else {
      this.columns = this.storageService.getConfigGrid('gridModalAdvancedSearchDriver');
      this.columnsHide = this.storageService.getHideGridColumns('hideModalAdvancedSearchDriver');
    }

    this.getDrivers();
  }

  /** Aplica os filtros avançados.
   * @param filter Objeto do tipo `AdvancedFilter` que contém as informações dos filtros aplicados na tela.
  */
  setAdvancedFilter(filter: AdvancedFilter) {
    this.filterColumnSelected = filter.request;
    this.configFilterColumnSelected = filter.configFilters;
    this.getDrivers();
  }

  /** Busca os motoristas de acordo com os filtros. */
  getDrivers() {
    this.loading = true;
    const params: ParamsAdvancedSearchGrid = {
      pagina: 1,
      quantidade: 100,
      busca: this.search,
      filtros: this.filterColumnSelected
    }

    this.driverService.getGrid(this.companyId, params).subscribe({
      next: (response) => {
        const driversAPI = response.dados;
        this.drivers = this.formatterGrid(driversAPI);
        this.loading = false;
      },
      error: (response) => {
        this.drivers = [];
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        this.snackbar.type = SnackbarType.Danger;
        this.loading = false;
      },
    })
  }

  /** Formata os dados recebidos pela API.
   * @param driversAPI Dados retornados pela API.
   * @returns Retorna um array do tipo `DriverGrid`.
  */
  formatterGrid(driversAPI: any): DriverGrid[] {
    if (!driversAPI.length) return [];

    const newListDriver: DriverGrid[] = [];
    for (const driver of driversAPI) {
      const idSlickGrid: number = newListDriver.length + 1;

      const newDriver: DriverGrid = {
        // Id único para identificação do registro no SlickGrid.
        id: idSlickGrid,
        // Dados do Motorista.
        codigo: driver.dados_motorista.codigo,
        cpf: driver.dados_motorista.cpf,
        rg: driver.dados_motorista.rg,
        nome: driver.dados_motorista.nome,
        apelido: driver.dados_motorista.apelido,
        tipo: driver.dados_motorista.tipo,
        status: driver.dados_motorista.status,
        celular: driver.dados_motorista.celular,
        // Dados da CNH.
        registro: driver.dados_cnh.registro,
        categoria: driver.dados_cnh.categoria,
        data_emissao: driver.dados_cnh.data_emissao,
        data_validade: driver.dados_cnh.data_validade,
        // Endereço do Motorista.
        cep: driver.endereco_motorista.cep,
        endereco: driver.endereco_motorista.endereco,
        numero: driver.endereco_motorista.numero,
        complemento: driver.endereco_motorista.complemento,
        bairro: driver.endereco_motorista.bairro,
        cidade: driver.endereco_motorista.cidade,
        uf: driver.endereco_motorista.uf,
        //Campos para validações.
        cnh_vencida: driver.dados_motorista.cnh_vencida,
        inativo: driver.dados_motorista.inativo,
        bloqueado: driver.dados_motorista.bloqueado,
      }

      newListDriver.push(newDriver);
    }

    return newListDriver;
  }

  /** Atribui à `driverSelected` o registro do motorista que se encontra selecionado no GRID.
   * @param driverId Id do registro do motorista selecionado.
  */
  selectDriver(driverId: number) {
    this.driverSelected = this.drivers.find(driver => driver.id === driverId)!;
  }

  /** Verifica se houve seleção de motorista e envia os dados do motorista selecionado para validação. */
  confirmDriver() {
    if (this.driverSelected !== null) this.validationDriver(this.driverSelected);
  }

  /** Aplica o filtro de busca.
   * @param searchFiled Campo de busca.
   * @param lostFocus Váriavel para indicar se o usuário perdeu o foco no campo de busca.
   */
  doSearch(searchFiled: string, lostFocus?: boolean) {
    if (lostFocus && this.search === searchFiled) return;
    this.search = searchFiled;
    this.getDrivers();
  }

  /** Limpa todos os filtros. */
  clearFilters() {
    this.filterColumnSelected = [];
    this.configFilterColumnSelected = [];
    this.search = '';
    this.getDrivers();
  }

  /** Abre o modal de inclusão motorista. */
  openModalCreate() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-actions-driver',
    };
    const modalRef = this.modalService.open(ModalActionsDriverComponent, modalOptions);

    setTimeout(() => {
      this.modal.update(hiddenModal);
      modalRef.dismissed.subscribe(() => {
        this.modal.update(visibleModal);
      });
    }, 100);


    modalRef.result.then((response: {
      status: boolean,
      driver?: Driver,
      message?: string,
      action?: 'select' | 'only-action'
    }) => {
      this.modal.update(visibleModal);
      if (response.status) {
        if (response.action === 'select') {
          const newDriver: DriverGrid = this.formatDriverToGrid(response.driver!);

          this.messageToShow = response.message!;
          this.validationDriver(newDriver);
        }

        if (response.action === 'only-action') {
          this.snackbar.open = true;
          this.snackbar.message = response.message!;
          this.snackbar.type = SnackbarType.Success;
          this.getDrivers();
        }
      }
    })
    .catch((res) => {
      this.modal.update(visibleModal);
    })
  }

  /** Abre o modal de edição de motorista. */
  openModalEdit(driver: DriverGrid) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-actions-driver',
    };
    const modalRef = this.modalService.open(ModalActionsDriverComponent, modalOptions);
    modalRef.componentInstance.cpfDriver = driver.cpf;

    this.modal.update(hiddenModal);
    modalRef.dismissed.subscribe(() => {
      this.modal.update(visibleModal);
    });

    modalRef.result.then((response: {
      status: boolean,
      driver?: Driver,
      message?: string,
      action?: 'select' | 'only-action'
    }) => {
      this.modal.update(visibleModal);
      if (response.status) {
        if (response.action === 'select') {
          const newDriver: DriverGrid = this.formatDriverToGrid(response.driver!);

          this.messageToShow = response.message!;
          this.validationDriver(newDriver);
        }

        if (response.action === 'only-action') {
          this.snackbar.open = true;
          this.snackbar.message = response.message!;
          this.snackbar.type = SnackbarType.Success;
          this.getDrivers();
        }
      }
    })
    .catch((res) => {
      this.modal.update(visibleModal);
    })
  }

  /** Formata o objeto do tipo `Driver` para o tipo `DriverGrid`.
   * @param driver Objeto de Motorista do tipo `Driver`.
   * @returns Retorna um objeto do tipo `DriverGrid` de acordo com os dados passados no parâmetro `driver`.
  */
  formatDriverToGrid(driver: Driver): DriverGrid {
    const newDriverGrid: DriverGrid = {
      id: this.drivers.length + 1,
      codigo: driver.dados_motorista.codigo ? driver.dados_motorista.codigo : '',
      cpf: driver.dados_motorista.cpf ? driver.dados_motorista.cpf : '',
      rg: driver.dados_motorista.rg ? driver.dados_motorista.rg : '',
      nome: driver.dados_motorista.nome ? driver.dados_motorista.nome : '',
      apelido: driver.dados_motorista.apelido ? driver.dados_motorista.apelido : '',
      tipo: driver.dados_motorista.tipo ? driver.dados_motorista.tipo : '',
      status: driver.dados_motorista.status ? driver.dados_motorista.status : '',
      celular: driver.dados_motorista.celular ? driver.dados_motorista.celular : '',
      registro: driver.dados_cnh.registro ? driver.dados_cnh.registro : '',
      categoria: driver.dados_cnh.categoria ? driver.dados_cnh.categoria : '',
      data_emissao: driver.dados_cnh.data_emissao ? driver.dados_cnh.data_emissao : '',
      data_validade: driver.dados_cnh.data_validade ? driver.dados_cnh.data_validade : '',
      cep: driver.endereco_motorista.cep ? driver.endereco_motorista.cep : '',
      endereco: driver.endereco_motorista.endereco ? driver.endereco_motorista.endereco : '',
      numero: driver.endereco_motorista.numero ? driver.endereco_motorista.numero : '',
      complemento: driver.endereco_motorista.complemento ? driver.endereco_motorista.complemento : '',
      bairro: driver.endereco_motorista.bairro ? driver.endereco_motorista.bairro : '',
      cidade: driver.endereco_motorista.cidade ? driver.endereco_motorista.cidade : '',
      uf: driver.endereco_motorista.uf ? driver.endereco_motorista.uf : '',
      cnh_vencida: driver.dados_motorista.cnh_vencida ? driver.dados_motorista.cnh_vencida : false,
      inativo: driver.dados_motorista.inativo ? driver.dados_motorista.inativo : false,
      bloqueado: driver.dados_motorista.bloqueado ? driver.dados_motorista.bloqueado : false,
    }

    return newDriverGrid
  }

  /** Abre o modal de confirmação de acordo com a ação passada como parâmetro.
   * @param action Ação para identificação de qual modal deve ser aberto.
   * @param driver Informações do motorista selecionado.
  */
  openModalConfirmation(action: 'expired' | 'inactive' | 'blocked', driver: DriverGrid) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: action !== 'expired' ? 'modal-confirm' : 'modal-confirm-cnh-expired',
    };
    const modalRef = this.modalService.open(ModalConfirmationComponent, modalOptions);

    switch (action) {
      case 'expired':
        modalRef.componentInstance.title = 'tituloCNHVencida';
        modalRef.componentInstance.text = 'textoCNHVencida';
        modalRef.componentInstance.style = 'red';
        modalRef.componentInstance.textBtnCancel = 'editarMotorista';
        modalRef.componentInstance.textBtnConfirm = 'continuarMesmoAssim';
        break;
      case 'inactive':
        modalRef.componentInstance.title = 'tituloMotoristaInativo';
        modalRef.componentInstance.text = 'textoMotoristaInativo';
        modalRef.componentInstance.style = 'green';
        modalRef.componentInstance.textBtnConfirm = 'ativarMotorista';
        break;
      case 'blocked':
        modalRef.componentInstance.title = 'tituloMotoristaBloqueado';
        modalRef.componentInstance.text = 'textoMotoristaBloqueado';
        modalRef.componentInstance.style = 'green';
        modalRef.componentInstance.textBtnConfirm = 'desbloquearMotorista';
        break;
    }

    setTimeout(() => {
      this.modal.update(hiddenModal);
      modalRef.dismissed.subscribe(() => {
        this.modal.update(visibleModal);
      });
    }, 100);

    modalRef.result.then((res: boolean) => {
      if (res) {
        if (action === 'expired') {
          this.messageToShow = 'motoristaCNHVencidaSelecionado';
          this.setDriver(driver);
        };
        if (action === 'inactive') { this.activeDriver(driver) };
        if (action === 'blocked') { this.unlockDriver(driver) };
      } else {
        if (action === 'expired') {
          setTimeout(() => {
            this.openModalEdit(driver)
          }, 0);
        };
      }
      this.modal.update(visibleModal);
    })
    .catch((res) => {
      this.modal.update(visibleModal);
    })
  }

  /** Ativa o motorista.
   * @param driver Informações do motorista selecionado.
  */
  activeDriver(driver: DriverGrid) {
    this.loading = true;
    this.driverService.setStatus(this.companyId, StatusDriver.Ativo, driver.cpf).subscribe({
      next: (response) => {
        this.loading = false;
        this.messageToShow = 'motoristaAtivadoSucesso';
        driver.inativo = false;
        this.validationDriver(driver);
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

  /** Desbloqueia o motorista.
   * @param driver Informações do motorista selecionado.
  */
  unlockDriver(driver: DriverGrid) {
    this.loading = true;
    this.driverService.setStatus(this.companyId, StatusDriver.Ativo, driver.cpf).subscribe({
      next: (response) => {
        this.loading = false;
        this.messageToShow = 'motoristaDesbloqueadoSucesso';
        driver.bloqueado = false;
        this.validationDriver(driver);
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

  /** Realiza as verificações necessárias para permitir que o motorista seja selecionado.
   * @param driver Informações do motorista selecionado.
  */
  validationDriver(driver: DriverGrid) {
    if (!driver.cnh_vencida && !driver.inativo && !driver.bloqueado) {
      this.setDriver(driver);
      return;
    }

    if (driver.inativo) {
      this.openModalConfirmation('inactive', driver);
      return;
    }

    if (driver.bloqueado) {
      this.openModalConfirmation('blocked', driver);
      return;
    }

    if (driver.cnh_vencida) {
      this.openModalConfirmation('expired', driver);
      return;
    }
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
        this.drivers = [];
        localStorage.removeItem('gridModalAdvancedSearchDriver');
        localStorage.removeItem('hideModalAdvancedSearchDriver');
        this.initGrid();
      }
    })
    .catch((res) => {

    })
  }

  /** Fecha o modal e envia os dados do Motorista selecionado ao componente onde o modal foi chamado.
   * @param driver Dados do motorista.
  */
  setDriver(driver: DriverGrid) {
    const response: { status: boolean, driver: DriverGrid | null, message: string } = {
      status: true,
      driver: driver,
      message: this.messageToShow
    }
    this.modal.close(response);
  }

  /** Fecha o modal sem enviar seleção de Motorista ao componente onde o modal foi chamado. */
  close() {
    const response: { status: boolean, driver: DriverGrid | null, message: string } = {
      driver: null,
      status: false,
      message: ''
    }
    this.modal.close(response);
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

    this.columnsHide = this.compareArrays(allIds, showIds);

    this.storageService.setConfigGrid(configColumns, 'gridModalAdvancedSearchDriver')
    this.storageService.setHideGridColumns(this.columnsHide, 'hideModalAdvancedSearchDriver')
  }

  /** Realiza a comparação de 2 arrays e retorna registros que tem diferença de um para o outro.
   * @param array1 Array 1 para comparação.
   * @param array2 Array 2 para comparação.
   * @returns Retorna uma listagem de valores que estão presentes no Array 1 e não estão presentes no Array 2.
  */
  compareArrays(array1: string[], array2: string[]) {
    const diferentIndex: string[] = [];

    array1.forEach((element) => {
      if (!array2.includes(element)) {
        diferentIndex.push(element)
      }
    })

    return diferentIndex ? diferentIndex : [];
  }

}
