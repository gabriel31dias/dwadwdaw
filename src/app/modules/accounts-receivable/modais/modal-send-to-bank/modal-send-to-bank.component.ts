import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { ReceivableService } from '../../services/receivable.service';
import { b64toBlob } from 'src/app/modules/shared/utils/b64-to-blob';

@Component({
  selector: 'app-modal-send-to-bank',
  templateUrl: './modal-send-to-bank.component.html',
  styleUrls: ['./modal-send-to-bank.component.scss']
})
export class ModalSendToBankComponent {

  type: 0 | 1 | null = null;
  companyId: string;
  idBill: string = '';
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();

  constructor(
    private modal: NgbActiveModal,
    private storage: StorageService,
    private receivableService: ReceivableService
  ) {
    this.companyId = storage.getCompanyId()!;
  }

  close() {
    this.modal.close(false);
  }

  confirm() {
    if (this.type === null) {
      this.snackbar.open = true;
      this.snackbar.message = 'Selecione uma opção.';
    } else {
      this.getBillsReceive();
    }
  }

  getBillsReceive() {
    this.loading = true;
    this.receivableService.getFileSendToBank(this.companyId, this.idBill, this.type!).subscribe({
      next: (response) => {
        this.loading = false;
        const base64 = response.dados;
        this.downloadFile(base64, `Fatura${this.idBill}_${this.type == 0 ? 'CNAB' : 'API/Webservice'}`);

        if (this.type === 0) {
          this.modal.close(`CNAB da Fatura ${this.idBill} baixado com sucesso.`);
        } else {
          this.modal.close(`API/Webservice da Fatura ${this.idBill} baixado com sucesso.`);
        }
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      },
    });
  }

  downloadFile(base64: string, fileName: string) {
    const blob = b64toBlob(base64, 'text/plain');
    const url = window.URL.createObjectURL(blob);
    const aElement = document.createElement('a');

    document.body.appendChild(aElement);
    aElement.href = url;
    aElement.download = fileName;
    aElement.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(aElement);
  }
}
