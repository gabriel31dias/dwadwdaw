import { CustomFieldService } from './../../../settings/services/custom-field.service';
import { Component, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { StepperModel } from 'src/app/modules/shared/models/stepper.model';
import { DadosColeta } from '../../models/info-collection.model';
import { LocalDeEntrega } from '../../models/delivery-place.model';
import { TotaisDaCarga } from '../../models/load-totals.model';
import { Motorista } from '../../models/driver-collection.model';
import { Coleta } from '../../models/collection.model';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { CollectionService } from '../../services/collection.service';
import { formatDateBack, formatDateTimeString, formatDateUtcToBr, getTimeZone } from 'src/app/modules/shared/utils/date-utils';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { removeMaskCpfCnpj, setMaskCpfCnpj } from 'src/app/modules/shared/utils/cnpj-mask';
import { ExhibitionCustomField, RegisterCustomField } from 'src/app/modules/shared/models/exhibition-custom-field.model';
import { TypeCustomField, typeWithItems } from 'src/app/modules/settings/models/type-custom-field';
import { TypesService } from '../../models/type-service-collection.model';
import { Modules } from 'src/app/modules/shared/consts/list-modules.const';
import { StatusColeta } from '../../models/status-collection.enum';
import { AlertTruckPlate } from '../../models/alert-field-truck-plate.model';
import { convertStringToDate, convertTimeToMinutes, initTimeIsBigger, isPastDate, isYearBefore1900 } from 'src/app/modules/shared/utils/period.utils';
import { DateValidationsCollection } from '../../models/date-validations-collection.model';
import { SnackbarType } from 'src/app/modules/shared/consts/snackbar-type.const';
import { ModalInfoComponent } from 'src/app/modules/shared/components/modais/modal-info/modal-info.component';
import { ModalConfirmationComponent } from 'src/app/modules/shared/components/modais/modal-confirmation/modal-confirmation.component';
import { ModalDownloadCollectionComponent } from '../../modais/modal-download-collection/modal-download-collection.component';
import { ModalHistoricChangesComponent } from 'src/app/modules/shared/components/modais/modal-historic-changes/modal-historic-changes.component';
import { KeyValue } from 'src/app/modules/shared/models/key-value.model';
import { ConfigurationEmail } from 'src/app/modules/shared/models/send-email.model';
import { EmailService } from 'src/app/modules/shared/services/email.service';
import { ModalSendEmailSingleComponent } from 'src/app/modules/shared/components/modais/modal-send-email-single/modal-send-email-single.component';
import { b64toBlob } from 'src/app/modules/shared/utils/b64-to-blob';
import { ParamsListGrid } from 'src/app/modules/shared/models/params-list-grid.model';
import { ModalSendEmailMultipleComponent } from 'src/app/modules/shared/components/modais/modal-send-email-multiple/modal-send-email-multiple.component';
import { Historico } from 'src/app/modules/shared/models/historic-change.model';
import { formatHistoric, openModalDetailsHistoric } from 'src/app/modules/shared/utils/historic-utils';
import { CompanyService } from 'src/app/modules/shared/services/company.service';
import { isNullOrWhitespace } from 'src/app/modules/shared/utils/string-utils';
import { NotaFiscal } from 'src/app/modules/shared/models/nota-fiscal.model';
import { StageLoadTotalsComponent } from '../stage-load-totals/stage-load-totals.component';
import { RelatorioLista } from 'src/app/modules/shared/models/relatorio-lista';
import { ModalSelectLayoutReportComponent } from 'src/app/modules/shared/components/modais/modal-select-layout-report/modal-select-layout-report.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ReportService } from 'src/app/modules/shared/services/report.service';


@Component({
  selector: 'app-actions-collection',
  templateUrl: './actions-collection.component.html',
  styleUrls: ['./actions-collection.component.scss']
})
export class ActionsCollectionComponent {

  companyId: string;
  subsidiaryName: string;
  nCollection: string | null = null;
  cdFilEmp: string | null = null;
  steppers: StepperModel[] = [];
  stepperIndex: number = 0;
  infoCollection: DadosColeta = <DadosColeta>{};
  deliveryPlace: LocalDeEntrega = <LocalDeEntrega>{};
  loadTotals: TotaisDaCarga = <TotaisDaCarga>{};
  driver: Motorista = <Motorista>{};
  collection: Coleta = <Coleta>{};
  snackbar: Snackbar = new Snackbar();
  loading: boolean = false;
  alertRequired: boolean = false;
  status: string = '';
  readonly: boolean = false;
  customField: ExhibitionCustomField[] = [];
  registerCustomField: RegisterCustomField[] = [];
  stepName: string = '';
  typesServices: TypesService[] = [];
  subsidiariesName: string[] = [];
  infoSubsidiaries: any[] = [];
  totalFieldTruck: number = 1;
  alertTruckPlate: AlertTruckPlate = <AlertTruckPlate>{};
  dateTimeValidationsInfo: DateValidationsCollection = <DateValidationsCollection>{};
  dateTimeValidationsDelivery: DateValidationsCollection = <DateValidationsCollection>{};
  citiesList: { citiesName: string[], infoCities: any[] } = <{ citiesName: string[], infoCities: any[] }>{}
  citiesListDelivery: { citiesName: string[], infoCities: any[] } = <{ citiesName: string[], infoCities: any[] }>{}
  isActive: boolean = false;
  statusColeta = StatusColeta;
  collectionCode: any[] = [];
  historics: Historico[] = [];
  @Input() dateTimeValidations: DateValidationsCollection = <DateValidationsCollection>{};
  @Input() alertMessage: string = ''
  dateTimeValidationInfoAndDelivery: DateValidationsCollection = <DateValidationsCollection>{};
  nfs: NotaFiscal[] = [];
  @ViewChild(StageLoadTotalsComponent) stageLoadTotalsComponent!: StageLoadTotalsComponent;
  cdReportSelected: number | null = null;

  constructor(private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private storageService: StorageService,
    private collectionService: CollectionService,
    private companyService: CompanyService,
    private customFieldService: CustomFieldService,
    private emailService: EmailService,
    private reportService: ReportService
  ) {
    translate.use('pt-br');
    this.companyId = storageService.getCompanyId()!;
    this.subsidiaryName = storageService.getCompanyName()!;

    route.queryParams.subscribe((queryParams) => {
      if (queryParams['number']) {
        this.nCollection = queryParams['number'];
      }
      if (queryParams['cdFilEmp']) {
        this.cdFilEmp = queryParams['cdFilEmp'];
      }
    })

    this.collectionCode.push({
      cdColeta: this.nCollection,
      cdFilEmp: this.cdFilEmp,
    })

    this.reloadAll();
    this.normalCollection();
    this.loadCustomFields();
  }


  removeFocus(button: HTMLButtonElement) {
    setTimeout(() => {
      button.blur();
    }, 100)
  }

  reloadAll() {
    this.updateCollectionCode();
    this.getTypeServices();
    this.searchSubsidiary();

    if (this.nCollection) this.getDetailsCollection();
    if (!this.nCollection) {
      this.getDateTime();
      this.infoCollection.filialInclusao = this.storageService.getCompanyName()!;
    }
  }

  /**Busca a data e hora atual.*/
  getDateTime() {
    const dateNow = new Date();

    const day = dateNow.getDate().toString().padStart(2, '0');
    const month = (dateNow.getMonth() + 1).toString().padStart(2, '0');
    const year = dateNow.getFullYear();
    const hours = dateNow.getHours().toString().padStart(2, '0');
    const minutes = dateNow.getMinutes().toString().padStart(2, '0');
    const seconds = dateNow.getSeconds().toString().padStart(2, '0');

    this.infoCollection.dataInclusao = `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  }

  normalCollection(setCustomField?: boolean) {
    this.steppers = [
      {
        src: 'register-white.svg',
        text: 'dadosDaColeta'
      },
      {
        src: 'receipt-grey.svg',
        text: 'totaisDaCarga'
      },
      {
        src: 'driver-grey.svg',
        text: 'motorista',
      }
    ]

    if (setCustomField) {
      this.steppers.push(
        {
          src: 'register-white.svg',
          text: this.stepName,
          width: '100%'

        }
      )
    }
  }

  getTypeServices() {
    this.collectionService.getTypesService(this.companyId).subscribe({
      next: (response) => {
        this.typesServices = response.dados;
      },
      error: (response) => {
        this.typesServices = [];
      }
    })
  }

  nextStepper() {
    if (this.stepperIndex !== this.steppers.length) {
      this.stepperIndex += 1;
      this.isActive = true;
    }
  }

  backStepper() {
    if (this.stepperIndex !== 0) {
      this.stepperIndex -= 1;
      this.isActive = true;
    }
  }

  changeTypeCollection(type: number | null) {
    this.infoCollection.tipoColeta = type!;
    const stepperDelivery: StepperModel = {
      src: 'delivery-place-grey.svg',
      text: 'localDeEntrega',
      class: 'unselected'
    }

    if (type == 1) {
      const exists = this.steppers.some((stepper) => stepper.text === stepperDelivery.text);
      if (!exists) {
        this.steppers.splice(1, 0, stepperDelivery);
        if (this.stepperIndex > 1) this.nextStepper;
      }
    } else {
      this.normalCollection(this.customField.length >= 1);
    }
  }



  /** Verifica se os campos obrigatórios estejam preenchidos*/
  defineAction() {
    if (this.nCollection) {
      this.updateCollection();
    } else {
      this.createCollection();
    }

  }

  formatCollection() {
    this.collection.dadosColeta = this.infoCollection;
    this.collection.localDeEntrega = this.deliveryPlace;
    this.collection.totaisDaCarga = this.loadTotals;
    this.collection.motorista = this.driver;

    const infoCollectionCopy = { ...this.collection.dadosColeta };

    infoCollectionCopy.dataInclusao = formatDateTimeString(infoCollectionCopy.dataInclusao)!;
    infoCollectionCopy.timeZone = getTimeZone();

    [infoCollectionCopy.cnpjCpfColeta, infoCollectionCopy.nomeFantasiaColeta] = infoCollectionCopy.cnpjCpfColeta.split(' - ');
    infoCollectionCopy.cnpjCpfColeta = removeMaskCpfCnpj(infoCollectionCopy.cnpjCpfColeta);

    [infoCollectionCopy.cnpjCpfSolicitante, infoCollectionCopy.nomeFantasiaSolicitante] = infoCollectionCopy.cnpjCpfSolicitante.split(' - ');
    infoCollectionCopy.cnpjCpfSolicitante = removeMaskCpfCnpj(infoCollectionCopy.cnpjCpfSolicitante);

    this.collection.dadosColeta = infoCollectionCopy;

    if (this.collection.dadosColeta.tipoColeta === 1) {
      const deliveyPlaceCopy = { ...this.collection.localDeEntrega };

      deliveyPlaceCopy.cnpjCpf ? [deliveyPlaceCopy.cnpjCpf, deliveyPlaceCopy.empresa] = deliveyPlaceCopy.cnpjCpf.split(' - ') : '';
      deliveyPlaceCopy.cnpjCpf ? deliveyPlaceCopy.cnpjCpf = removeMaskCpfCnpj(deliveyPlaceCopy.cnpjCpf) : '';
      deliveyPlaceCopy.dataEntrega = isNullOrWhitespace(deliveyPlaceCopy.dataEntrega) ? null : deliveyPlaceCopy.dataEntrega;
      deliveyPlaceCopy.horaInicial = isNullOrWhitespace(deliveyPlaceCopy.horaInicial) ? null : deliveyPlaceCopy.horaInicial;
      deliveyPlaceCopy.horaFinal = isNullOrWhitespace(deliveyPlaceCopy.horaFinal) ? null : deliveyPlaceCopy.horaFinal;
      deliveyPlaceCopy.timeZone = getTimeZone();
      this.collection.localDeEntrega = deliveyPlaceCopy;
    } else {
      const deliveyPlaceCopy: LocalDeEntrega = <LocalDeEntrega>{};
      this.collection.localDeEntrega = deliveyPlaceCopy;
    }

    const loadTotalsCopy = { ...this.collection.totaisDaCarga };
    loadTotalsCopy.pesoLiquido ? loadTotalsCopy.pesoLiquido = String(loadTotalsCopy.pesoLiquido) : '';
    !loadTotalsCopy.nfs ? loadTotalsCopy.nfs = [] : '';

    this.collection.totaisDaCarga = loadTotalsCopy;

    this.formatCustomFieldToSend();
  }

  verifyRequired(): boolean {
    if (
      this.collection.dadosColeta.dataInclusao &&
      this.collection.dadosColeta.tipoColeta !== null &&
      this.collection.dadosColeta.cnpjCpfSolicitante &&
      this.collection.dadosColeta.dataColeta &&
      this.collection.dadosColeta.horaInicial &&
      this.collection.dadosColeta.horaFinal &&
      this.collection.dadosColeta.cnpjCpfColeta &&
      this.collection.dadosColeta.cep &&
      this.collection.dadosColeta.endereco &&
      this.collection.dadosColeta.numero &&
      this.collection.dadosColeta.bairro &&
      this.collection.dadosColeta.cidade &&
      this.collection.dadosColeta.uf &&
      this.collection.dadosColeta.responsavel &&
      this.collection.dadosColeta.filialResponsavel !== null
    ) {
      return true;
    } else {
      this.alertRequired = true;
      return false;
    }
  }

  /** Verifica se o usuário inseriu placas de carreta iguais nos campos de "Placa de carreta".*/
  verifyDuplicateTruckPlate(): boolean {
    if (this.collection.motorista.placaVeiculo) {
      if (this.collection.motorista.placaVeiculo == this.collection.motorista.placaCarreta02 ||
        this.collection.motorista.placaVeiculo == this.collection.motorista.placaCarreta03 ||
        this.collection.motorista.placaVeiculo == this.collection.motorista.placaCarreta
      ) return false;
    }

    if (this.collection.motorista.placaCarreta) {
      if (this.collection.motorista.placaCarreta == this.collection.motorista.placaCarreta02 ||
        this.collection.motorista.placaCarreta == this.collection.motorista.placaCarreta03 ||
        this.collection.motorista.placaCarreta == this.collection.motorista.placaVeiculo
      ) return false;
    }

    if (this.collection.motorista.placaCarreta02) {
      if (this.collection.motorista.placaCarreta02 == this.collection.motorista.placaCarreta ||
        this.collection.motorista.placaCarreta02 == this.collection.motorista.placaCarreta03 ||
        this.collection.motorista.placaCarreta == this.collection.motorista.placaVeiculo
      ) return false;
    }

    if (this.collection.motorista.placaCarreta03) {
      if (this.collection.motorista.placaCarreta03 == this.collection.motorista.placaCarreta ||
        this.collection.motorista.placaCarreta03 == this.collection.motorista.placaCarreta02 ||
        this.collection.motorista.placaCarreta == this.collection.motorista.placaVeiculo
      ) return false;
    }

    return true;
  }

  verifyValidationsUpdate(): boolean {
    try {
      if (this.collection.dadosColeta.dataColeta && isYearBefore1900(this.collection.dadosColeta.dataColeta)) {
        this.snackbar.open = true;
        this.snackbar.message = 'anoMenorQue1900';
        this.snackbar.type = SnackbarType.Default;
        return false;
      }
      if (this.collection.localDeEntrega?.dataEntrega && isYearBefore1900(this.collection.localDeEntrega.dataEntrega)) {
        this.snackbar.open = true;
        this.snackbar.message = 'anoMenorQue1900';
        this.snackbar.type = SnackbarType.Default;
        return false;
      }
      if ((this.dateTimeValidationInfoAndDelivery.alertDate || this.dateTimeValidationsDelivery.alertDate) && !(this.dateTimeValidationInfoAndDelivery.alertDateMessage == 'erroDataPassado' || this.dateTimeValidationsDelivery.alertDateMessage == 'erroDataPassado')) {
        this.snackbar.open = true;
        this.snackbar.message = "DataEntregaAnteriorAColeta";
        this.snackbar.type = SnackbarType.Default;
        return false;
      }
      return true;
    }
    catch {
      return false;
    }
  }

  verifyValidations(): boolean {
    try {
      if (this.collection.dadosColeta.dataColeta && isYearBefore1900(this.collection.dadosColeta.dataColeta)) {
        this.snackbar.open = true;
        this.snackbar.message = 'anoMenorQue1900';
        this.snackbar.type = SnackbarType.Default;
        return false;
      }
      if (this.collection.localDeEntrega?.dataEntrega && isYearBefore1900(this.collection.localDeEntrega.dataEntrega)) {
        this.snackbar.open = true;
        this.snackbar.message = 'anoMenorQue1900';
        this.snackbar.type = SnackbarType.Default;
        return false;
      }
      if (this.collection.dadosColeta.dataColeta && isPastDate(this.collection.dadosColeta.dataColeta)) {
        this.snackbar.open = true;
        this.snackbar.message = 'erroDataPassado';
        this.snackbar.type = SnackbarType.Default;
        return false;
      }
      if (this.dateTimeValidationInfoAndDelivery.alertDate
        || this.dateTimeValidationInfoAndDelivery.alertTimeInit
        || this.dateTimeValidationInfoAndDelivery.alertTimeFinal
        || this.dateTimeValidationsDelivery.alertTimeInit
        || this.dateTimeValidationsDelivery.alertTimeFinal
        || this.dateTimeValidationsDelivery.alertDate) {
        this.snackbar.open = true;
        this.snackbar.message = this.dateTimeValidationInfoAndDelivery.alertDateMessage && this.dateTimeValidationInfoAndDelivery.alertDateMessage != '' ? this.dateTimeValidationInfoAndDelivery.alertDateMessage :
          this.dateTimeValidationInfoAndDelivery.alertTimeInitMessage && this.dateTimeValidationInfoAndDelivery.alertTimeInitMessage != '' ? this.dateTimeValidationInfoAndDelivery.alertTimeInitMessage :
            this.dateTimeValidationInfoAndDelivery.alertTimeFinalMessage && this.dateTimeValidationInfoAndDelivery.alertTimeFinalMessage != '' ? this.dateTimeValidationInfoAndDelivery.alertTimeFinalMessage :
              this.dateTimeValidationsDelivery.alertTimeInitMessage && this.dateTimeValidationsDelivery.alertTimeInitMessage != '' ? this.dateTimeValidationsDelivery.alertTimeInitMessage :
                this.dateTimeValidationsDelivery.alertTimeFinalMessage && this.dateTimeValidationsDelivery.alertTimeFinalMessage != '' ? this.dateTimeValidationsDelivery.alertTimeFinalMessage :
                  this.dateTimeValidationsDelivery.alertDateMessage
        this.snackbar.type = SnackbarType.Default;
        return false;
      }
      if (this.collection.dadosColeta.horaFinal && this.collection.dadosColeta.horaInicial && initTimeIsBigger(this.collection.dadosColeta.horaInicial, this.collection.dadosColeta.horaFinal)) {
        this.snackbar.open = true;
        this.snackbar.message = 'erroHoraInicialMaiorQueFinal';
        this.snackbar.type = SnackbarType.Default;
        return false;
      }

      if (this.collection.dadosColeta.horaFinal && isPastDate(this.collection.dadosColeta.dataColeta, this.collection.dadosColeta.horaFinal)) {
        this.snackbar.open = true;
        this.snackbar.message = 'erroHoraPassado';
        this.snackbar.type = SnackbarType.Default;
        return false;
      }

      if (this.collection.localDeEntrega) {
        if (this.collection.localDeEntrega.dataEntrega && isPastDate(this.collection.localDeEntrega.dataEntrega)) {
          this.snackbar.open = true;
          this.snackbar.message = 'erroDataPassadoLocalEntrega';
          this.snackbar.type = SnackbarType.Default;
          return false;
        }

        if (this.collection.localDeEntrega.horaFinal && this.collection.localDeEntrega.horaInicial && initTimeIsBigger(this.collection.localDeEntrega.horaInicial, this.collection.dadosColeta.horaFinal)) {
          this.snackbar.open = true;
          this.snackbar.message = 'erroHoraInicialMaiorQueFinalLocalEntrega';
          this.snackbar.type = SnackbarType.Default;
          return false;
        }

        if (this.collection.localDeEntrega.horaFinal && this.collection.localDeEntrega.dataEntrega && isPastDate(this.collection.localDeEntrega.dataEntrega, this.collection.localDeEntrega.horaFinal)) {
          this.snackbar.open = true;
          this.snackbar.message = 'erroHoraPassadoLocalEntrega';
          this.snackbar.type = SnackbarType.Default;
          return false;
        }

        if (this.collection.localDeEntrega.horaFinal && this.collection.localDeEntrega.dataEntrega && isPastDate(this.collection.localDeEntrega.dataEntrega, this.collection.localDeEntrega.horaFinal)) {
          this.snackbar.open = true;
          this.snackbar.message = 'erroHoraPassadoLocalEntrega';
          this.snackbar.type = SnackbarType.Default;
          return false;
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  createCollection() {
    try {
      this.collection.dadosColeta = this.infoCollection;
      this.collection.localDeEntrega = this.deliveryPlace;
      this.collection.totaisDaCarga = this.loadTotals;
      this.collection.motorista = this.driver;

      if (this.verifyRequired()) {
        if (!this.verifyValidations()) return;
        if (this.verifyDuplicateTruckPlate()) {
          this.formatCollection();
          this.loading = true;

          this.collectionService.createCollection(this.companyId, this.collection).subscribe({
            next: (response) => {
              this.loading = false;
              this.nCollection = response.dados.cdColeta;
              this.cdFilEmp = response.dados.cdFilEmp;
              this.snackbar.open = true;
              this.snackbar.message = response.mensagem;
              this.snackbar.type = SnackbarType.Success;

              this.router.navigate(['/collection/actions'], {
                queryParams: { number: response.dados.cdColeta, cdFilEmp: response.dados.cdFilEmp },
              });

              this.reloadAll();
            },
            error: (response) => {
              this.snackbar.open = true;
              this.snackbar.message = response.error.mensagem;
              this.snackbar.errorHandling = response.error.tratamentoErro;
              this.snackbar.type = SnackbarType.Danger;
              this.loading = false;
            }
          })
        } else {
          this.snackbar.open = true;
          this.snackbar.message = 'erroPlacaCarretaDuplicada';
          this.snackbar.type = SnackbarType.Default;
        }
      } else {
        this.snackbar.open = true;
        this.snackbar.message = 'preenchaCamposObrigatorios';
        this.snackbar.type = SnackbarType.Default;
      }
    } catch (error) {
      this.snackbar.open = true;
      this.snackbar.message = 'verifiquePreencheuDadosCorretos';
      this.snackbar.type = SnackbarType.Default;
    }
  }

  updateCollection() {
    try {
      this.collection.dadosColeta = this.infoCollection;
      this.collection.localDeEntrega = this.deliveryPlace;
      this.collection.totaisDaCarga = this.loadTotals;
      this.collection.motorista = this.driver;

      if (this.verifyRequired()) {
        if (this.verifyDuplicateTruckPlate()) {
          if (!this.verifyValidationsUpdate()) return;
          this.formatCollection();
          this.loading = true;

          if (this.collection.motorista.placaCarreta02 == "") {
            this.collection.motorista.placaCarreta02 = null
          }

          if (this.collection.motorista.placaCarreta02 == "") {
            this.collection.motorista.placaCarreta02 = null
          }

          this.collectionService.updateCollection(this.companyId, this.nCollection!, this.cdFilEmp!, this.collection).subscribe({
            next: (response) => {
              this.loading = false;
              this.snackbar.open = true;
              this.snackbar.message = response.mensagem;
              this.snackbar.type = SnackbarType.Success;
              this.getDetailsCollection();
            },
            error: (response) => {
              this.snackbar.open = true;
              this.snackbar.message = response.error.mensagem;
              this.snackbar.errorHandling = response.error.tratamentoErro;
              this.snackbar.type = SnackbarType.Danger;
              this.loading = false;
            }
          })
        } else {
          this.snackbar.open = true;
          this.snackbar.message = 'erroPlacaCarretaDuplicada';
          this.snackbar.type = SnackbarType.Default;
        }
      } else {
        this.snackbar.open = true;
        this.snackbar.message = 'preenchaCamposObrigatorios';
        this.snackbar.type = SnackbarType.Default;
      }
    } catch (error) {
      this.snackbar.open = true;
      this.snackbar.message = 'verifiquePreencheuDadosCorretos';
      this.snackbar.type = SnackbarType.Default;
    }

  }

  getDetailsCollection() {
    this.loading = true;

    this.collectionService.getDetailsCollection(this.companyId, this.nCollection!, this.cdFilEmp!).subscribe({
      next: (response) => {
        this.collection = response.dados;

        this.status = response.dados.status;

        const readonlyStatus = [
          StatusColeta.Iniciada,
          StatusColeta.PendenteAceite,
          StatusColeta.Baixada,
          StatusColeta.Cancelada,
          StatusColeta.Rejeitada
        ];
        this.readonly = readonlyStatus.includes(this.status);

        this.changeTypeCollection(this.collection.dadosColeta.tipoColeta)

        this.collection.dadosColeta.dataInclusao = formatDateBack(this.collection.dadosColeta.dataInclusao)!;
        this.collection.dadosColeta.dataColeta = this.collection.dadosColeta.dataColeta ? this.collection.dadosColeta.dataColeta.split('T')[0] : '';


        this.collection.dadosColeta.cnpjCpfSolicitante = setMaskCpfCnpj(this.collection.dadosColeta.cnpjCpfSolicitante) ? setMaskCpfCnpj(this.collection.dadosColeta.cnpjCpfSolicitante)! : '';
        this.collection.dadosColeta.cnpjCpfSolicitante ? this.collection.dadosColeta.cnpjCpfSolicitante = `${this.collection.dadosColeta.cnpjCpfSolicitante} - ${this.collection.dadosColeta.nomeFantasiaSolicitante}` : '';

        this.collection.dadosColeta.cnpjCpfColeta = setMaskCpfCnpj(this.collection.dadosColeta.cnpjCpfColeta) ? setMaskCpfCnpj(this.collection.dadosColeta.cnpjCpfColeta)! : '';
        this.collection.dadosColeta.cnpjCpfColeta ? this.collection.dadosColeta.cnpjCpfColeta = `${this.collection.dadosColeta.cnpjCpfColeta} - ${this.collection.dadosColeta.nomeFantasiaColeta}` : '';

        if (this.collection.localDeEntrega?.cnpjCpf) {
          this.collection.localDeEntrega.cnpjCpf = setMaskCpfCnpj(this.collection.localDeEntrega.cnpjCpf) ? setMaskCpfCnpj(this.collection.localDeEntrega.cnpjCpf)! : '';
          this.collection.localDeEntrega.cnpjCpf ? this.collection.localDeEntrega.cnpjCpf = `${this.collection.localDeEntrega.cnpjCpf} - ${this.collection.localDeEntrega.empresa}` : '';
        }

        if (this.collection.localDeEntrega?.dataEntrega) {
          this.collection.localDeEntrega.dataEntrega = this.collection.localDeEntrega.dataEntrega ? this.collection.localDeEntrega.dataEntrega.split('T')[0] : '';
        }

        this.infoCollection = this.collection.dadosColeta ? this.collection.dadosColeta : <DadosColeta>{};
        this.deliveryPlace = this.collection.localDeEntrega ? this.collection.localDeEntrega : <LocalDeEntrega>{};
        this.loadTotals = this.collection.totaisDaCarga ? this.collection.totaisDaCarga : <TotaisDaCarga>{};
        this.driver = this.collection.motorista ? this.collection.motorista : <Motorista>{};

        if (this.collection.motorista.placaCarreta03) this.totalFieldTruck = 3;
        if (this.collection.motorista.placaCarreta02 && !this.collection.motorista.placaCarreta03) this.totalFieldTruck = 2;
        if (!this.collection.motorista.placaCarreta02 && !this.collection.motorista.placaCarreta03) this.totalFieldTruck = 1;

        this.registerCustomField = response.dados.camposPersonalizados;
        this.buildCustomField();

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

  /**Busca os campos personalizados*/
  loadCustomFields() {
    this.loading = true;
    this.customFieldService.getDisplayFields(this.companyId, Modules.Coleta).subscribe({
      next: (response) => {
        this.customField = response.dados;
        this.stepName = response.dados[0].nomeExibicao;
        if (this.customField.length >= 1) this.normalCollection(true);

        if (this.nCollection) {
          this.getDetailsCollection();
        } else {
          this.loading = false;
        }
      },
      error: (response) => {
        if (this.nCollection) {
          this.getDetailsCollection();
        } else {
          this.loading = false;
        }
      }
    })
  }

  /**Monta os campos personalizados de acordo com os valores retornados pelo backend.*/
  buildCustomField() {
    this.registerCustomField.forEach(fieldRegistered => {
      const fieldIndex = this.customField.findIndex(
        field => field.codigo === fieldRegistered.idCampoPersonalizado
      );

      if (fieldIndex !== -1) {
        const field = this.customField[fieldIndex];
        const isTypeWithItems: boolean = typeWithItems(field.tipo);

        if (isTypeWithItems) {
          const values = JSON.parse(fieldRegistered.valor);
          field.valor = values.length >= 1 ? values : null;
        } else {
          field.valor = fieldRegistered.valor;
        }

        field.id = fieldRegistered.id;
        this.customField[fieldIndex] = field;
      }
    });
  }

  /** Formata os campos perosnalizados para serem enviados ao backend.*/
  formatCustomFieldToSend() {
    if (this.customField.length >= 1) {
      this.registerCustomField = [];
      for (const field of this.customField) {
        const newField: RegisterCustomField = {
          idCampoPersonalizado: field.codigo,
          idExibicao: field.idExibicao,
          valor: typeWithItems(field.tipo)
            ? JSON.stringify(field.valor ? field.valor : '')
            : String(field.valor ? field.valor : '')
        }
        if (field.id) newField.id = field.id;
        if (field.tipo === TypeCustomField.Data) {
          newField.valor = String(field.valor).includes('-')
            ? formatDateUtcToBr(String(field.valor))
            : String(field.valor);

          if (newField.valor.includes('undefined') || newField.valor.includes('null')) newField.valor = '';
        }
        this.registerCustomField.push(newField);
      }
      this.collection.camposPersonalizados = this.registerCustomField;
    } else {
      this.collection.camposPersonalizados = null;
    }
  }

  /**Recebe os dados inputados pelo usuário na aba de campos personalizadoos*/
  handleFieldsUpdate(updatedFields: ExhibitionCustomField[]) {
    this.customField = updatedFields;
  }

  close() {
    this.router.navigate(['/collection/list'])
  }

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

  /**Retorna a classe css necessária referente ao status da coleta.*/
  getTypeChips(): string {
    const statusWarning = [StatusColeta.PendenteAceite, StatusColeta.Prevista];
    const statusSuccess = [StatusColeta.Programada, StatusColeta.Iniciada, StatusColeta.Baixada];
    const statusDanger = [StatusColeta.Rejeitada, StatusColeta.Cancelada];

    if (statusWarning.includes(this.status)) return 'chips-status-warning';
    if (statusSuccess.includes(this.status)) return 'chips-status-success';
    if (statusDanger.includes(this.status)) return 'chips-status-danger';

    return '';
  }

  getTitle(): string {
    if (!this.nCollection) return 'inclusaoColeta';
    if (this.nCollection && !this.readonly) return 'edicaoColeta';
    if (this.nCollection && this.readonly) return 'visualizacaoColeta';
    return '';
  }

  /** Busca o histórico de alterações da Coleta.*/
  openLogCollection() {
    this.loading = true;
    this.collectionService.getHistoricCollection(this.companyId, this.nCollection, this.cdFilEmp).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.dados.historicos.length >= 1) {
          this.historics = formatHistoric(response.dados.historicos);
        } else {
          this.historicNotFound();
          return;
        }

        for (const historic of this.historics) {
          if (historic.acao === 'Baixado') {
            openModalDetailsHistoric(this.modalService, historic);
            break;
          }
        }
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    });
  }

  historicNotFound() {
    this.loading = false;
    this.snackbar.open = true;
    this.snackbar.message = 'historicoNaoEncontrado';
  }

  openQuotation() {

  }

  openTrip() {

  }

  openCTe() {

  }

  updateCollectionCode() {
    this.collectionCode[0].cdColeta = this.nCollection;
    this.collectionCode[0].cdFilEmp = this.cdFilEmp;
  }

  // AÇÕES
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
    return statusAllowed.includes(this.status)
  }

  /** Verifica se a coleta selecionada apresenta o status "Pendente de Aceite". */
  verifyPendingAccept(): boolean {
    return this.status === StatusColeta.PendenteAceite;
  }

  /** Abre o modal de confirmação de acordo com a ação clicada. */
  openModalConfirm(action: 'delete' | 'send-email' | 'accept' | 'send-whatsapp' | 'print' | 'export-excel') {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-confirm',
    };
    const modalRef = this.modalService.open(ModalConfirmationComponent, modalOptions);

    switch (action) {
      case 'delete':
        modalRef.componentInstance.title = 'excluirColeta';
        modalRef.componentInstance.text = 'textoExcluirColeta';
        modalRef.componentInstance.style = 'red';
        modalRef.componentInstance.textBtnConfirm = 'excluir';
        break;
      case 'send-email':
        modalRef.componentInstance.title = 'enviarColetaEmail';
        modalRef.componentInstance.text = 'textoEnviarColetaEmail';
        modalRef.componentInstance.style = 'green';
        modalRef.componentInstance.textBtnConfirm = 'simEnviar';
        break;
      case 'accept':
        modalRef.componentInstance.title = 'aceitarColeta';
        modalRef.componentInstance.text = 'textoAceitarColeta';
        modalRef.componentInstance.style = 'green';
        modalRef.componentInstance.textBtnConfirm = 'simAceitar';
        break;
      case 'send-whatsapp':
        modalRef.componentInstance.title = 'enviarColetaWhatsApp';
        modalRef.componentInstance.text = 'textoEnviarColetaWhatsApp';
        modalRef.componentInstance.style = 'green';
        modalRef.componentInstance.textBtnConfirm = 'simEnviar';
        break;
      case 'print':
        modalRef.componentInstance.title = 'imprimirColeta';
        modalRef.componentInstance.text = 'textoImprimirColeta';
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
    modalRef.componentInstance.title = 'cancelarColeta';
    modalRef.componentInstance.text = 'textoCancelarColeta';

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
    modalRef.componentInstance.collectionsSelected = 1;

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
    modalRef.componentInstance.codeHistoric = this.collectionCode[0];


    modalRef.result
      .then((res: boolean) => {
      })
      .catch((res) => {

      })
  }

  /** Realiza a busca de configurações de contato e layout para abrir o modal de envio de e-mail individual. */
  getConfigSendEmail() {
    this.loading = true;
    const params: KeyValue[] = [];
    params.push(
      {
        chave: 'cdcoleta',
        valor: this.collectionCode[0].cdColeta
      },
      {
        chave: 'cdfilemp',
        valor: this.collectionCode[0].cdFilEmp
      }
    )

    this.emailService.getConfigSendEmail(this.companyId, Modules.Coleta, params).subscribe({
      next: (response) => {
        this.loading = false;
        const config: ConfigurationEmail = response.dados;
        this.openModalSingleEmail(params, config);
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
  openModalMultipleEmail(params: KeyValue[]) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-send-email',
    };

    const modalRef = this.modalService.open(ModalSendEmailMultipleComponent, modalOptions);
    modalRef.componentInstance.titleModal = 'titleModalEnviarColetaEmailLote';
    modalRef.componentInstance.textModal = 'textModalEnviarColetaEmailLote';
    modalRef.componentInstance.module = Modules.Coleta;
    modalRef.componentInstance.params = params;
    modalRef.componentInstance.recipient = this.storageService.getEmail();

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
    this.collectionService.deleteCollection(this.companyId, this.collectionCode).subscribe({
      next: (response) => {
        this.loading = false;
        this.close();
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
    this.collectionService.rejectCollection(this.companyId, this.collectionCode[0].cdColeta, this.collectionCode[0].cdFilEmp, reason).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.mensagem;
        this.snackbar.type = SnackbarType.Success;
        this.reloadPage();
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
    this.collectionService.aceptCollection(this.companyId, this.collectionCode[0].cdColeta, this.collectionCode[0].cdFilEmp).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.mensagem;
        this.snackbar.type = SnackbarType.Success;
        this.reloadPage();
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
      coletas: this.collectionCode
    }

    this.collectionService.cancelCollection(this.companyId, body).subscribe({
      next: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.mensagem;
        this.snackbar.type = SnackbarType.Success;
        this.reloadPage();
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
    this.collectionService.getUrlToSendRelatoryWpp(this.companyId, this.collectionCode, this.cdReportSelected).subscribe({
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
    content += `%0a*Coleta cadastrada na empresa:*%0a${this.collection.dadosColeta.filialInclusao}%0a`;
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
      const response = await this.collectionService.getBase64Report(this.companyId, this.collectionCode, this.cdReportSelected).toPromise();
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
      Coletas: this.collectionCode,
      DataBaixa: dataBaixa,
      HoraColeta: `${horaColeta}:00`,
      TimeZone: getTimeZone()
    };

    this.collectionService.downloadCollection(this.companyId, body).subscribe({
      next: (response) => {
        this.loading = false;
        this.reloadPage();
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
      page: 1,
      take: 100,
      search: '',
      tipoData: null,
      status: null,
      columns: [],
      filtros: [],
      dataInicial: null,
      dataFinal: null,
      coletas: this.collectionCode
    }

    this.loading = true;
    this.collectionService.exportExcel(body, this.companyId).subscribe({
      next: (response: Blob) => {
        const downloadURL = window.URL.createObjectURL(response);
        const link = document.createElement("a");
        link.href = downloadURL;
        link.download = `Coleta-${Date.now()}.xlsx`;
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

  reloadPage() {
    this.router.navigate(['/collection/actions'], {
      queryParams: { number: this.nCollection, cdFilEmp: this.cdFilEmp },
    });

    this.reloadAll();
  }

  /** Processa uma lista de notas fiscais (NFs) e as salva se for uma edição de coleta.
   * @param nfs Array de objetos do tipo `NotaFiscal` que representa as notas fiscais a serem processadas.
  */
  setNotaFiscal(nfs: NotaFiscal[]) {
    if (this.nCollection) {
      this.collectionService.saveNotaFiscal(this.companyId, this.nCollection, this.cdFilEmp || '', nfs)
        .subscribe({
          next: (response) => {
            this.loadTotals.nfs = nfs;
            this.stageLoadTotalsComponent.calculateTotals();
            this.loading = false;
            this.snackbar.open = true;
            this.snackbar.message = response.mensagem;
            this.snackbar.errorHandling = response.tratamentoErro;
            this.snackbar.type = SnackbarType.Success;
            this.loading = false;
          },
          error: (response) => {
            this.snackbar.open = true;
            this.snackbar.message = response.mensagem;
            this.snackbar.errorHandling = response.tratamentoErro;
            this.snackbar.type = SnackbarType.Danger;
            this.loading = false;
          }
        })
    }
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


}
