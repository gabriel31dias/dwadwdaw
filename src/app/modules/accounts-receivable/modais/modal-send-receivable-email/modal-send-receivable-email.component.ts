import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { FaturaEmail } from '../../models/bill-email.model';
import { ReceivableService } from '../../services/receivable.service';

@Component({
  selector: 'app-modal-send-receivable-email',
  templateUrl: './modal-send-receivable-email.component.html',
  styleUrls: ['./modal-send-receivable-email.component.scss']
})
export class ModalSendReceivableEmailComponent implements OnInit {

  companyId: string;
  idBills: string[] = [];
  billEmail: FaturaEmail = <FaturaEmail>{};
  snackbar: Snackbar = new Snackbar();
  loading: boolean = false;

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal,
    private storage: StorageService,
    private receivableService: ReceivableService
  ) {
    translate.use('pt-br');
    this.companyId = storage.getCompanyId()!;
    this.billEmail.remetente = `<${storage.getNameUser()}> ${storage.getEmail()}`
    this.billEmail.options = {
      fatura: false,
      boleto: false,
      documentosRelacionados: false,
      doccob: false
    }
  }

  ngOnInit(): void {
    const idsFomatted = this.idBills.map(id => `#${id}`).join(', ');
    this.billEmail.assunto = `Fatura(s) ${idsFomatted}`
  }

  close() {
    this.modal.close(false);
  }

  confirm() {
    if (this.billEmail.destinatario) {
      this.loading = true;
      this.receivableService.sendReceivablesToEmail(this.companyId, { ids: this.idBills, emailDestinatario: this.billEmail.destinatario.trim() }).subscribe({
        next: (response) => {
          this.loading = false;
          this.modal.close(true);
        },
        error: (response) => {
          this.loading = false;
          this.snackbar.open = true;
          this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
        }
      })
    } else {
      this.snackbar.open = true;
      this.snackbar.message = 'insiraDestinatario';
    }
  }

}
