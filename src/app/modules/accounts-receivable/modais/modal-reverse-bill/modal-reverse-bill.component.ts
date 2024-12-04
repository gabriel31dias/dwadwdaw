import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Snackbar } from 'src/app/modules/shared/models/snackbar.model';
import { StorageService } from 'src/app/modules/authentication/services/storage.service';
import { ReceivableService } from '../../services/receivable.service';

@Component({
  selector: 'app-modal-reverse-bill',
  templateUrl: './modal-reverse-bill.component.html',
  styleUrls: ['./modal-reverse-bill.component.scss']
})
export class ModalReverseBillComponent {

  companyId: string;
  loading: boolean = false;
  snackbar: Snackbar = new Snackbar();
  idsBill: string[] = [];
  billSelecteds: number = 0;
  valueBills: string = 'R$ 0,00';

  constructor(private translate: TranslateService,
    private modal: NgbActiveModal,
    private storage: StorageService,
    private receivableService: ReceivableService
  ) {
    this.companyId = storage.getCompanyId()!;
  }

  // Fecha o modal.
  close() {
    this.modal.close();
  }

  // Confirma o estorno da(s) faturas(s).
  confirm() {
    this.loading = true;
    this.receivableService.reverseBill(this.companyId, this.idsBill).subscribe({
      next: (response) => {
        this.loading = false;
        this.modal.close('success');
      },
      error: (response) => {
        this.loading = false;
        this.snackbar.open = true;
        this.snackbar.message = response.error.mensagem;
        this.snackbar.errorHandling = response.error.tratamentoErro;
      }
    })
  }

}
