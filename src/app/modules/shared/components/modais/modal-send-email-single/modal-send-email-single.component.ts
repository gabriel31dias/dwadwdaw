import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Snackbar } from '../../../models/snackbar.model';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { formatEmailsField, isValidEmail } from '../../../utils/email.utils';
import { Modules } from '../../../consts/list-modules.const';
import { SnackbarType } from '../../../consts/snackbar-type.const';
import { ConfigurationEmail, DataSendEmail, SendEmailSingle } from '../../../models/send-email.model';
import { KeyValue } from '../../../models/key-value.model';
import { EmailService } from '../../../services/email.service';

@Component({
  selector: 'app-modal-send-email-single',
  templateUrl: './modal-send-email-single.component.html',
  styleUrls: ['./modal-send-email-single.component.scss']
})
export class ModalSendEmailSingleComponent implements OnInit {

  companyId: string;
  module: Modules = '';
  params: KeyValue[] = [];
  attachments: string[] = []
  dataSendEmail: DataSendEmail = new DataSendEmail();
  haveRecipient: boolean = true;
  emailCopyInvalid: boolean = false;
  emailCopyInvalidMessage: string = '';
  emailRecipientInvalid: boolean = false;
  emailRecipientInvalidMessage: string = '';
  alertRequired: boolean = false;
  configEmail: ConfigurationEmail | null = null;
  snackbar: Snackbar = new Snackbar();
  loading: boolean = false;

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal,
    private storageService: StorageService,
    private emailService: EmailService
  ) {
    translate.use('pt-br');
    this.companyId = storageService.getCompanyId()!;
  }

  ngOnInit(): void {
    this.setConfigEmail();
  }

  sendEmail() {
    if (this.verifyEmailToSend()) {
      this.loading = true;
      this.emailService.sendEmailSingle(this.companyId, this.formatToSend(this.dataSendEmail)).subscribe({
        next: (response) => {
          this.loading = false;
          const message: string = response.mensagem;
          this.modal.close({ status: true, message: message });
        },
        error: (response) => {
          this.loading = false;
          this.snackbar.open = true;
          this.snackbar.message = response.error.mensagem;
          this.snackbar.type = SnackbarType.Danger;
        }
      })
    }
  }

  setConfigEmail() {
    if (this.configEmail !== null) {
      if (this.configEmail.destinatario === null || this.configEmail.destinatario.length === 0) {
        this.haveRecipient = false;
      } else {
        this.dataSendEmail.destinatario = this.configEmail.destinatario.join('; ');
      }
      this.attachments = this.configEmail.anexos;
      this.dataSendEmail.remetente = this.configEmail.remetente;
      this.dataSendEmail.assunto = this.configEmail.assunto;
      this.dataSendEmail.corpoEmail = this.configEmail.corpoEmail;
      this.dataSendEmail.anexos = this.configEmail.anexosSelecionados;
    } else {
      this.haveRecipient = false;
    }
  }

  changeAttachment(attachment: string) {
    if (this.dataSendEmail.anexos.includes(attachment)) {
      this.dataSendEmail.anexos.splice(this.dataSendEmail.anexos.indexOf(attachment), 1)
    } else {
      this.dataSendEmail.anexos.push(attachment);
    }
  }

  isValidEmailCopy() {
    if (this.dataSendEmail.copia.includes(';')) {
      let emails = this.dataSendEmail.copia.split(';');
      emails = emails.map(email => email.trim());

      let haveInvalid: boolean = false;
      for (let email of emails) {
        if (email !== '' && !isValidEmail(email)) haveInvalid = true;
      }

      if (haveInvalid) {
        this.emailCopyInvalid = true;
        this.emailCopyInvalidMessage = 'formatoEmailInvalido';
      } else {
        this.emailCopyInvalid = false;
        this.emailCopyInvalidMessage = '';
      }

    } else {
      if (this.dataSendEmail.copia === '' || isValidEmail(this.dataSendEmail.copia.trim())) {
        this.emailCopyInvalid = false;
        this.emailCopyInvalidMessage = '';
      } else {
        this.emailCopyInvalid = true;
        this.emailCopyInvalidMessage = 'formatoEmailInvalido';
      }
    }
  }

  isValidEmailRecipient() {
    if (this.dataSendEmail.destinatario.includes(';')) {
      let emails = this.dataSendEmail.destinatario.split(';');
      emails = emails.map(email => email.trim());

      let haveInvalid: boolean = false;
      for (let email of emails) {
        if (email !== '' && !isValidEmail(email)) haveInvalid = true;
      }

      if (haveInvalid) {
        this.emailRecipientInvalid = true;
        this.emailRecipientInvalidMessage = 'formatoEmailInvalido';
      } else {
        this.emailRecipientInvalid = false;
        this.emailRecipientInvalidMessage = '';
      }

    } else {
      if (this.dataSendEmail.destinatario === '' || isValidEmail(this.dataSendEmail.destinatario.trim())) {
        this.emailRecipientInvalid = false;
        this.emailRecipientInvalidMessage = '';
      } else {
        this.emailRecipientInvalid = true;
        this.emailRecipientInvalidMessage = 'formatoEmailInvalido';
      }
    }
  }

  close() {
    this.modal.close({ status: false, message: null });
  }

  formatToSend(email: DataSendEmail): SendEmailSingle {
    const emailFormatted: SendEmailSingle = {
      modulo: this.module,
      parametros: this.params,
      remetente: email.remetente,
      destinatario: formatEmailsField(email.destinatario),
      copia: formatEmailsField(email.copia),
      assunto: email.assunto,
      corpoEmail: email.corpoEmail,
      anexos: email.anexos
    }

    return emailFormatted;
  }

  verifyEmailToSend(): boolean {
    if (this.dataSendEmail.destinatario.trim() &&
      this.dataSendEmail.assunto.trim() &&
      this.dataSendEmail.corpoEmail.trim()
    ) {
      if (this.emailRecipientInvalid || this.emailCopyInvalid) {
        this.snackbar.open = true;
        this.snackbar.message = 'emailFormatoInvalido';
        this.snackbar.type = SnackbarType.Default;
        return false;
      }

      if (this.dataSendEmail.anexos.length === 0) {
        this.snackbar.open = true;
        this.snackbar.message = 'selecioneAnexoEmail';
        this.snackbar.type = SnackbarType.Default;
        return false;
      }

      return true;
    } else {
      this.snackbar.open = true;
      this.snackbar.message = 'preenchaCamposObrigatorios';
      this.snackbar.type = SnackbarType.Default;
      this.alertRequired = true;
      return false;
    }
  }

}
