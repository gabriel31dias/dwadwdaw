import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { ListStatusDriver, ListTypesDriver } from 'src/app/modules/shared/consts/driver.const';
import { SnackbarType } from 'src/app/modules/shared/consts/snackbar-type.const';
import { ufs } from 'src/app/modules/shared/consts/uf.const';
import { AlertMessage } from 'src/app/modules/shared/models/alert-message.model';
import { Driver } from 'src/app/modules/shared/models/driver.model';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { AdressService } from 'src/app/modules/shared/services/adress.service';
import { CompanyService } from 'src/app/modules/shared/services/company.service';
import { DriverService } from 'src/app/modules/shared/services/driver.service';
import { isValidCPF, removeMaskCpfCnpj } from 'src/app/modules/shared/utils/cnpj-mask';
import { formatDateBrToUtc } from 'src/app/modules/shared/utils/date-utils';
import { isYearBefore1900 } from 'src/app/modules/shared/utils/period.utils';

@Component({
  selector: 'app-modal-actions-driver',
  templateUrl: './modal-actions-driver.component.html',
  styleUrls: ['./modal-actions-driver.component.scss']
})
export class ModalActionsDriverComponent implements OnInit {

  private timeout: any;
  cpfDriver: string | null = null;
  isCreate: boolean = false;
  companyId: string;
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  types: string[] = ListTypesDriver;
  status: string[] = ListStatusDriver;
  ufs: string[] = ufs;
  subsidiariesName: string[] = [];
  infoSubsidiaries: any[] = [];
  citiesList: { citiesName: string[], infoCities: any[] } = <{ citiesName: string[], infoCities: any[] }>{};
  loadingCity: boolean = false;
  driver: Driver = new Driver();
  alertRequired: boolean = false;
  alertDateEmission: AlertMessage = new AlertMessage();
  alertValidity: AlertMessage = new AlertMessage();
  alertCPF: AlertMessage = new AlertMessage();
  alertCEP: AlertMessage = new AlertMessage();
  openListOptions: boolean = false;

  /** Construtor da classe `ModalActionsDriverComponent`.
   * @param translateService Service responsável pela tradução do sistema.
   * @param modal Referência ao modal ativo.
   * @param storageService Service responsável por buscar e inserir dados no Storage.
   * @param driverService Service responsável pelas chamadas de APIs de Motorista.
   * @param companyService Service responsável pelas chamadas de APIs de Empresa.
   * @param adressService Service responsável pelas chamadas de APIs de Endereço (CEP).
  */
  constructor(private translateService: TranslateService,
    private modal: NgbActiveModal,
    private storageService: StorageService,
    private driverService: DriverService,
    private companyService: CompanyService,
    private adressService: AdressService
  ) {
    this.translateService.use('pt-br');
    this.companyId = this.storageService.getCompanyId()!;
    this.searchSubsidiary();
  }

  /** Método executado ao carregar o componente. */
  ngOnInit(): void {
    if (this.cpfDriver === null) {
      this.isCreate = true;
      this.driver.filial.codigo = this.storageService.getSubsidiaryId()!;
      this.driver.filial.nome_fantasia = this.storageService.getCompanyName()!;
      this.driver.dados_motorista.status = this.status[0];
    } else {
      this.driver.dados_motorista.cpf = this.cpfDriver;
      this.getDetailsDriver();
    }
  }

  /** Realiza a busca dos dados do Motorista para Edição. */
  getDetailsDriver() {
    this.loading = true;
    const CPF: string = removeMaskCpfCnpj(this.cpfDriver!);
    this.driverService.getDetailsDriver(this.companyId, CPF).subscribe({
      next: (response) => {
        this.loading = false;
        this.driver = response.dados;
        this.driver.dados_cnh.data_emissao = formatDateBrToUtc(this.driver.dados_cnh.data_emissao);
        this.driver.dados_cnh.data_validade = formatDateBrToUtc(this.driver.dados_cnh.data_validade);
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

  /** Confirma a Inclusão/Edição do Motorista.
   * @param action Parâmetro de duas opções para identificação da ação escolhida pelo usuário.
  */
  confirm(action: 'select' | 'only-action') {
    if (!this.verifyFields()) return;

    this.loading = true;
    this.driverService.upsertDriver(this.companyId, this.driver).subscribe({
      next: (response) => {
        this.loading = false;
        const driverAPI: Driver = response.dados;
        this.setAction(driverAPI, action);
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

  /** Realiza as ações de acordo com o que foi escolhido pelo usuário.
   * @param driverAPI Informações retornadas pela API do Motorista incluído/editado.
   * @param action Parâmetro de duas opções para identificação da ação escolhida pelo usuário.
  */
  setAction(driverAPI: Driver, action: 'select' | 'only-action') {
    let messageSuccess: string = '';

    if (action === 'only-action') {
      if (this.isCreate) messageSuccess = 'motoristaIncluidoSucesso';
      if (!this.isCreate) messageSuccess = 'motoristaEditadoSucesso';
      this.snackbar.open = true;
      this.snackbar.message = messageSuccess;
      this.snackbar.type = SnackbarType.Success;
    }

    if (action === 'only-action' && this.isCreate) {
      this.isCreate = false;
      this.cpfDriver = driverAPI.dados_motorista.cpf;
      this.getDetailsDriver();
    }

    if (action === 'select') {
      if (this.isCreate) messageSuccess = 'motoristaIncluidoSelecionadoSucesso';
      if (!this.isCreate) messageSuccess = 'motoristaEditadoSelecionadoSucesso';

      const responseModal: {
        status: boolean,
        driver: Driver,
        message: string,
        action: 'select' | 'only-action'
      } = {
        status: true,
        driver: driverAPI,
        message: messageSuccess,
        action: action
      }

      this.modal.close(responseModal);
    }
  }

  /** Fecha o modal sem enviar seleção de Motorista ao componente onde o modal foi chamado. */
  close() {
    this.modal.close({ status: false });
  }

  /** Validações realizadas nos seguintes campos: `Data de Emissão (CNH)` e `Validade (CNH)`.*/
  verifyDates() {
    if (this.driver.dados_cnh.data_emissao && isYearBefore1900(this.driver.dados_cnh.data_emissao)) {
      this.alertDateEmission.alert = true;
      this.alertDateEmission.message = 'anoMenorQue1900';
    } else {
      this.alertDateEmission.alert = false;
      this.alertDateEmission.message = '';
    }

    if (this.driver.dados_cnh.data_validade && isYearBefore1900(this.driver.dados_cnh.data_validade)) {
      this.alertValidity.alert = true;
      this.alertValidity.message = 'anoMenorQue1900';
    } else {
      this.alertValidity.alert = false;
      this.alertValidity.message = '';
    }
  }

  /** Validações realizadas no seguinte campo: `CPF`.*/
  verifyCPF() {
    if (!isValidCPF(this.driver.dados_motorista.cpf)) {
      this.alertCPF.alert = true;
      this.alertCPF.message = 'invalidoCPF';
    } else {
      this.alertCPF.alert = false;
      this.alertCPF.message = '';
    }
  }

  /** Validações realizadas no seguinte campo: `CEP`.*/
  verifyCEP() {
    if (this.driver.endereco_motorista.cep === null || this.driver.endereco_motorista.cep.length < 8) {
      this.alertCEP.alert = true;
      this.alertCEP.message = 'invalidoCEP';
    } else {
      this.alertCEP.alert = false;
      this.alertCEP.message = '';
    }
  }

  /** Realiza as validações necessárias para concluir as ações de Incluir e Editar.
   * @returns Retorna um `boolean` que indica se todos os campos passaram nas validações necessárias.
  */
  verifyFields(): boolean {
    if (this.driver.dados_motorista.nome === null ||
      this.driver.dados_motorista.cpf === null ||
      this.driver.dados_motorista.rg === null ||
      this.driver.dados_motorista.tipo === null ||
      this.driver.dados_motorista.status === null ||
      this.driver.dados_motorista.celular === null ||
      this.driver.dados_cnh.registro === null ||
      this.driver.dados_cnh.data_emissao === null ||
      this.driver.dados_cnh.data_validade === null ||
      this.driver.dados_cnh.categoria === null ||
      this.driver.endereco_motorista.cep === null ||
      this.driver.endereco_motorista.endereco === null ||
      this.driver.endereco_motorista.numero === null ||
      this.driver.endereco_motorista.bairro === null ||
      this.driver.endereco_motorista.uf === null ||
      this.driver.endereco_motorista.cidade === null ||
      this.driver.endereco_motorista.codigo_cidade === null ||
      this.driver.filial.codigo === null ||
      this.driver.filial.nome_fantasia === null
    ) {
      this.alertRequired = true;
      this.snackbar.open = true;
      this.snackbar.message = 'preenchaCamposObrigatorios';
      this.snackbar.type = SnackbarType.Default;
      return false;
    } else {
      if (!isValidCPF(this.driver.dados_motorista.cpf)) {
        this.verifyCPF();
        this.snackbar.open = true;
        this.snackbar.message = 'invalidoCPF';
        this.snackbar.type = SnackbarType.Default;
        return false;
      }

      if (isYearBefore1900(this.driver.dados_cnh.data_emissao) || isYearBefore1900(this.driver.dados_cnh.data_validade)) {
        this.verifyDates();
        this.snackbar.open = true;
        this.snackbar.message = 'erroDataPassada1900';
        this.snackbar.type = SnackbarType.Default;
        return false;
      }

      if (this.alertCEP.alert) {
        this.verifyCEP();
        this.snackbar.open = true;
        this.snackbar.message = 'invalidoCEP';
        this.snackbar.type = SnackbarType.Default;
        return false;
      }

      return true;
    }
  }

  /** Efetua a busca de filiais. */
  searchSubsidiary() {
    this.companyService.getSubsidiaries(this.companyId).subscribe({
      next: response => {
        this.subsidiariesName = response.dados.map((subsidiary: any) => subsidiary.nome);
        this.infoSubsidiaries = response.dados;
      },
      error: err => {
        this.subsidiariesName = [];
        this.infoSubsidiaries = [];
      }
    });
  }

  /** Efetua a busca de filiais.
   * @param selected Índice da filial selecionada no campo de `Filial`.
  */
  selectSubsidiary(selected: number | null) {
    if (selected !== null) {
      let item: any = this.infoSubsidiaries.at(selected);
      this.driver.filial.nome_fantasia = item.nome;
      this.driver.filial.codigo = item.cdFilial;
    } else {
      this.driver.filial.nome_fantasia = null;
      this.driver.filial.codigo = null;
    }
  }

  /** Efetua a busca do endereço de acordo com o CEP digitado. */
  searchCep() {
    if (this.driver.endereco_motorista.cep?.length !== 8) return;

    this.loading = true;
    this.adressService.getAdress(this.driver.endereco_motorista.cep).subscribe({
      next: (response) => {
        this.loading = false;
        this.driver.endereco_motorista.endereco = response.logradouro.substring(0, 40);
        this.driver.endereco_motorista.bairro = response.bairro.substring(0, 25);
        this.driver.endereco_motorista.uf = response.uf.substring(0, 2);
        this.driver.endereco_motorista.cidade = null;
        this.driver.endereco_motorista.codigo_cidade = null;
        this.searchCity(response.cidade, true)
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = 'mensagemCEPNaoEncontrado';
        this.snackbar.type = SnackbarType.Danger;
      }
    });
  }

  /** Seleciona o Estado (UF).
   * @param selected Índice da UF selecionada no campo de `UF`.
  */
  selectUF(selected: number | null) {
    if (selected !== null) {
      if (this.driver.endereco_motorista.uf && this.driver.endereco_motorista.uf !== ufs[selected]) {
        this.driver.endereco_motorista.cidade = null
        this.driver.endereco_motorista.codigo_cidade = null
      }

      this.driver.endereco_motorista.uf = ufs[selected];
    } else {
      this.driver.endereco_motorista.cidade = null;
      this.driver.endereco_motorista.codigo_cidade = null;
      this.driver.endereco_motorista.uf = null
    }
    this.getCities('');
  }

  /** Inicia a busca de Cidades.
   * @param search Campo de busca.
   * @param select Parâmetro para selecionar uma cidade automaticamente.
  */
  searchCity(search: string, select?: boolean) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.loadingCity = true;
    const milliseconds: number = select ? 0 : 2000;
    this.timeout = setTimeout(() => {
      this.getCities(search, select)
      this.loadingCity = false;
    }, milliseconds)
  }

  /** Efetua a busca na API de Cidades de acordo com os parâmetros passados.
   * @param search Campo de busca.
   * @param select Parâmetro para selecionar uma cidade automaticamente.
  */
  getCities(search: string, select?: boolean) {
    this.loadingCity = true;
    this.adressService.getCities(this.companyId, search, this.driver.endereco_motorista.uf).subscribe({
      next: response => {
        this.citiesList.citiesName = response.dados.map((city: any) => `${city.nome} - ${city.uf}`);
        this.citiesList.infoCities = response.dados;
        this.loadingCity = false;
        if (select) {
          this.selectCity(0);
        }
      },
      error: err => {
        this.loadingCity = false;
      }
    });
  }

  /** Seleciona a Cidade.
   * @param selected Índice da Cidade selecionada no campo de `Cidade`.
  */
  selectCity(selected: number | null) {
    if (selected !== null) {
      let item: any = this.citiesList.infoCities.at(selected);
      if (this.driver.endereco_motorista.cidade === item.nome &&
        this.driver.endereco_motorista.codigo_cidade === item.cdCidade &&
        this.driver.endereco_motorista.uf === item.uf
      ) {
        this.sameCity(item);
        return;
      }

      this.driver.endereco_motorista.cidade = item.nome;
      this.driver.endereco_motorista.codigo_cidade = item.cdCidade;
      this.driver.endereco_motorista.uf = item.uf;
    } else {
      this.driver.endereco_motorista.cidade = null;
      this.driver.endereco_motorista.codigo_cidade = null;
      this.driver.endereco_motorista.uf = null;
    }
  }

  /** Tratativa para não quebrar a máscara de Cidade - UF no campo de `Cidade`.
   * @param newCity Informações da Cidade que já estava selecionada e foi selecionada novamente.
  */
  sameCity(newCity: any) {
    this.driver.endereco_motorista.cidade = ' ';

    setTimeout(() => {
      this.driver.endereco_motorista.cidade = newCity.nome;
      this.driver.endereco_motorista.codigo_cidade = newCity.cdCidade;
      this.driver.endereco_motorista.uf = newCity.uf;
    }, 0);
  }

  /** Remove a cidade selecionada. */
  clearFieldsCity() {
    if (this.driver.endereco_motorista.cidade) {
      this.driver.endereco_motorista.cidade = null
      this.driver.endereco_motorista.codigo_cidade = null
      this.driver.endereco_motorista.uf = null;
    }
  }

  /** Método responsável por abrir a lista de opções do `option-button-primary` e remover o foco do `option-button-primary-icon`.
   * @returns Retorna um boolean que indica se é para o `option-button-primary-icon` ter o foco removido.
  */
  changeViewList(): boolean {
    let blur: boolean = false;
    if (this.openListOptions) {
      blur = true;
      this.openListOptions = false;
    } else {
      this.openListOptions = true;
    }
    return blur;
  }

}
