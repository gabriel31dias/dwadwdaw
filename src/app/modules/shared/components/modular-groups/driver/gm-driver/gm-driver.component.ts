import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgSelectComponent } from '@ng-select/ng-select';

import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { Driver, DriverAdvancedSearch, DriverGrid } from 'src/app/modules/shared/models/driver.model';
import { DriverService } from 'src/app/modules/shared/services/driver.service';
import { ModalConfirmationComponent } from '../../../modais/modal-confirmation/modal-confirmation.component';
import { ModalAdvancedSearchDriverComponent } from '../modal-advanced-search-driver/modal-advanced-search-driver.component';
import { StatusDriver } from 'src/app/modules/shared/consts/status-driver.const';
import { SnackbarType } from 'src/app/modules/shared/consts/snackbar-type.const';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { isNullOrWhitespace } from 'src/app/modules/shared/utils/string-utils';
import { ModalActionsDriverComponent } from '../modal-actions-driver/modal-actions-driver.component';
import { removeMaskCpfCnpj } from 'src/app/modules/shared/utils/cnpj-mask';

@Component({
  selector: 'app-gm-driver',
  templateUrl: './gm-driver.component.html',
  styleUrls: ['./gm-driver.component.scss']
})
export class GmDriverComponent implements OnChanges {

  companyId: string;
  timeout: any;
  @Input() setDriver: DriverAdvancedSearch | null = null;
  @Output() getDriver = new EventEmitter<DriverAdvancedSearch | null>();
  @Input() required?: boolean = false;
  @Input() changed?: boolean = false;
  @Input() readonly?: boolean = false;
  @Input() alert: boolean = false;
  @Input() txtAlert: string = '';
  nameDriverSelected: string | null = this.setDriver ? this.setDriver?.nome : null;
  loading: boolean = false;
  loadingField: boolean = false;
  mouseIndicator: boolean = false;
  openDropdown: boolean = false;
  drivers: DriverAdvancedSearch[] = [];
  driversNames: string[] = [];
  driverSelected: DriverAdvancedSearch = <DriverAdvancedSearch>{};
  snackbar: Snackbar = new Snackbar();
  @ViewChild('gmDriver') gmDriver!: NgSelectComponent;
  search: string = '';

  /** Construtor da classe `GmDriverComponent`.
   * @param translateService Service responsável pela tradução do sistema.
   * @param modalService Service responsável para a chamada dos modais.
   * @param storageService Service responsável para buscar e inserir dados no Storage.
   * @param driverService Service responsável para chamada de APIs de Motorista.
  */
  constructor(private translateService: TranslateService,
    private modalService: NgbModal,
    private storageService: StorageService,
    private driverService: DriverService
  ) {
    this.translateService.use('pt-br');
    this.companyId = this.storageService.getCompanyId()!;
  }

  /** Responsável pela detecção de alterações de valores no componente.
   * @param changes Diretiva que contém as modificações do componente.
  */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['setDriver']) {
      const driver: DriverAdvancedSearch = changes['setDriver'].currentValue;
      this.driverSelected = driver;
      this.nameDriverSelected = isNullOrWhitespace(driver.nome) ? null : driver.nome;
    }
  }

  /** Emite para o componente pai a seleção ou desseleção de um motorista. */
  emitValue() {
    if (this.nameDriverSelected === null) {
      this.emitDriver(null);
      this.drivers = [];
      this.driversNames = [];
    } else {
      const index = this.driversNames.indexOf(this.nameDriverSelected);
      this.validationDriver(this.drivers[index]);
    }
  }

  /** Envia ao componente pai o motorista selecionado.
   * @param driver Informações do motorista.
  */
  emitDriver(driver: DriverAdvancedSearch | null) {
    if (driver !== null) driver.cpf = removeMaskCpfCnpj(driver.cpf);

    this.getDriver.emit(driver);
  }

  /** Limpa o campo de busca e a opção selecionada. */
  clear() {
    this.gmDriver.clearModel();
    this.search = '';
    this.driverSelected = <DriverAdvancedSearch>{};
    this.drivers = [];
    this.driversNames = [];
  }

  /** Recebe o que está sendo digitado e faz as validações necessárias antes de enviar a busca para a API.
   * @param eventSearch Evento de busca retornado pelo ng-select.
  */
  searchDriver(eventSearch: any) {
    this.search = eventSearch.term;
    if (this.search.length <= 2 && this.search !== '') {
      return;
    }

    if (this.timeout) clearTimeout(this.timeout);

    this.loadingField = true;
    this.timeout = setTimeout(() => {
      if (this.search === '') {
        this.clear();
        this.loadingField = false;
      } else {
        this.getDrivers(this.search);
      }
    }, 1000);
  }

  /** Realiza a busca na API de acordo com a busca digitada pelo usuário.
   * @param search Campo de busca enviado para a API.
  */
  getDrivers(search: string) {
    this.driverService.advancedSearch(this.companyId, search).subscribe({
      next: (response) => {
        const driversAPI: DriverAdvancedSearch[] = response.dados;
        this.driversNames = driversAPI.map((motorista: DriverAdvancedSearch) => motorista.nome);
        this.drivers = driversAPI;
        this.loadingField = false;
      },
      error: (response) => {
        this.driversNames = [];
        this.drivers = [];
        this.loadingField = false;
      }
    });
  }

  /** Abre o modal de busca avançada de motorista. */
  openModalAdvancedSearch() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-advanced-search-driver',
    };
    const modalRef = this.modalService.open(ModalAdvancedSearchDriverComponent, modalOptions);
    modalRef.componentInstance.search = this.search;

    modalRef.result
      .then((response: { status: boolean, driver: DriverGrid | null, message: string }) => {
        if (response.status && response.driver !== null) {
          const newDriver: DriverAdvancedSearch = {
            nome: response.driver.nome,
            cpf: response.driver.cpf,
            rg: response.driver.rg,
            cnh_vencida: response.driver.cnh_vencida,
            inativo: response.driver.inativo,
            bloqueado: response.driver.bloqueado,
          }
          if (response.message) this.messageToShow(response.message);
          this.driverSelected = newDriver;
          this.emitDriver(newDriver);
        }
      })
      .catch((response: { status: boolean, driver: DriverGrid | null, message: string  }) => {
      })
  }

  /** Abre o modal de inclusão motorista. */
  openModalCreate() {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-actions-driver',
    };
    const modalRef = this.modalService.open(ModalActionsDriverComponent, modalOptions);

    modalRef.result.then((response: {
      status: boolean,
      driver?: Driver,
      message?: string,
      action?: 'select' | 'only-action'
    }) => {
      if (response.status) {
        this.snackbar.open = true;
        this.snackbar.message = response.message!;
        this.snackbar.type = SnackbarType.Success;

        if (response.action === 'select') {
          const newDriver: DriverAdvancedSearch = {
            nome: response.driver?.dados_motorista.nome!,
            cpf: response.driver?.dados_motorista.cpf!,
            rg: response.driver?.dados_motorista.rg!,
            cnh_vencida: response.driver?.dados_motorista.cnh_vencida!,
            inativo: response.driver?.dados_motorista.inativo!,
            bloqueado: response.driver?.dados_motorista.bloqueado!,
          }
          this.driverSelected = newDriver;
          this.validationDriver(newDriver);
        }
      }
    })
    .catch((res) => {

    })
  }

  /** Abre o modal de edição de motorista.
   * @param driver Informações do motorista selecionado.
  */
  openModalEdit(driver: DriverAdvancedSearch) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-actions-driver',
    };
    const modalRef = this.modalService.open(ModalActionsDriverComponent, modalOptions);
    modalRef.componentInstance.cpfDriver = driver.cpf;

    modalRef.result.then((response: {
      status: boolean,
      driver?: Driver,
      message?: string,
      action?: 'select' | 'only-action'
    }) => {
      if (response.status) {
        this.snackbar.open = true;
        this.snackbar.message = response.message!;
        this.snackbar.type = SnackbarType.Success;

        if (response.action === 'select') {
          const newDriver: DriverAdvancedSearch = {
            nome: response.driver?.dados_motorista.nome!,
            cpf: response.driver?.dados_motorista.cpf!,
            rg: response.driver?.dados_motorista.rg!,
            cnh_vencida: response.driver?.dados_motorista.cnh_vencida!,
            inativo: response.driver?.dados_motorista.inativo!,
            bloqueado: response.driver?.dados_motorista.bloqueado!,
          }
          this.driverSelected = newDriver;
          this.validationDriver(newDriver);
        }
      }
    })
    .catch((res) => {

    })
  }

  /** Abre o modal de confirmação de acordo com a ação passada como parâmetro.
   * @param action Ação para identificação de qual modal deve ser aberto.
   * @param driver Informações do motorista selecionado.
  */
  openModalConfirmation(action: 'expired' | 'inactive' | 'blocked', driver: DriverAdvancedSearch) {
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

    modalRef.result.then((res: boolean) => {
      if (res) {
        if (action === 'expired') {
          this.messageToShow('motoristaCNHVencidaSelecionado');
          this.emitDriver(driver);
        }
        if (action === 'inactive') { this.activeDriver(driver) };
        if (action === 'blocked') { this.unlockDriver(driver) };
      } else {
        if (action === 'expired') {
          this.openModalEdit(driver);
        };
        this.clear();
      }
    })
    .catch((res) => {
      this.clear();
    })
  }

  /** Verifica a mensagem a ser exibida e abre o `Snackbar` de acordo com a mensagem.
   * @param message Mensagem a ser exibida no `Snackbar`.
   */
  messageToShow(message: string) {
    if (message === 'motoristaCNHVencidaSelecionado') {
      this.snackbar.open = true;
      this.snackbar.message = message;
      this.snackbar.type = SnackbarType.Danger;
    } else {
      this.snackbar.open = true;
      this.snackbar.message = message;
      this.snackbar.type = SnackbarType.Success;
    }
  }

  /** Ativa o motorista.
   * @param driver Informações do motorista selecionado.
  */
  activeDriver(driver: DriverAdvancedSearch) {
    this.loading = true;
    this.driverService.setStatus(this.companyId, StatusDriver.Ativo, driver.cpf).subscribe({
      next: (response) => {
        this.emitDriver(driver);
        this.messageToShow('motoristaAtivadoSucesso');
        this.loading = false;
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
  unlockDriver(driver: DriverAdvancedSearch) {
    this.loading = true;
    this.driverService.setStatus(this.companyId, StatusDriver.Ativo, driver.cpf).subscribe({
      next: (response) => {
        this.emitDriver(driver);
        this.messageToShow('motoristaDesbloqueadoSucesso');
        this.loading = false;
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
  validationDriver(driver: DriverAdvancedSearch) {
    if (!driver.cnh_vencida && !driver.inativo && !driver.bloqueado) {
      this.emitDriver(driver);
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

  /** Validação para aplicar as variações do campo.
   * @returns Retorna um boolean para aplicação de variações do campo.
  */
  validator(): boolean {
    if (this.required == true && this.changed && !this.nameDriverSelected) {
      return true;
    } else {
      return false;
    }
  }

}
