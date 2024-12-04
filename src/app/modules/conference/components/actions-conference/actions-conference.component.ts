import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { StepperModel } from 'src/app/modules/shared/models/stepper.model';
import { EtapaNotasFiscais } from '../../models/invoices.model';
import { ModalDisagreementConferenceComponent } from '../../modais/modal-disagreement-conference/modal-disagreement-conference.component';
import { Volume } from '../../models/volum.model';
import { ConferenceService } from '../../services/conference.service';
import { formatDateBack, formatDateUtcToBr } from 'src/app/modules/shared/utils/date-utils';
import { Etiqueta } from '../../models/tag.model';
import { StatusConferencia } from '../../models/status-conference.enum';
import { DetailsStatus } from 'src/app/modules/shared/models/details-status.model';
import { ModalDetailsStatusComponent } from 'src/app/modules/shared/components/modais/modal-details-status/modal-details-status.component';
import { DetailTypeConference } from '../../models/detail-type-conference.model';
import { ExhibitionCustomField, RegisterCustomField } from 'src/app/modules/shared/models/exhibition-custom-field.model';
import { CustomFieldService } from 'src/app/modules/settings/services/custom-field.service';
import { TypeCustomField, typeWithItems } from 'src/app/modules/settings/models/type-custom-field';
import { ModalPermissionComponent } from '../../modais/modal-permission/modal-permission.component';
import { AcessoPermissaoConferenciaModel } from '../../models/check-acesss.model';
import { ConferenciaPermissoes } from 'src/app/modules/shared/consts/permissions.const';
import { setCurrencyMask } from 'src/app/modules/shared/utils/currency-mask';

@Component({
  selector: 'app-actions-conference',
  templateUrl: './actions-conference.component.html',
  styleUrls: ['./actions-conference.component.scss'],
})
export class ActionsConferenceComponent {

  companyId: string;
  permissions: string[] = [];
  authConference = ConferenciaPermissoes;
  nConference: number | null = null;
  statusEnum = StatusConferencia;
  currentStatus: number = 0;
  steppers: StepperModel[] = [];
  stepperIndex: number = 0;
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  invoices: EtapaNotasFiscais = <EtapaNotasFiscais>{};
  volumes: Volume[] = [];
  alertRequired: boolean = false;
  tags: Etiqueta[] = [];
  tagsName: string[] = [];
  tagSelected: Etiqueta = <Etiqueta>{};
  barCode: string = '';
  desagreementVolumes: boolean = true;
  desagreementInvoices: boolean = true;
  reasonDesagreement: string | null = null;
  printTag: boolean = false;
  allVolumes: number = 0;
  volumesChecked: number = 0;
  allVolumesRead: number = 0;
  includeNFWithVolume: boolean = false;
  typesConference: DetailTypeConference[] = [];
  typesConferenceName: string[] = [];
  blindConference: boolean = false;
  customField: ExhibitionCustomField[] = [];
  registerCustomField: RegisterCustomField[] = [];
  camposPersonalizados: [] = [];
  stepName: string = '';
  flConferenciaNf: boolean = false;
  invoicesToCheck: any[] = [];
  allInvoices: number = 0;
  invoicesChecked: number = 0;
  showCustomFields: boolean = false;

  constructor(
    private translate: TranslateService,
    private storageService: StorageService,
    private router: Router,
    private modalService: NgbModal,
    private conferenceService: ConferenceService,
    private customFieldService: CustomFieldService,
    private route: ActivatedRoute
  ) {
    translate.use('pt-br');
    this.companyId = storageService.getCompanyId()!;
    this.permissions = storageService.getPermissionsUser();
    this.getTypesConference();

    if (
      !this.permissions.includes(this.authConference.Ler) &&
      !this.permissions.includes(this.authConference.Criar)
    ) {
      this.close();
    }

    route.queryParams.subscribe((queryParams) => {
      if (queryParams['check']) {
        setTimeout(() => {
          this.stepperIndex = 2;
        }, 0);
      }

      if (queryParams['number']) {
        this.nConference = queryParams['number'];
        if (!this.permissions.includes(this.authConference.Ler)) this.close();

        // this.getDetailConference();
        this.getTags();
        this.getVolumes();
      }

      this.loadCustomFields()
    });

    if (this.nConference) {
      this.setStepper(2);
    } else {
      this.setStepper(1);
    }

    if (!this.nConference && !this.permissions.includes(this.authConference.Criar)) {
      this.snackbar.open = true;
      this.snackbar.timeHide = 10000;
      this.snackbar.message = 'usuarioSemPermissaoCadastroConferencia';
    }
  }

  ngOnInit() {
    // this.loadCustomFields();
  }

  loadCustomFields() {
    this.loading = true;
    this.customFieldService
      .getDisplayFields(this.companyId, 'Conferência')
      .subscribe({
        next: (response) => {
          this.showCustomFields = true;
          this.customField = response.dados;
          this.stepName = response.dados[0].nomeExibicao;
          if (this.customField.length >= 1) {
            this.nConference ? this.setStepper(2) : this.setStepper(1);
          }

          if (this.nConference) {
            this.getDetailConference();
          } else {
            this.loading = false;
          }
        },
        error: (response) => {
          this.showCustomFields = false;
          this.nConference ? this.setStepper(2) : this.setStepper(1);
          if (this.nConference) {
            this.getDetailConference();
          } else {
            this.loading = false;
          }
        },
      });
  }

  handleFieldsUpdate(updatedFields: ExhibitionCustomField[]) {
    this.customField = updatedFields;
  }

  // Type 1: Cadastro de conferência & Type 2: Edição de conferência.
  setStepper(type: 1 | 2) {
    this.steppers = [];
    if (type === 1) {
      this.steppers.push({
        src: 'invoices-white.svg',
        text: 'etapaNotasFiscais',
      });

      if (this.showCustomFields === true) {
        this.steppers.push({
          src: 'register-white.svg',
          text: this.stepName,
          width: '100%',
        });
      }

      this.steppers.push({
        src: 'conference-grey.svg',
        text: 'conferenciaDeVolumes',
        disabled: true
      });

      if (this.flConferenciaNf) {
        this.steppers.push({
          src: 'conference-grey.svg',
          text: 'conferenciaDeNotasFiscais'
        });
      }
    }

    if (type === 2) {
      this.steppers.push({
        src: 'invoices-white.svg',
        text: 'etapaNotasFiscais',
      });

      if (this.showCustomFields === true) {
        this.steppers.push({
          src: 'register-white.svg',
          text: this.stepName,
          width: '100%',
        });
      }

      this.steppers.push({
        src: 'conference-grey.svg',
        text: 'conferenciaDeVolumes'
      });

      if (this.flConferenciaNf) {
        this.steppers.push({
          src: 'conference-grey.svg',
          text: 'conferenciaDeNotasFiscais'
        });
      }
    }
  }

  nextStepper() {
    if (this.stepperIndex !== this.steppers.length) {
      this.stepperIndex += 1;
    }
  }

  backStepper() {
    if (this.stepperIndex !== 0) {
      this.stepperIndex -= 1;
    }
  }

  defineAction() {
    if (this.nConference) {
      if (this.desagreementVolumes || this.desagreementInvoices) {
        if (this.permissions.includes(this.authConference.BaixaConferenciaEmDesacordo)) {
          this.openModalDisagreement();
        } else {
          this.openModalAccessPermission();
        }
      } else {
        this.finishConference();
      }
    } else {
      this.setConference();
    }
  }

  openModalDisagreement(authorized?: boolean) {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-disagreement-conference',
    };

    const modalRef = this.modalService.open(
      ModalDisagreementConferenceComponent,
      modalOptions
    );
    modalRef.result
      .then((res: { reason: string }) => {
        if (res) {
          this.reasonDesagreement = res.reason;
          this.finishConference(authorized ? authorized : false);
        } else {
          this.reasonDesagreement = null;
        }
      })
      .catch((res) => {});
  }

  finishConference(authorized?: boolean) {
    if (this.verifyRequired()) {
      this.loading = true;

      const reqBody: {
        idConferencia: number;
        motivoDesacordo: string | null;
        autorizadoBaixaEmDesacordo: boolean;
      } = {
        idConferencia: this.nConference!,
        motivoDesacordo: this.reasonDesagreement,
        autorizadoBaixaEmDesacordo: authorized ? authorized : false,
      };

      this.conferenceService
        .finishConference(this.companyId, reqBody)
        .subscribe({
          next: (response) => {
            this.loading = false;

            this.snackbar.open = true;
            if (this.reasonDesagreement) {
              this.snackbar.message = 'Conferida com desacordo.';
            } else {
              this.snackbar.message = 'Conferida com sucesso.';
            }

            this.router.navigate(['/conference/list']);
          },
          error: (response) => {
            this.snackbar.open = true;
            this.snackbar.message = response.error.mensagem;
            this.loading = false;
            this.snackbar.errorHandling = response.error.tratamentoErro;
          },
        });
    }
  }

  getDetailConference(noUpdateStepper?: boolean) {
    this.loading = true;
    this.conferenceService
      .getDetailConference(this.companyId, this.nConference)
      .subscribe({
        next: (response) => {
          this.invoices = response.dados;

          let count = 0;
          for (const nf of this.invoices.nfs) {
            nf.peso ? nf.peso = nf.peso.toLocaleString('pt-BR') : null;
            nf.pesoCalc ? nf.pesoCalc = nf.pesoCalc.toLocaleString('pt-BR') : null;
            nf.volM3 ? nf.volM3 = nf.volM3.toLocaleString('pt-BR') : null;
            nf.valor = setCurrencyMask(nf.valor);
            nf.id = count;
            count++;
          }

          this.invoices.tpConferencia = response.dados.tpConferencia;
          const dateCreated = formatDateBack(response.dados.dtInclusao);

          this.currentStatus = response.dados.status;

          if (dateCreated) {
            [this.invoices.data, this.invoices.horarioInclusao] =
              dateCreated?.split(' - ');
            this.invoices.horarioInclusao = this.invoices.horarioInclusao.slice(
              0,
              8
            );
          }

          this.typesConference.forEach(type => {
            if (type.idConferenciaTipo === this.invoices.tpConferencia) {
              this.flConferenciaNf = type.flConferenciaNf;
            }
          });

          if (this.flConferenciaNf) {
            this.getInvoicesToCheck();
            this.desagreementInvoices = true;
          } else {
            this.desagreementInvoices = false;
          }
          if (!noUpdateStepper) this.setStepper(2)

          this.registerCustomField = response.dados.camposPersonalizados;
          this.buildCustomField();

          this.typesConference.forEach((type) => {
            if (type.idConferenciaTipo === this.invoices.tpConferencia) {
              this.blindConference = type.conferenciaCega;
            }
          });

          this.registerCustomField = response.dados.camposPersonalizados;
          this.buildCustomField();

          this.loading = false;
        },
        error: (response) => {
          this.snackbar.open = true;
          this.snackbar.message = response.error.mensagem;
          this.snackbar.errorHandling = response.error.tratamentoErro;
          this.loading = false;
        },
      });
  }

  getVolumes() {
    this.conferenceService
      .getVolumes(this.companyId, this.nConference!)
      .subscribe({
        next: (response) => {
          this.volumes = response.dados.volumesConferencia;
          this.desagreementVolumes = response.dados.finalizarComDesacordo;
          this.allVolumes =
            response.dados.totalConferidos + response.dados.totalNaoConferidos;
          this.volumesChecked = response.dados.totalConferidos;
          this.allVolumesRead = response.dados.totalItemsLidos;
        },
        error: (response) => {
          this.snackbar.open = true;
          this.snackbar.message = response.error.mensagem;
          this.snackbar.errorHandling = response.error.tratamentoErro;
        },
      });
  }

  verifyNFs(): boolean {
    this.typesConference.forEach((type) => {
      if (type.idConferenciaTipo === this.invoices.tpConferencia) {
        this.includeNFWithVolume = type.incluirNfPorVolume;
      }
    });

    if (this.includeNFWithVolume) {
      return true;
    } else {
      return this.invoices.nfs.length >= 1 ? true : false;
    }
  }

  verifyRequired(): boolean {
    if (
      this.invoices.tpConferencia !== null &&
      this.invoices.tpConferencia !== undefined &&
      this.invoices.descricao &&
      this.verifyNFs()
    ) {
      return true;
    } else {
      if (this.invoices.nfs.length < 1) {
        this.snackbar.open = true;
        this.snackbar.message = 'insiraNFParaConcluir';
      } else {
        this.snackbar.open = true;
        this.snackbar.message = 'preenchaCamposObrigatorios';
      }

      this.alertRequired = true;
      return false;
    }
  }

  setConference(noRedirect?: boolean) {
    if (this.verifyRequired()) {
      this.loading = true;

      const nfNumbers: string[] = [];

      this.invoices.nfs.forEach((nf) => {
        nfNumbers.push(`N${nf.cdFilEmp + nf.noNf}`);
      });

      this.formatCustomFieldToSend();

      const req = {
        idconferencia: this.invoices.idConferencia
          ? this.invoices.idConferencia
          : null,
        tpconferencia: this.invoices.tpConferencia,
        descricao: this.invoices.descricao,
        observacao: this.invoices.observacao,
        adocumentos: nfNumbers,
        camposPersonalizados: this.registerCustomField
      }

      this.conferenceService.setConference(this.companyId, req).subscribe({
        next: (response) => {
          this.setStepper(2);
          this.loading = false;

          if (!this.nConference) {
            this.snackbar.open = true;
            this.snackbar.message = `Conferência ${response.dados.idConferencia} incluída com sucesso.`;

            this.router.navigate(['/conference/actions'], {
              queryParams: { number: response.dados.idConferencia },
            });
            this.nConference = response.dados.idConferencia;
            if (this.permissions.includes(this.authConference.Editar)) {
              this.getTags();
              this.getVolumes();

              if (this.flConferenciaNf) {
                this.getInvoicesToCheck();
              }
            }
          } else {
            if (noRedirect) {
              this.getTags();
              this.getVolumes();

              if (this.flConferenciaNf) {
                this.getInvoicesToCheck();
              }
            } else {
              this.router.navigate(['/conference/list']);
            }
          }
        },
        error: (response) => {
          this.snackbar.open = true;
          this.snackbar.message = response.error.mensagem;
          this.snackbar.errorHandling = response.error.tratamentoErro;
          this.loading = false;
        },
      });
    }
  }

  getTags() {
    this.conferenceService.getTags(this.companyId).subscribe({
      next: (response) => {
        this.tags = response.dados;

        this.tagsName = [];
        this.tags.forEach((tag) => {
          this.tagsName.push(tag.dcConfigEtiqueta);
        });
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      },
    });
  }

  close() {
    this.router.navigate(['/conference/list']);
  }

  refreshAll() {
    this.getDetailConference();
    this.getTags();
    this.getVolumes();

    if (this.flConferenciaNf) {
      this.getInvoicesToCheck();
    }
  }

  conferenceFinished(): boolean {
    if (
      this.currentStatus === 2 ||
      this.currentStatus === 3 ||
      this.currentStatus === 4
    ) {
      return true;
    } else {
      return false;
    }
  }

  openModalDetailsConference() {
    const details: DetailsStatus = <DetailsStatus>{};
    details.idItem = `Conferência ${this.nConference}`;
    details.status = this.statusEnum[this.currentStatus];
    details.data = formatDateBack(this.invoices.dtAlteracao)!;
    details.usuario = this.invoices.usuarioAlteracao;
    details.motivo = this.invoices.txtMovidoDesacordo;

    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-details-status',
    };
    const modalRef = this.modalService.open(
      ModalDetailsStatusComponent,
      modalOptions
    );
    modalRef.componentInstance.txtMotivo = 'motivoDesacordo';
    modalRef.componentInstance.details = details;
  }

  getTypesConference() {
    this.conferenceService.getTypesConference(this.companyId).subscribe({
      next: (response) => {
        this.typesConference = response.dados;

        for (const type of this.typesConference) {
          this.typesConferenceName.push(type.descricao)
        }
      },
      error: (response) => {
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      },
    });
  }

  formatCustomFieldToSend() {
    if (this.customField.length >= 1) {
      this.registerCustomField = [];
      for (const field of this.customField) {
        const newField: RegisterCustomField = {
          idCampoPersonalizado: field.codigo,
          idExibicao: field.idExibicao,
          valor: typeWithItems(field.tipo)
            ? JSON.stringify(field.valor ? field.valor : '')
            : String(field.valor ? field.valor : ''),
        };
        if (field.id) newField.id = field.id;
        if (field.tipo === TypeCustomField.Data) {
          newField.valor = String(field.valor).includes('-')
            ? formatDateUtcToBr(String(field.valor))
            : String(field.valor);

          if (newField.valor.includes('undefined') || newField.valor.includes('null')) newField.valor = '';
        }
        this.registerCustomField.push(newField);
      }
    }
  }

  buildCustomField() {
    this.registerCustomField.forEach((fieldRegistered) => {
      const fieldIndex = this.customField.findIndex(
        (field) => field.codigo === fieldRegistered.idCampoPersonalizado
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

  openModalAccessPermission() {
    var interfaceData: AcessoPermissaoConferenciaModel;
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-permission',
    };
    const modalRef = this.modalService.open(
      ModalPermissionComponent,
      modalOptions
    );
    modalRef.componentInstance.nConference = this.nConference;

    modalRef.result
      .then((response) => {
        if (response) {
          this.openModalDisagreement(response);
        }
      })
      .catch((error) => {});
  }

  getInvoicesToCheck() {
    this.loading = true;
    this.conferenceService.getInvoicesToCheck(this.companyId, this.nConference!).subscribe({
      next: (response) => {
        this.invoicesToCheck = response.dados.notasConferencia;
        this.desagreementInvoices = response.dados.finalizarComDesacordo;
        this.allInvoices =
          response.dados.totalConferidos + response.dados.totalNaoConferidos;
        this.invoicesChecked = response.dados.totalConferidos;
        this.loading = false;
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      },
    });
  }
}
