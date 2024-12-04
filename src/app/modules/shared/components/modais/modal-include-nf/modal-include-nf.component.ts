import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

import { ModalDefineMeasureComponent } from '../modal-define-measure/modal-define-measure.component';
import { NovaNotaFiscal } from 'src/app/modules/shared/models/new-invoice.model';
import { CollectionService } from 'src/app/modules/collection/services/collection.service';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { TipoDocumentoNotaFiscal } from 'src/app/modules/shared/models/types-document.enum';
import { ConferenceService } from 'src/app/modules/conference/services/conference.service';
import { formatDateBrToUtc, formatOnlyDateBack } from '../../../utils/date-utils';
import { Snackbar } from '../../../models/snackbar.model';
import { removeMaskCpfCnpj, setMaskCnpj, setMaskCpf } from '../../../utils/cnpj-mask';
import { hiddenModal, visibleModal } from '../../../utils/modal-utils';
import { ModalSearchClientComponent } from 'src/app/modules/shared/components/modais/modal-search-client/modal-search-client.component';
import { ModalIncludeClientComponent } from 'src/app/modules/shared/components/modais/modal-include-client/modal-include-client.component';
import { SnackbarType } from '../../../consts/snackbar-type.const';
import { isYearBefore1900 } from 'src/app/modules/shared/utils/period.utils';

@Component({
  selector: 'app-modal-include-nf',
  templateUrl: './modal-include-nf.component.html',
  styleUrls: ['./modal-include-nf.component.scss']
})
export class ModalIncludeNfComponent implements OnInit {

  private timeout: any;
  companyId: string;
  loading: boolean = false;
  invoice: NovaNotaFiscal = <NovaNotaFiscal>{};
  companies = [];
  companiesList = [];
  companiesList2 = [];
  companiesList3 = [];
  typesDocument: string[] = [TipoDocumentoNotaFiscal[0], TipoDocumentoNotaFiscal[10], TipoDocumentoNotaFiscal[88], TipoDocumentoNotaFiscal[99]];
  alertRequired: boolean = false;
  enableInputTag: boolean = false;
  snackbar: Snackbar = new Snackbar();
  idInvoice: number = 0;
  nConference: number = 0;
  disableTag: boolean = false;
  cdFilial: string = '';
  dateNow: string = '';
  dateValidation: boolean = false;
  dateValidationMessage: string = '';

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal,
    private modalService: NgbModal,
    private collectionService: CollectionService,
    private storageService: StorageService,
    private conferenceService: ConferenceService,
    private route: ActivatedRoute
  ) {
    translate.use('pt-br')
    this.companyId = storageService.getCompanyId()!;
  }

  ngOnInit(): void {
    if (this.idInvoice) {
      this.getDetailsInvoice();
    }
  }

  close() {
    this.modal.close();
  }

  /**Valida os campos do objeto `invoice` e realiza ações com base na validação.*/
  confirm() {
    if (
      this.invoice.cnpjRemetente &&
      this.invoice.cnpjDestinatario &&
      this.invoice.cnpjPagador &&
      this.invoice.tipoDocumento &&
      this.invoice.numNF &&
      this.invoice.serie &&
      this.invoice.dataEmissao &&
      this.invoice.qtdVolumes >= 0
    ) {
      if (this.invoice.tipoDocumento === 'Nota Fiscal') {
        if (!this.invoice.chaveDeAcesso) {
          this.snackbar.open = true;
          this.snackbar.message = 'informeChaveAcesso';
          this.snackbar.type = SnackbarType.Default;
          return
        }

        if (this.invoice.chaveDeAcesso.length !== 44) {
          this.snackbar.open = true;
          this.snackbar.message = 'chaveAcessoValidacao';
          this.snackbar.type = SnackbarType.Default;
          return
        }
      } else if(this.invoice.dataEmissao){
        if (isYearBefore1900(this.invoice.dataEmissao)) {
          this.snackbar.open = true;
          this.snackbar.message = 'erroDataPassada1900';
          this.snackbar.type = SnackbarType.Default;
          return; 
        }
      }
      this.idInvoice ? this.editInvoice() : this.registerInvoice();
    } else {
      this.snackbar.open = true;
      this.snackbar.message = 'preenchaCamposObrigatorios';
      this.snackbar.type = SnackbarType.Default;
      this.alertRequired = true;
    }
  }

  registerInvoice() {
    this.loading = true;

    let newInvoice = { ...this.invoice };
    newInvoice = this.formatInvoiceToSend(newInvoice);

    this.conferenceService.postInvoice(this.companyId, newInvoice).subscribe({
      next: (response) => {

        this.loading = false;

        const result = {
          type: 'create',
          search: newInvoice.chaveDeAcesso ? newInvoice.chaveDeAcesso : newInvoice.numNF,
          noNf: response.dados.noNf,
          invoice: response.dados
        }
        this.modal.close(result)
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.type = SnackbarType.Danger;
      }
    })
  }

  /** Se a data de emissão (`dataEmissao`) estiver definida e for anterior a 1900, define a flag de validação de data como `true` e exibe uma mensagem de erro apropriada.
   * @returns Retorna `true` se a data de emissão for anterior a 1900 e a validação falhar; caso contrário, retorna `false` se a data for válida ou não estiver definida.
   */
  verifyDate() {
    if (this.invoice.dataEmissao && isYearBefore1900(this.invoice.dataEmissao)) {
      this.dateValidation = true;
      this.dateValidationMessage = 'anoMenorQue1900';
      return true;
    }else {
      this.dateValidation = false;
      this.dateValidationMessage = '';
      return false;
    }
  }

  /** Manipula a mudança da data recebendo uma nova data como string. */
  onDateChanged(newDate: string) {
    this.invoice.dataEmissao = newDate;
    this.verifyDate();
  }

  getDetailsInvoice() {
    this.loading = true;

    this.conferenceService.getDetailsInvoice(this.companyId, this.idInvoice, this.cdFilial).subscribe({
      next: (response) => {
        this.loading = false;
        this.invoice = response.dados;

        if (this.invoice.flImpEtiqueta === 'N') {
          this.disableTag = false;
        } else {
          this.disableTag = true;
        }

        this.invoice.dataEmissao = this.invoice.dataEmissao.split('T')[0];
        this.formatFiledsCpfAndCnpj();
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.type = SnackbarType.Danger;
      }
    })

  }

  editInvoice() {
    this.loading = true;

    let newInvoice = { ...this.invoice };
    newInvoice = this.formatInvoiceToSend(newInvoice);
    newInvoice.noNf = this.idInvoice;

    this.conferenceService.editInvoice(this.companyId, newInvoice).subscribe({
      next: (response) => {

        const result = {
          type: 'update',
          search: newInvoice.chaveDeAcesso ? newInvoice.chaveDeAcesso : newInvoice.numNF,
          noNf: this.idInvoice,
          invoice: response.dados
        }

        if (!this.disableTag && this.nConference) {
          this.callProcedureFlag(result);
        } else {
          this.loading = false;
          this.modal.close(result);
        }
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.type = SnackbarType.Danger;
      }
    })
  }

  callProcedureFlag(result: any) {
    const body = {
      idconferencia: Number(this.nConference),
      nonf: Number(this.invoice.noNf),
      qtdetiqueta: String(this.invoice.qtdEtiquetas!),
      cdempresa: this.invoice.cdEmpresa!,
      cdfilemp: this.invoice.cdFilEmp!
    }

    this.conferenceService.callProcedureFlag(this.companyId, body).subscribe({
      next: (response) => {
        this.loading = false;
        this.modal.close(result)
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.type = SnackbarType.Danger;
      }
    })
  }

  setDocument(index: number | null) {
    if (index !== null) {
      this.invoice.tipoDocumento = this.typesDocument[index];

      if (this.invoice.tipoDocumento !== 'Nota Fiscal') this.invoice.chaveDeAcesso = '';
    } else {
      this.invoice.tipoDocumento = '';
    }
  }

  cnpjSelected(selected: any, type: 'remetente' | 'destinatario' | 'pagador') {
    if (selected !== null) {
      if (selected == 0) {
        this.openModalSearchClient(type);
      } else {
        let item: any = this.companies.at(selected - 1);
        let item2: any = this.companies.at(selected - 1);
        let item3: any = this.companies.at(selected - 1);

        switch (type) {
          case 'remetente':
            this.invoice.cnpjRemetente = item.cpfCnpj + ' - ' + item.nomeFantasia;
            this.invoice.cdRemetente = item.cdCliente;
            break;

          case 'destinatario':
            this.invoice.cnpjDestinatario = item2.cpfCnpj + ' - ' + item2.nomeFantasia;
            this.invoice.cdDestinatario = item2.cdCliente;
            break;

          case 'pagador':
            this.invoice.cnpjPagador = item3.cpfCnpj + ' - ' + item3.nomeFantasia;
            this.invoice.cdPagador = item3.cdCliente;
            break;
        }
      }
    }
  }

  search(text: string, type: 'remetente' | 'destinatario' | 'pagador') {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.loading = true;
    this.timeout = setTimeout(() => {
      this.collectionService.getClients(this.companyId, text).subscribe(
        {
          next: response => {
            this.companies = response.dados
            if (type === 'remetente') {
              this.companiesList = response.dados.map((cliente: any) => `${cliente.cpfCnpj} - ${cliente.nomeFantasia}`);
            }

            if (type === 'destinatario') {
              this.companiesList2 = response.dados.map((cliente: any) => `${cliente.cpfCnpj} - ${cliente.nomeFantasia}`);
            }

            if (type === 'pagador') {
              this.companiesList3 = response.dados.map((cliente: any) => `${cliente.cpfCnpj} - ${cliente.nomeFantasia}`);
            }

            this.loading = false;
          },
          error: err => {
            this.loading = false;
          }
        }
      );
    }, 1000);
  }

  openModalSearchClient(type: 'remetente' | 'destinatario' | 'pagador') {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-search-client',
    };
    const modalRef = this.modalService.open(ModalSearchClientComponent, modalOptions);

    this.modal.update(hiddenModal);
    modalRef.dismissed.subscribe(() => {
      this.modal.update(visibleModal)
    });

    modalRef.result
      .then((res: any) => {
        this.modal.update(visibleModal);

        if (res) {
          if (type === 'remetente') this.invoice.cnpjRemetente = res.cnpj + ' - ' + res.nomeFantasia;
          if (type === 'destinatario') this.invoice.cnpjDestinatario = res.cnpj + ' - ' + res.nomeFantasia;
          if (type === 'pagador') this.invoice.cnpjPagador = res.cnpj + ' - ' + res.nomeFantasia;
        }
      })
      .catch((res) => {
        this.modal.update(visibleModal);
      })
  }

  openEditClient(type: 'remetente' | 'destinatario' | 'pagador') {
    const modalOptions: NgbModalOptions = {
      centered: true,
      modalDialogClass: 'modal-search-client',
    };
    const modalRef = this.modalService.open(ModalIncludeClientComponent, modalOptions);
    modalRef.componentInstance.edit = true;

    switch (type) {
      case 'remetente':
        modalRef.componentInstance.cdClient = this.invoice.cdRemetente;
        [modalRef.componentInstance.cnpjSearch,] = this.invoice.cnpjRemetente?.split(' - ');
        break;

      case 'destinatario':
        modalRef.componentInstance.cdClient = this.invoice.cdDestinatario;
        [modalRef.componentInstance.cnpjSearch,] = this.invoice.cnpjDestinatario?.split(' - ');
        break;

      case 'pagador':
        modalRef.componentInstance.cdClient = this.invoice.cdPagador;
        [modalRef.componentInstance.cnpjSearch,] = this.invoice.cnpjPagador?.split(' - ');
        break;
    }

    this.modal.update(hiddenModal);
    modalRef.dismissed.subscribe(() => {
      this.modal.update(visibleModal)
    });

    modalRef.result
      .then((res: any) => {
        this.modal.update(visibleModal)
        if (res) {
          const clientEdited = res;
          if (type === 'remetente') this.invoice.cnpjRemetente = clientEdited.cnpj + ' - ' + clientEdited.nomeFantasia;
          if (type === 'destinatario') this.invoice.cnpjDestinatario = clientEdited.cnpj + ' - ' + clientEdited.nomeFantasia;
          if (type === 'pagador') this.invoice.cnpjPagador = clientEdited.cnpj + ' - ' + clientEdited.nomeFantasia;
        }
      })
      .catch((res) => {
        this.modal.update(visibleModal)
      })
  }

  formatInvoiceToSend(invoice: NovaNotaFiscal) {
    invoice.dataEmissao = `${invoice.dataEmissao}T00:00:00`;
    invoice.nomeFantasiaRemetente ? [invoice.cnpjRemetente, invoice.nomeFantasiaRemetente] = invoice.cnpjRemetente.split(' - ') : invoice.nomeFantasiaRemetente = '[teste]';
    invoice.nomeFantasiaDestinatario ? [invoice.cnpjDestinatario, invoice.nomeFantasiaDestinatario] = invoice.cnpjDestinatario.split(' - ') : invoice.nomeFantasiaDestinatario = '[teste]';
    invoice.nomeFantasiaPagador ? [invoice.cnpjPagador, invoice.nomeFantasiaPagador] = invoice.cnpjPagador.split(' - ') : invoice.nomeFantasiaPagador = '[teste]';
    invoice.qtdVolumes = Number(invoice.qtdVolumes);

    if (!invoice.qtdEtiquetas && this.enableInputTag) invoice.qtdEtiquetas = String(invoice.qtdVolumes);
    if (invoice.pedido == '' || invoice.pedido == null) invoice.pedido = '';
    if (invoice.romaneio == '' || invoice.romaneio == null) invoice.romaneio = '';
    if (invoice.chaveDeAcesso == '' || invoice.chaveDeAcesso == null) invoice.chaveDeAcesso = '';
    if (invoice.peso == 0 || invoice.peso == null) invoice.peso = null;
    if (invoice.pesoBruto == 0 || invoice.pesoBruto == null) invoice.pesoBruto = null;
    if (invoice.m3 == 0 || invoice.m3 == null) invoice.m3 = null;
    if (invoice.valorMercadoria == 0 || invoice.valorMercadoria == null) invoice.valorMercadoria = null;

    return invoice;
  }

  formatFiledsCpfAndCnpj() {
    this.invoice.cnpjRemetente = removeMaskCpfCnpj(this.invoice.cnpjRemetente);
    this.invoice.cnpjDestinatario = removeMaskCpfCnpj(this.invoice.cnpjDestinatario);
    this.invoice.cnpjPagador = removeMaskCpfCnpj(this.invoice.cnpjPagador);

    this.invoice.cnpjRemetente.length <= 11 ? this.invoice.cnpjRemetente = setMaskCpf(this.invoice.cnpjRemetente) : this.invoice.cnpjRemetente = setMaskCnpj(this.invoice.cnpjRemetente);
    this.invoice.cnpjDestinatario.length <= 11 ? this.invoice.cnpjDestinatario = setMaskCpf(this.invoice.cnpjDestinatario) : this.invoice.cnpjDestinatario = setMaskCnpj(this.invoice.cnpjDestinatario);
    this.invoice.cnpjPagador.length <= 11 ? this.invoice.cnpjPagador = setMaskCpf(this.invoice.cnpjPagador) : this.invoice.cnpjPagador = setMaskCnpj(this.invoice.cnpjPagador);

    this.invoice.cnpjRemetente ? this.invoice.cnpjRemetente = `${this.invoice.cnpjRemetente} - ${this.invoice.nomeFantasiaRemetente}` : this.invoice.cnpjRemetente = '';
    this.invoice.cnpjDestinatario ? this.invoice.cnpjDestinatario = `${this.invoice.cnpjDestinatario} - ${this.invoice.nomeFantasiaDestinatario}` : this.invoice.cnpjDestinatario = '';
    this.invoice.cnpjPagador ? this.invoice.cnpjPagador = `${this.invoice.cnpjPagador} - ${this.invoice.nomeFantasiaPagador}` : this.invoice.cnpjPagador = '';
  }
}
