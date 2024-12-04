import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Snackbar } from '../../../models/snackbar.model';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { formatEmailsField, isValidEmail } from '../../../utils/email.utils';
import { Modules } from '../../../consts/list-modules.const';
import { SnackbarType } from '../../../consts/snackbar-type.const';
import { EmailService } from '../../../services/email.service';
import { KeyValue } from '../../../models/key-value.model';
import { SendEmailMultiple } from '../../../models/send-email.model';

@Component({
  selector: 'app-modal-send-email-multiple',
  templateUrl: './modal-send-email-multiple.component.html',
  styleUrls: ['./modal-send-email-multiple.component.scss']
})
export class ModalSendEmailMultipleComponent implements OnInit {

  companyId: string;
  module: Modules = '';
  params: KeyValue[][] = [];
  recipient: string = '';
  titleModal: string = 'Título do modal';
  textModal: string = 'Texto do modal';
  snackbar: Snackbar = new Snackbar();
  loading: boolean = false;
  emailCopyInvalid: boolean = false;
  emailCopyInvalidMessage: string = '';
  emailCopy: string = '';

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal,
    private storageService: StorageService,
    private emailService: EmailService
  ) {
    translate.use('pt-br');
    this.companyId = storageService.getCompanyId()!;
  }

  ngOnInit(): void {

  }

  isValidEmailCopy() {
    if (this.emailCopy.includes(';')) {
      let emails = this.emailCopy.split(';');
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
      if (this.emailCopy === '' || isValidEmail(this.emailCopy.trim())) {
        this.emailCopyInvalid = false;
        this.emailCopyInvalidMessage = '';
      } else {
        this.emailCopyInvalid = true;
        this.emailCopyInvalidMessage = 'formatoEmailInvalido';
      }
    }
  }

  close() {
    this.modal.close();
  }

  sendEmail() {
    if (this.verifyEmailToSend()) {
      this.loading = true;
      this.emailService.sendEmailMultiple(this.companyId, this.formatToSend()).subscribe({
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

  formatToSend(): SendEmailMultiple {
    const emailFormatted: SendEmailMultiple = {
      modulo: this.module,
      parametros: this.params,
      remetente: this.recipient,
      copia: formatEmailsField(this.emailCopy)
    }

    return emailFormatted;
  }

  verifyEmailToSend(): boolean {
    if (this.emailCopyInvalid) {
      this.snackbar.open = true;
      this.snackbar.message = 'emailFormatoInvalido';
      this.snackbar.type = SnackbarType.Default;
      return false;
    }

    return true;
  }

}
